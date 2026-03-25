package com.clinica.api.web.dto.update;


import com.clinica.api.modules.casos.domain.enums.EstadoCaso;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CasoUpdateRequest(

        @Size(max = 120, message = "Maximo 120 caracteres")
        String nombreCaso,

        @Size(min = 5, max = 500, message = "Maximo 500 caracteres y minimo 5")
        String diagnostico,

        @Size(min = 5, max = 1000, message = "Maximo 1000 caracteres y minimo 5")
        String planTratamiento,

        @Size(max = 1000, message = "Maximo 1000 caracteres")
        String examenAuxiliar,

        @Size(max = 500, message = "Maximo 500 caracteres")
        String proformaUrl,

        @Size(max = 500, message = "Maximo 500 caracteres")
        String odontogramaUrl,

        @DecimalMin(value = "0.0", message = "No numeros negativos")
        @Digits(integer = 10, fraction = 2)
        BigDecimal costoTotal,

        LocalDate fechaInicio,

        LocalDate fechaFin,

        EstadoCaso estado

) {}