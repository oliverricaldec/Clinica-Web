package com.clinica.api.web.dto.response;

import java.time.LocalDate;

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
