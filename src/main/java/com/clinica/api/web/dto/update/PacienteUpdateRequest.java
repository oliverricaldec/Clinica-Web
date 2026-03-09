package com.clinica.api.web.dto.update;

public record PacienteUpdateRequest (
    String nombres,
    String apellidos,
    String dni
) { }
