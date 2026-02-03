package com.clinica.api.modules.paciente.service;


import com.clinica.api.modules.historiaClinica.domain.entity.HistoriaClinica;
import com.clinica.api.modules.historiaClinica.repository.HistoriaClinicaRepository;
import com.clinica.api.modules.paciente.domain.entity.Paciente;
import com.clinica.api.modules.paciente.repository.PacienteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final HistoriaClinicaRepository historiaClinicaRepository;

    public PacienteService(PacienteRepository pacienteRepository, HistoriaClinicaRepository historiaClinicaRepository) {
        this.pacienteRepository = pacienteRepository;
        this.historiaClinicaRepository = historiaClinicaRepository;
    }

    public Paciente crearPaciente(Paciente paciente) {
        // 1. validar dni
        if (pacienteRepository.existsByDni(paciente.getDni())){
            throw new IllegalArgumentException("Ya existe un paciente con ese DNI");
        }

        // 2. guardar paciente
        Paciente pacienteGuardado = pacienteRepository.save(paciente);

        // 3. crear historia clinica
        HistoriaClinica historiaClinica = new HistoriaClinica();
        historiaClinica.setPaciente(pacienteGuardado);
        historiaClinica.setFechaCreacion(LocalDate.now());

        historiaClinicaRepository.save(historiaClinica);

        return pacienteGuardado;
    }

}
