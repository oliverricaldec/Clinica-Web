package com.clinica.api.web.dto.response;

import com.clinica.api.modules.casos.domain.enums.EstadoCaso;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CasoResponse(

        Long id,
        String diagnostico,
        String planTratamiento,
        String examenAuxiliar,
        String proformaUrl,
        String odontogramaUrl,
        BigDecimal costoTotal,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        EstadoCaso estado

) {}