package com.clinica.api.modules.paciente.service;


import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.web.dto.request.PacienteCreateRequest;
import com.clinica.api.web.dto.response.PageResponse;
import com.clinica.api.web.dto.update.PacienteUpdateRequest;
import com.clinica.api.web.dto.response.PacienteResponse;
import com.clinica.api.modules.historiaClinica.domain.entity.HistoriaClinica;
import com.clinica.api.modules.paciente.domain.entity.Paciente;
import com.clinica.api.exception.ConflictException;
import com.clinica.api.mapper.PacienteMapper;
import com.clinica.api.modules.historiaClinica.repository.HistoriaClinicaRepository;
import com.clinica.api.modules.paciente.repository.PacienteRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;


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
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        return pacienteMapper.toResponse(paciente);
    }

    public PageResponse<PacienteResponse> listar(Pageable pageable) {

        Page<PacienteResponse> page = pacienteRepository
                .findAll(pageable)
                .map(pacienteMapper::toResponse);

        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

    public PacienteResponse actualizar(Long id, PacienteUpdateRequest request) {

        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        pacienteMapper.updateEntity(paciente,request);
        Paciente actualizado = pacienteRepository.save(paciente);

        return pacienteMapper.toResponse(actualizado);
    }

    public void eliminar(Long id){
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Paciente no encontrado"));

        pacienteRepository.delete(paciente);
    }

    public PacienteResponse buscarPorDNI(String DNI){
        Paciente paciente = pacienteRepository.findByDni(DNI)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente con ese DNI no encontrado"));

        return pacienteMapper.toResponse(paciente);

    }

}
