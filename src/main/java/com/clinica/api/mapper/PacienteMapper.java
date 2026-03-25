package com.clinica.api.mapper;

import com.clinica.api.modules.paciente.domain.entity.Paciente;
import com.clinica.api.web.dto.request.PacienteCreateRequest;
import com.clinica.api.web.dto.response.PacienteResponse;
import com.clinica.api.web.dto.update.PacienteUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class PacienteMapper {

    public Paciente toEntity(PacienteCreateRequest dto){
        Paciente p = new Paciente();
        p.setDni(dto.dni());
        p.setNombres(dto.nombres());
        p.setApellidos(dto.apellidos());
        p.setFechaNacimiento(dto.fechaNacimiento());
        p.setSexo(dto.sexo());
        p.setTelefono(dto.telefono());
        p.setDireccion(dto.direccion());
        p.setEmail(dto.email());
        p.setFechaRegistro(dto.fechaRegistro());
        p.setAntecMedicos(dto.antecedentesMedicosUrl());
        p.setAntecOdon(dto.antecedentesOdontologicosUrl());
        // fechaRegistro se setea en service (backend)-- Actualizacion 23/03/26 : ya no, en caos el usuario desee guardar un paciente en otro momento
        return p;
    }

    public PacienteResponse toResponse(Paciente p) {
        Long hcId = (p.getHistoriaClinica() != null) ? p.getHistoriaClinica().getId() : null;

        return new PacienteResponse(
                p.getId(),
                p.getDni(),
                p.getNombres(),
                p.getApellidos(),
                p.getFechaNacimiento(),
                p.getSexo(),
                p.getTelefono(),
                p.getDireccion(),
                p.getEmail(),
                p.getFechaRegistro(),
                p.getAntecMedicos(),
                p.getAntecOdon(),
                hcId
        );
    }

    public void updateEntity(Paciente p, PacienteUpdateRequest dto){

        if (dto.dni() != null)
            p.setDni(dto.dni());

        if (dto.nombres() != null)
            p.setNombres(dto.nombres());

        if (dto.apellidos() != null)
            p.setApellidos(dto.apellidos());

        if (dto.fechaNacimiento() != null)
            p.setFechaNacimiento(dto.fechaNacimiento());

        if (dto.sexo() != null)
            p.setSexo(dto.sexo());

        if (dto.telefono() != null)
            p.setTelefono(dto.telefono());

        if (dto.direccion() != null)
            p.setDireccion(dto.direccion());

        if (dto.email() != null)
            p.setEmail(dto.email());

        if (dto.fechaRegistro() != null)
            p.setFechaRegistro(dto.fechaRegistro());

        if (dto.antecedentesMedicosUrl() != null)
            p.setAntecMedicos(dto.antecedentesMedicosUrl());

        if (dto.antecedentesOdontologicosUrl() != null)
            p.setAntecOdon(dto.antecedentesOdontologicosUrl());
    }
}
