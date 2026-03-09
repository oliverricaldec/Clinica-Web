package com.clinica.api.web.dto.update;

import java.math.BigDecimal;

public record RegistroUpdateRequest (
    String evolucion,
    String procedimientoRealizado,
    String doctorResponsable,
    BigDecimal montoAbonado,
    String observaciones
) {}
