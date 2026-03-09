package com.clinica.api.web.dto.update;


import com.clinica.api.modules.casos.domain.enums.EstadoCaso;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CasoUpdateRequest(

        @NotBlank(message = "El diagnóstico es obligatorio")
        @Size(min = 5, max = 500)
        String diagnostico,

        @NotBlank(message = "El plan de tratamiento es obligatorio")
        @Size(min = 5, max = 1000)
        String planTratamiento,

        @Size(max = 1000)
        String examenAuxiliar,

        @Size(max = 500)
        String proformaUrl,

        @Size(max = 500)
        String odontogramaUrl,

        @NotNull(message = "El costo total es obligatorio")
        @DecimalMin(value = "0.0", inclusive = false)
        @Digits(integer = 10, fraction = 2)
        BigDecimal costoTotal,

        @NotNull(message = "El estado es obligatorio")
        EstadoCaso estado

) {}