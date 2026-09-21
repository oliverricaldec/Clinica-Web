package com.clinica.api.modules.cita.service;

import com.clinica.api.modules.cita.entity.Cita;
import com.clinica.api.modules.cita.repository.CitaRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
public class CitaRecordatorioScheduler {

    private final CitaRepository citaRepository;
    private final EmailService emailService;

    public CitaRecordatorioScheduler(CitaRepository citaRepository, EmailService emailService) {
        this.citaRepository = citaRepository;
        this.emailService = emailService;
    }

    // Se ejecuta todos los días a las 08:00 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void enviarRecordatoriosDiarios() {
        // 1. Obtener rango para dentro de 2 días
        LocalDate dosDias = LocalDate.now().plusDays(2);
        List<Cita> citasDosDias = citaRepository.findCitasBetweenDates(
                dosDias.atStartOfDay(),
                dosDias.atTime(LocalTime.MAX)
        );

        // 2. Obtener rango para dentro de 1 día (mañana)
        LocalDate unDia = LocalDate.now().plusDays(1);
        List<Cita> citasUnDia = citaRepository.findCitasBetweenDates(
                unDia.atStartOfDay(),
                unDia.atTime(LocalTime.MAX)
        );

        // 3. Unir ambas listas de citas
        List<Cita> citasAProcesar = new ArrayList<>();
        citasAProcesar.addAll(citasDosDias);
        citasAProcesar.addAll(citasUnDia);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy 'a las' HH:mm 'hrs'");

        // 4. Procesar y enviar los correos
        for (Cita cita : citasAProcesar) {
            String emailPaciente = cita.getPaciente().getEmail();

            // Enviar solo si tiene email y la cita no está cancelada ni completada
            if (emailPaciente != null && !emailPaciente.isBlank()
                    && !"CANCELADA".equalsIgnoreCase(cita.getEstado())
                    && !"COMPLETADA".equalsIgnoreCase(cita.getEstado())) {

                String fechaFormateada = cita.getFechaHora().format(formatter);
                String nombreCompleto = cita.getPaciente().getNombres() + " " + cita.getPaciente().getApellidos();

                emailService.enviarRecordatorioCita(
                        emailPaciente,
                        nombreCompleto,
                        fechaFormateada,
                        cita.getMotivo(),
                        cita.getDoctorResponsable()
                );
            }
        }
    }
}