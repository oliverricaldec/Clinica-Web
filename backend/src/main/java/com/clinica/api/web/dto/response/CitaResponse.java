package com.clinica.api.web.dto.response;

import com.clinica.api.modules.cita.entity.Cita;
import java.time.LocalDateTime;

public record CitaResponse(
        Long id,
        Long pacienteId,
        String nombrePaciente,
        String dniPaciente,
        LocalDateTime fechaHora,
        String motivo,
        String doctorResponsable,
        String estado,
        String observaciones
) {
    public static CitaResponse fromEntity(Cita cita) {
        return new CitaResponse(
                cita.getId(),
                cita.getPaciente().getId(),
                cita.getPaciente().getNombres() + " " + cita.getPaciente().getApellidos(),
                cita.getPaciente().getDni(),
                cita.getFechaHora(),
                cita.getMotivo(),
                cita.getDoctorResponsable(),
                cita.getEstado(),
                cita.getObservaciones()
        );
    }
}