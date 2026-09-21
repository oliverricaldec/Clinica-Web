package com.clinica.api.modules.cita.repository;

import com.clinica.api.modules.cita.entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findByPacienteIdOrderByFechaHoraDesc(Long pacienteId);

    // Consulta para filtrar citas por rango de fechas (útil para la vista del Calendario)
    @Query("SELECT c FROM Cita c JOIN FETCH c.paciente WHERE c.fechaHora BETWEEN :inicio AND :fin ORDER BY c.fechaHora ASC")
    List<Cita> findCitasBetweenDates(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    // Verificar si el doctor ya tiene una cita agendada en la misma fecha y hora
    boolean existsByDoctorResponsableAndFechaHoraAndEstadoNot(String doctorResponsable, LocalDateTime fechaHora, String estado);
}