package com.clinica.api.modules.registros.repository;

import com.clinica.api.modules.registros.domain.entity.Registro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistroRepository extends JpaRepository<Registro, Long> {

    List<Registro> findByCasoId(Long casoId);
}
