package com.clinica.api.modules.paciente.service;


import com.clinica.api.web.dto.request.PacienteCreateRequest;
import com.clinica.api.web.dto.request.PacienteUpdateRequest;
import com.clinica.api.web.dto.response.PacienteResponse;
import com.clinica.api.modules.historiaClinica.domain.entity.HistoriaClinica;
import com.clinica.api.modules.paciente.domain.entity.Paciente;
import com.clinica.api.exception.ConflictException;
import com.clinica.api.mapper.PacienteMapper;
import com.clinica.api.modules.historiaClinica.repository.HistoriaClinicaRepository;
import com.clinica.api.modules.paciente.repository.PacienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final HistoriaClinicaRepository historiaClinicaRepository;
    private final PacienteMapper pacienteMapper;


    public PacienteService(PacienteRepository pacienteRepository, HistoriaClinicaRepository historiaClinicaRepository, PacienteMapper pacienteMapper) {
        this.pacienteRepository = pacienteRepository;
        this.historiaClinicaRepository = historiaClinicaRepository;
        this.pacienteMapper = pacienteMapper;
    }

    @Transactional
    public PacienteResponse crear(PacienteCreateRequest request) {

        if (pacienteRepository.existsByDni(request.dni())) {
            throw new ConflictException("El DNI ya está registrado.");
        }

        Paciente paciente = pacienteMapper.toEntity(request);
        paciente.setFechaRegistro(LocalDate.now());

        Paciente pacienteGuardado = pacienteRepository.save(paciente);

        HistoriaClinica hc = new HistoriaClinica();
        hc.setPaciente(pacienteGuardado);
        hc.setFechaCreacion(LocalDate.now());

        HistoriaClinica hcGuardada = historiaClinicaRepository.save(hc);

        // Para que el response tenga historiaClinicaId sin depender de que JPA sincronice:
        pacienteGuardado.setHistoriaClinica(hcGuardada);

        return pacienteMapper.toResponse(pacienteGuardado);
    }

    public PacienteResponse obtenerPorId(Long id) {

        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        return pacienteMapper.toResponse(paciente);
    }

    public List<PacienteResponse> listar(){
        return pacienteRepository.findAll()
                .stream()
                .map(pacienteMapper::toResponse)
                .toList();
    }

    public PacienteResponse actualizar(Long id, PacienteUpdateRequest request) {

        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        paciente.setNombres(request.nombres());
        paciente.setApellidos(request.apellidos());
        paciente.setDni(request.dni());

        pacienteRepository.save(paciente);

        return pacienteMapper.toResponse(paciente);
    }

    public void eliminar(Long id){
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Paciente no encontrado"));

        pacienteRepository.delete(paciente);
    }
}
