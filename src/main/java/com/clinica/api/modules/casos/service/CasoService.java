package com.clinica.api.modules.casos.service;

import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.mapper.CasoMapper;
import com.clinica.api.modules.casos.domain.entity.Caso;
import com.clinica.api.modules.casos.domain.enums.EstadoCaso;
import com.clinica.api.modules.casos.repository.CasoRepository;
import com.clinica.api.modules.historiaClinica.domain.entity.HistoriaClinica;
import com.clinica.api.modules.historiaClinica.repository.HistoriaClinicaRepository;
import com.clinica.api.web.dto.request.CasoCreateRequest;
import com.clinica.api.web.dto.response.CasoResponse;
import com.clinica.api.web.dto.response.PageResponse;
import com.clinica.api.web.dto.update.CasoUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CasoService {

    private final CasoRepository casoRepository;
    private final HistoriaClinicaRepository historiaClinicaRepository;
    private final CasoMapper casoMapper;

    public CasoResponse crear(Long HCid, CasoCreateRequest request){

        HistoriaClinica historiaClinica = historiaClinicaRepository.findById(HCid)
                .orElseThrow(()-> new ResourceNotFoundException("Historia clinica no encontrada"+HCid));

        Caso caso = casoMapper.toEntity(request);
        caso.setHistoriaClinica(historiaClinica);
        caso.setEstado(EstadoCaso.ACTIVO);

        Caso guardado = casoRepository.save(caso);

        return casoMapper.toResponse(guardado);
    }

    public CasoResponse actualizar(Long id, CasoUpdateRequest request){

        Caso caso = casoRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Caso no encontrado"+id));

        casoMapper.updateEntity(caso, request);
        Caso actualizado = casoRepository.save(caso);
        return casoMapper.toResponse(actualizado);
    }

    public void eliminar(Long id){
        Caso caso = casoRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Caso no encontrado"+id));

        casoRepository.delete(caso);
    }

    public CasoResponse obtenerPorId(Long id){
        Caso caso = casoRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Caso no encontrado"+id));

        return casoMapper.toResponse(caso);
    }

    public PageResponse<CasoResponse> listarPorHistoriaClinica(Long HCid, Pageable pageable){

        Page<CasoResponse> page = casoRepository
                .findAll(pageable)
                .map(casoMapper::toResponse);

        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}
