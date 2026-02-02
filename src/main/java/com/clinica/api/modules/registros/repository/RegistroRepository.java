package com.clinica.api.modules.registros.repository;

import com.clinica.api.modules.registros.domain.entity.Registro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistroRepository extends JpaRepository<Registro, Long> {

}
