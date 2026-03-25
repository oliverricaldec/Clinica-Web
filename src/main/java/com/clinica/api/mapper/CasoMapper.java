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
                .fechaInicio(request.fechaInicio())
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

        if (request.nombreCaso() != null)
            caso.setNombreCaso(request.nombreCaso());

        if (request.diagnostico() != null)
            caso.setDiagnostico(request.diagnostico());

        if (request.planTratamiento() != null)
            caso.setPlanTratamiento(request.planTratamiento());

        if (request.examenAuxiliar() != null)
            caso.setExamenAuxiliar(request.examenAuxiliar());

        if (request.proformaUrl() != null)
            caso.setProforma(request.proformaUrl());

        if (request.odontogramaUrl() != null)
            caso.setOdontograma(request.odontogramaUrl());

        if (request.costoTotal() != null)
            caso.setCostoTotal(request.costoTotal());

        if (request.fechaInicio() != null)
            caso.setFechaInicio(request.fechaInicio());

        if (request.fechaFin() != null)
            caso.setFechaFin(request.fechaFin());

        if (request.estado() != null)
            caso.setEstado(request.estado());
    }
}
