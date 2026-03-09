package com.clinica.api.web.dto.response;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record PacienteResponse(
        Long id,
        String dni,
        String nombres,
        String apellidos,
        LocalDate fechaNacimiento,
        String sexo,
        String telefono,
        String direccion,
        String email,
        LocalDate fechaRegistro,
        String antecedentesMedicosUrl,
        String antecedentesOdontologicosUrl,
        Long historiaClinicaId
) {}
