package com.clinica.api.web.dto.response;

import com.clinica.api.modules.casos.domain.enums.EstadoCaso;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Builder
public record CasoResponse(

        Long id,
        String nombreCaso,
        String diagnostico,
        String planTratamiento,
        String examenAuxiliar,
        String proformaUrl,
        List<CasoImagenResponse> imagenes,
        BigDecimal costoTotal,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        EstadoCaso estado,

        Long idHistoriaClinica
) {}