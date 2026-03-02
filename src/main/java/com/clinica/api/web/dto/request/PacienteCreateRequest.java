package com.clinica.api.web.dto.request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record PacienteCreateRequest (

    @NotBlank
    @Pattern(regexp = "^[0-9]{8}$", message = "El DNI debe tener 8 digitos")
    String dni,

    @NotBlank @Size(min=2 , max=80)
    String nombres,

    @NotBlank @Size(min = 2, max = 80)
    String apellidos,

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    LocalDate fechaNacimiento,

    @NotBlank @Size(max = 20)
    String sexo,

    @NotBlank @Size(max = 15)
    String telefono,

    @NotBlank @Size(max = 150)
    String direccion,

    @NotBlank @Email @Size(max = 100)
    String email,

    @Size(max = 500)
    String antecedentesMedicosUrl,

    @Size(max = 500)
    String antecedentesOdontologicosUrl
    ){}
