package com.clinica.api.modules.historiaClinica.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(
        name = "historiasClinicas"
)
public class HistoriaClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "fecha_creacion")
    private LocalDate fechaCreacion;
}
