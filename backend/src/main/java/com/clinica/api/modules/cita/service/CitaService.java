package com.clinica.api.modules.cita.service;

import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.web.dto.request.CitaRequest;
import com.clinica.api.web.dto.response.CitaResponse;
import com.clinica.api.modules.cita.entity.Cita;
import com.clinica.api.modules.cita.repository.CitaRepository;
import com.clinica.api.modules.paciente.domain.entity.Paciente;
import com.clinica.api.modules.paciente.repository.PacienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CitaService {

    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;

    public CitaService(CitaRepository citaRepository, PacienteRepository pacienteRepository) {
        this.citaRepository = citaRepository;
        this.pacienteRepository = pacienteRepository;
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> obtenerTodas() {
        return citaRepository.findAll().stream()
                .map(CitaResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public CitaResponse obtenerPorId(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));
        return CitaResponse.fromEntity(cita);
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> obtenerPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
        return citaRepository.findCitasBetweenDates(inicio, fin).stream()
                .map(CitaResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> obtenerPorPaciente(Long pacienteId) {
        return citaRepository.findByPacienteIdOrderByFechaHoraDesc(pacienteId).stream()
                .map(CitaResponse::fromEntity)
                .toList();
    }

    @Transactional
    public CitaResponse crearCita(CitaRequest request) {
        Paciente paciente = pacienteRepository.findById(request.pacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con ID: " + request.pacienteId()));

        Cita cita = new Cita();
        cita.setPaciente(paciente);
        cita.setFechaHora(request.fechaHora());
        cita.setMotivo(request.motivo());
        cita.setDoctorResponsable(request.doctorResponsable());
        cita.setEstado(request.estado() != null ? request.estado() : "PROGRAMADA");
        cita.setObservaciones(request.observaciones());

        Cita guardada = citaRepository.save(cita);
        return CitaResponse.fromEntity(guardada);
    }

    @Transactional
    public CitaResponse actualizarCita(Long id, CitaRequest request) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));

        if (!cita.getPaciente().getId().equals(request.pacienteId())) {
            Paciente nuevoPaciente = pacienteRepository.findById(request.pacienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con ID: " + request.pacienteId()));
            cita.setPaciente(nuevoPaciente);
        }

        cita.setFechaHora(request.fechaHora());
        cita.setMotivo(request.motivo());
        cita.setDoctorResponsable(request.doctorResponsable());
        if (request.estado() != null) {
            cita.setEstado(request.estado());
        }
        cita.setObservaciones(request.observaciones());

        Cita actualizada = citaRepository.save(cita);
        return CitaResponse.fromEntity(actualizada);
    }

    @Transactional
    public CitaResponse cambiarEstado(Long id, String nuevoEstado) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));
        cita.setEstado(nuevoEstado);
        return CitaResponse.fromEntity(citaRepository.save(cita));
    }

    @Transactional
    public void eliminarCita(Long id) {
        if (!citaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cita no encontrada con ID: " + id);
        }
        citaRepository.deleteById(id);
    }
}