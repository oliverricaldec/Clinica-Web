package com.clinica.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;


import java.time.Instant;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        List<?> details = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> new FieldErrorResponse(err.getField(), err.getDefaultMessage()))
                .toList();

        return ResponseEntity.badRequest().body(new ApiError(
                Instant.now().toString(),
                400,
                "Validation failed",
                details
        ));
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<?> handleConflict(ConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiError(
                Instant.now().toString(),
                409,
                ex.getMessage(),
                null
        ));
    }

    public record ApiError(String timestamp, int status, String message, Object details) {}
    public record FieldErrorResponse(String field, String message) {}
}
