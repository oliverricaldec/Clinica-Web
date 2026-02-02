package com.clinica.api.modules.historiaClinica.repository;

import com.clinica.api.modules.historiaClinica.domain.entity.HistoriaClinica;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoriaClinicaRepository extends JpaRepository<HistoriaClinica, Long> {
}
