package com.example.demo.service;

import com.example.demo.model.Appointment;
import com.example.demo.model.AppointmentStatus;
import com.example.demo.repository.AppointmentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReminderService {

    private final AppointmentRepository appointmentRepository;

    public ReminderService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    /**
     * Runs every minute to check for upcoming appointments.
     * Simulates sending a reminder SMS to the doctor.
     */
    @Scheduled(fixedRate = 60000)
    public void sendReminders() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        
        // In a real app, you'd fetch all appointments for today and filter.
        // For simulation, we'll just log any ACCEPTED appointment matching the current minute.
        List<Appointment> allAppointments = appointmentRepository.findAll();
        
        for (Appointment appt : allAppointments) {
            if (appt.getStatus() == AppointmentStatus.ACCEPTED && 
                appt.getAppointmentDate().equals(today) &&
                appt.getAppointmentTime().truncatedTo(ChronoUnit.MINUTES).equals(now)) {
                
                System.out.println("[REMINDER] SMS SENT TO DR. " + appt.getDoctor().getName().toUpperCase() + 
                    " (" + appt.getDoctor().getPhone() + "): " +
                    "Your appointment with " + appt.getPatient().getName() + " starts NOW.");
            }
        }
    }
}
