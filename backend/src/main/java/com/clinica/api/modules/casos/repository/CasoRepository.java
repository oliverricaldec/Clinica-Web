package com.clinica.api.modules.casos.repository;

import com.clinica.api.modules.casos.domain.entity.Caso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CasoRepository extends JpaRepository<Caso, Long> {

    Page<Caso> findByHistoriaClinicaId(Long HCid, Pageable pageable);

}
