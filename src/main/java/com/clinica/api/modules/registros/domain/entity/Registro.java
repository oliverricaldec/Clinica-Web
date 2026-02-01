package com.clinica.api.modules.registros.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(
        name = "registros"
)
public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "fecha_atencion")
    private LocalDate fechaAtencion;

    @Column(nullable = false)
    private String evolucion;

    @Column(name = "procedimiento_realizado")
    private String proceRealizado;

    @Column(nullable = false, name = "doctor_responsable")
    private String doctor;

    @Column(nullable = false, name = "monto_abonado")
    private BigDecimal abono;

    @Column(name = "observaciones")
    private String observaciones;
}
