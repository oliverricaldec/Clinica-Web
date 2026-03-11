package com.clinica.api.modules.casos.repository;

import com.clinica.api.modules.casos.domain.entity.Caso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CasoRepository extends JpaRepository<Caso, Long> {

    List<Caso> findByHistoriaClinicaId(Long HCid);

}
