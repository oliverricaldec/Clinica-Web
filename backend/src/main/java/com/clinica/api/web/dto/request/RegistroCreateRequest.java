package com.clinica.api.web.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RegistroCreateRequest(

        @NotBlank
        @Size(max = 150)
        String evolucion,

        @NotBlank
        @Size(max = 250)
        String procedimientoRealizado,

        @NotBlank
        @Size(max = 40)
        String doctorResponsable,

        @NotNull
        @PositiveOrZero
        @Digits(integer = 8,fraction = 2)
        BigDecimal montoAbonado,

        @NotNull
        LocalDate fechaAtencion,

        String observaciones
) {}
