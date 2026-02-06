package com.clinica.api.mapper;

import com.clinica.api.modules.paciente.domain.entity.Paciente;
import com.clinica.api.web.dto.request.PacienteCreateRequest;
import com.clinica.api.web.dto.response.PacienteResponse;
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
        p.setAntecMedicos(dto.antecedentesMedicosUrl());
        p.setAntecOdon(dto.antecedentesOdontologicosUrl());
        // fechaRegistro se setea en service (backend)
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

}
