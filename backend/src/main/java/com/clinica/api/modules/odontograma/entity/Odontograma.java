package com.clinica.api.modules.odontograma.entity;

import com.clinica.api.modules.paciente.domain.entity.Paciente;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "odontogramas")
public class Odontograma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    private LocalDateTime fechaCreacion;
    private String doctorResponsable;

    // Almacena la estructura de los dientes (piezas, estados, hallazgos) en formato JSON
    @Column(columnDefinition = "TEXT")
    private String datosDientesJson;

    private String observaciones;

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // Getters y Setters
}