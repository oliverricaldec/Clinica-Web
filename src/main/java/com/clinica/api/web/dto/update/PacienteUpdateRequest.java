package com.clinica.api.web.dto.update;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record PacienteUpdateRequest (

        @Pattern(regexp = "^[0-9]{8}$", message = "El DNI debe tener 8 digitos")
        String dni,

        @Size(min=2 , max=80)
        String nombres,

        @Size(min = 2, max = 80)
        String apellidos,


        @Past(message = "La fecha de nacimiento debe ser en el pasado")
        LocalDate fechaNacimiento,

        @Size(max = 20)
        String sexo,

        @Size(max = 15)
        String telefono,

        @Size(max = 150)
        String direccion,

        @Email @Size(max = 100)
        String email,

        LocalDate fechaRegistro,

        @Size(max = 500)
        String antecedentesMedicosUrl,

        @Size(max = 500)
        String antecedentesOdontologicosUrl
) { }
