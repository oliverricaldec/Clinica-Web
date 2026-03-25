package com.clinica.api.web.dto.response;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
public record RegistroResponse(
        Long id,
        LocalDate fechaAtencion,
        String evolucion,
        String procedimientoRealizado,
        String doctorResponsable,
        BigDecimal montoAbonado,
        String observaciones,

        Long idCaso
) { }
