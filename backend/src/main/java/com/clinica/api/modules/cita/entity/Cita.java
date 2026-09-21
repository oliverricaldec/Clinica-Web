package com.clinica.api.modules.cita.entity;

import com.clinica.api.modules.paciente.domain.entity.Paciente;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "citas")
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "motivo")
    private String motivo;

    @Column(name = "doctor_responsable")
    private String doctorResponsable;

    @Column(name = "estado", nullable = false)
    private String estado = "PROGRAMADA"; // PROGRAMADA, CONFIRMADA, COMPLETADA, CANCELADA, NO_ASISTIO

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    // Getters, Setters, Constructores
    public Cita() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public String getDoctorResponsable() { return doctorResponsable; }
    public void setDoctorResponsable(String doctorResponsable) { this.doctorResponsable = doctorResponsable; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}