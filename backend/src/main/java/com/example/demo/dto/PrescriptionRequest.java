package com.example.demo.dto;

public class PrescriptionRequest {
    private String medicines;
    private String instructions;

    public PrescriptionRequest() {
    }

    public PrescriptionRequest(String medicines, String instructions) {
        this.medicines = medicines;
        this.instructions = instructions;
    }

    public String getMedicines() {
        return medicines;
    }

    public void setMedicines(String medicines) {
        this.medicines = medicines;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}
