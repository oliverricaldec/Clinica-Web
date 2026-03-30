package com.clinica.api.web.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record CasoCreateRequest(

        @NotBlank(message = "Debe asiganr un nombre al caso")
        @Size(max = 120)
        String nombreCaso,

        @NotBlank(message = "El diagnóstico es obligatorio")
        @Size(min = 5, max = 500, message = "El diagnóstico debe tener entre 5 y 500 caracteres")
        String diagnostico,

        @NotBlank(message = "El plan de tratamiento es obligatorio")
        @Size(min = 5, max = 1000)
        String planTratamiento,

        @Size(max = 1000)
        String examenAuxiliar,

        @Size(max = 500)
        String proformaUrl,

        List<CasoImagenRequest> imagenes,

        @NotNull(message = "El costo total es obligatorio")
        @DecimalMin(value = "0.0", inclusive = false, message = "El costo debe ser mayor a 0")
        @Digits(integer = 10, fraction = 2)
        BigDecimal costoTotal,

        @NotNull
        LocalDate fechaInicio

) {}