package com.example.demo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex) {
        System.err.println("[ERROR] GLOBAL EXCEPTION: " + ex.getMessage());
        ex.printStackTrace();
        
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        error.put("error", ex.getClass().getSimpleName());
        
        return ResponseEntity.internalServerError().body(error);
    }
}
