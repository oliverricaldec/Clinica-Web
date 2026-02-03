package com.clinica.api.modules.historiaClinica.domain.entity;

import com.clinica.api.modules.casos.domain.entity.Caso;
import com.clinica.api.modules.paciente.domain.entity.Paciente;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(
            name = "paciente_id",
            nullable = false,
            unique = true
    )
    private Paciente paciente;

    @OneToMany(mappedBy = "historiaClinica",fetch = FetchType.LAZY)
    private List<Caso> casos = new ArrayList<>();
}
