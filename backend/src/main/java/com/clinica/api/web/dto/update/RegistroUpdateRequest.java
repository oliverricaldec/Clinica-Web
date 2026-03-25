package com.clinica.api.web.dto.update;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RegistroUpdateRequest (

        @Size(max = 150, message = "Maximo 150 caracteres")
        String evolucion,
        @Size(max = 250, message = "Maximo 250 caracteres")
        String procedimientoRealizado,
        @Size(max = 40, message = "Maximo 40 caracteres")
        String doctorResponsable,
        @PositiveOrZero(message = "No puede ser negativo")
        @Digits(integer = 8,fraction = 2)
        BigDecimal montoAbonado,

        LocalDate fechaAtencion,

        String observaciones
) {}
