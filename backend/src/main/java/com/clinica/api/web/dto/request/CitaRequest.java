package com.clinica.api.web.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record CitaRequest(
        @NotNull(message = "El ID del paciente es obligatorio")
        Long pacienteId,

        @NotNull(message = "La fecha y hora de la cita es obligatoria")
        @FutureOrPresent(message = "La cita no puede ser programada en el pasado")
        LocalDateTime fechaHora,

        @NotBlank(message = "El motivo de la cita es obligatorio")
        String motivo,

        String doctorResponsable,

        String estado, // PROGRAMADA, CONFIRMADA, COMPLETADA, CANCELADA, NO_ASISTIO

        String observaciones
) {}
