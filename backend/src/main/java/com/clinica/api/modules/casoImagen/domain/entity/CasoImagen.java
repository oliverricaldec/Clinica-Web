package com.clinica.api.modules.casoImagen.domain.entity;

import com.clinica.api.modules.casoImagen.domain.enums.TipoImagen;
import com.clinica.api.modules.casos.domain.entity.Caso;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        name = "caso_imagen"
)
public class CasoImagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoImagen tipo;

    @ManyToOne
    @JoinColumn(name = "caso_id",nullable = false)
    private Caso caso;
}