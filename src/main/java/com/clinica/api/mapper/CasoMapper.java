package com.clinica.api.mapper;

import com.clinica.api.modules.casos.domain.entity.Caso;
import com.clinica.api.web.dto.request.CasoCreateRequest;
import com.clinica.api.web.dto.response.CasoResponse;
import com.clinica.api.web.dto.update.CasoUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class CasoMapper {

    public Caso toEntity(CasoCreateRequest request){
        return Caso.builder()
                .nombreCaso(request.nombreCaso())
                .diagnostico(request.diagnostico())
                .planTratamiento(request.planTratamiento())
                .examenAuxiliar(request.examenAuxiliar())
                .proforma(request.proformaUrl())
                .odontograma(request.odontogramaUrl())
                .costoTotal(request.costoTotal())
                .build();
    }

    public CasoResponse toResponse(Caso caso){
        return CasoResponse.builder()
                .id(caso.getId())
                .nombreCaso(caso.getNombreCaso())
                .diagnostico(caso.getDiagnostico())
                .planTratamiento(caso.getPlanTratamiento())
                .examenAuxiliar(caso.getExamenAuxiliar())
                .proformaUrl(caso.getProforma())
                .odontogramaUrl(caso.getOdontograma())
                .costoTotal(caso.getCostoTotal())
                .fechaInicio(caso.getFechaInicio())
                .fechaFin(caso.getFechaFin())
                .estado(caso.getEstado())
                .idHistoriaClinica(caso.getHistoriaClinica().getId())
                .build();
    }

    public void updateEntity(Caso caso, CasoUpdateRequest request){
        caso.setNombreCaso(request.nombreCaso());
        caso.setDiagnostico(request.diagnostico());
        caso.setPlanTratamiento(request.planTratamiento());
        caso.setExamenAuxiliar(request.examenAuxiliar());
        caso.setProforma(request.proformaUrl());
        caso.setOdontograma(request.odontogramaUrl());
        caso.setCostoTotal(request.costoTotal());
        caso.setEstado(request.estado());

    }
}
