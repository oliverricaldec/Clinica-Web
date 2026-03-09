package com.clinica.api.modules.paciente.domain.entity;

import com.clinica.api.modules.historiaClinica.domain.entity.HistoriaClinica;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity

@Table(
        name = "pacientes",
        uniqueConstraints = {@UniqueConstraint(columnNames = "dni")}
)
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 8)
    private String dni;

    @Column(nullable = false)
    private String nombres;

    @Column(nullable = false)
    private String apellidos;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(nullable = false)
    private String sexo;

    @Column(nullable = false)
    private String telefono;
    private String direccion;
    private String email;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;

    @Column(name = "antecedentes_medicos_url")
    private String antecMedicos;

    @Column(name = "antecedentes_odontologicos_url")
    private String antecOdon;

    @OneToOne(mappedBy = "paciente",cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    private HistoriaClinica historiaClinica;
}
