package com.example.demo.controller;

import com.example.demo.dto.AppointmentRequest;
import com.example.demo.model.Appointment;
import com.example.demo.model.AppointmentStatus;
import com.example.demo.model.Prescription;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.PrescriptionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;

    public PatientController(UserRepository userRepository, AppointmentRepository appointmentRepository, PrescriptionRepository prescriptionRepository) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        return ResponseEntity.ok(userRepository.findByRole(Role.DOCTOR));
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request, Authentication authentication) {
        User patient = (User) authentication.getPrincipal();

        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!doctor.getRole().equals(Role.DOCTOR)) {
            return ResponseEntity.badRequest().body("Selected user is not a doctor");
        }

        Appointment appointment = new Appointment(
                null,
                patient,
                doctor,
                request.getAppointmentDate(),
                request.getAppointmentTime(),
                AppointmentStatus.PENDING,
                request.getNotes()
        );

        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        User patient = (User) authentication.getPrincipal();
        return ResponseEntity.ok(appointmentRepository.findByPatientId(patient.getId()));
    }

    @GetMapping("/appointments/{id}/prescription")
    public ResponseEntity<?> getPrescription(@PathVariable Long id, Authentication authentication) {
        User patient = (User) authentication.getPrincipal();
        
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
                
        if (!appointment.getPatient().getId().equals(patient.getId())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        Prescription prescription = prescriptionRepository.findByAppointmentId(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        return ResponseEntity.ok(prescription);
    }
}
