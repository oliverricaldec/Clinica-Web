package com.clinica.api.mapper;

import com.clinica.api.modules.casoImagen.domain.entity.CasoImagen;
import com.clinica.api.modules.casos.domain.entity.Caso;
import com.clinica.api.web.dto.request.CasoCreateRequest;
import com.clinica.api.web.dto.request.CasoImagenRequest;
import com.clinica.api.web.dto.response.CasoImagenResponse;
import com.clinica.api.web.dto.response.CasoResponse;
import com.clinica.api.web.dto.update.CasoUpdateRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CasoMapper {

    public Caso toEntity(CasoCreateRequest request) {
        Caso caso = Caso.builder()
                .nombreCaso(request.nombreCaso())
                .diagnostico(request.diagnostico())
                .planTratamiento(request.planTratamiento())
                .examenAuxiliar(request.examenAuxiliar())
                .proforma(request.proformaUrl())
                .costoTotal(request.costoTotal())
                .fechaInicio(request.fechaInicio())
                .build();

        if (request.imagenes() != null) {
            List<CasoImagen> imgs = request.imagenes().stream().map(img -> {
                CasoImagen ci = new CasoImagen();
                ci.setUrl(img.url());
                ci.setTipo(img.tipo());
                ci.setCaso(caso); // 🔥 CLAVE
                return ci;
            }).toList();

            caso.setImagenes(imgs);
        }

        return caso;
    }

    public CasoResponse toResponse(Caso caso){
        return CasoResponse.builder()
                .id(caso.getId())
                .nombreCaso(caso.getNombreCaso())
                .diagnostico(caso.getDiagnostico())
                .planTratamiento(caso.getPlanTratamiento())
                .examenAuxiliar(caso.getExamenAuxiliar())
                .proformaUrl(caso.getProforma())
                .costoTotal(caso.getCostoTotal())
                .fechaInicio(caso.getFechaInicio())
                .fechaFin(caso.getFechaFin())
                .estado(caso.getEstado())
                .idHistoriaClinica(caso.getHistoriaClinica().getId())

                // ESTO ES LO QUE TE FALTA
                .imagenes(
                        caso.getImagenes() == null ? List.of() :
                                caso.getImagenes().stream()
                                        .map(img -> new CasoImagenResponse(
                                                img.getUrl(),
                                                img.getTipo()
                                        ))
                                        .toList()
                )

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
