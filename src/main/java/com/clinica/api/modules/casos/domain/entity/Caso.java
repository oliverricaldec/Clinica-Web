package com.clinica.api.modules.casos.domain.entity;

import com.clinica.api.modules.casos.domain.enums.EstadoCaso;
import com.clinica.api.modules.historiaClinica.domain.entity.HistoriaClinica;
import com.clinica.api.modules.registros.domain.entity.Registro;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@Table(
        name = "casos"
)
public class Caso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "nombre_caso")
    private String nombreCaso;

    @Column(nullable = false)
    private String diagnostico;

    @Column(name = "plan_tratamiento")
    private String planTratamiento;

    @Column(name = "examen_auxiliar")
    private String examenAuxiliar;

    @Column(name = "proforma_url")
    private String proforma;

    @Column(name = "odontograma_url")
    private String odontograma;

    @Column(nullable = false, name = "costo_total")
    private BigDecimal costoTotal;

    @Column(nullable = false, name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(nullable = false, name = "fecha_fin")
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "estado_caso")
    private EstadoCaso estado;

    @ManyToOne(optional = false,fetch = FetchType.LAZY)
    @JoinColumn(
            name = "historiaClinica_id",
            nullable = false
    )
    private HistoriaClinica historiaClinica;

    @OneToMany(mappedBy = "caso", fetch = FetchType.LAZY)
    private List<Registro> registros = new ArrayList<>();
}
