package com.clinica.api.mapper;

import com.clinica.api.modules.registros.domain.entity.Registro;
import com.clinica.api.web.dto.request.RegistroCreateRequest;
import com.clinica.api.web.dto.response.RegistroResponse;
import com.clinica.api.web.dto.update.RegistroUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class RegistroMapper {

    //Esto es cuando por ejemplo el usurio quiere registrar un REGISTRO, en el formulario manda los datos,
    // lo que recibe el backend es un archivo DTO que luego lo convertira en un objeto con esta funcion
    public Registro toEntity(RegistroCreateRequest request){
        return Registro.builder()
                .evolucion(request.evolucion())
                .proceRealizado(request.procedimientoRealizado())
                .doctor(request.doctorResponsable())
                .abono(request.montoAbonado())
                .observaciones(request.observaciones())
                .build();
    }

    public RegistroResponse toResponse(Registro registro){
        return RegistroResponse.builder()
                .id(registro.getId())
                .evolucion(registro.getEvolucion())
                .procedimientoRealizado(registro.getProceRealizado())
                .doctorResponsable(registro.getDoctor())
                .montoAbonado(registro.getAbono())
                .observaciones(registro.getObservaciones())
                .fechaAtencion(registro.getFechaAtencion())
                .idCaso(registro.getCaso().getId())
                .build();
    }

    public void updateEntity(Registro registro, RegistroUpdateRequest request){
        registro.setEvolucion(request.evolucion());
        registro.setProceRealizado(request.procedimientoRealizado());
        registro.setDoctor(request.doctorResponsable());
        registro.setAbono(request.montoAbonado());
        registro.setObservaciones(request.observaciones());
    }

}
