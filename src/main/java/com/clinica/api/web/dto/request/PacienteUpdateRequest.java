package com.clinica.api.web.dto.request;

public record PacienteUpdateRequest (
    String nombres,
    String apellidos,
    String dni
) { }
