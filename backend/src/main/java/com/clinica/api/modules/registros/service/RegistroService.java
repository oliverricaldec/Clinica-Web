package com.clinica.api.modules.registros.service;

import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.modules.casos.domain.entity.Caso;
import com.clinica.api.modules.registros.domain.entity.Registro;
import com.clinica.api.modules.casos.repository.CasoRepository;
import com.clinica.api.modules.registros.repository.RegistroRepository;
import com.clinica.api.mapper.RegistroMapper;
import com.clinica.api.web.dto.request.RegistroCreateRequest;
import com.clinica.api.web.dto.response.PageResponse;
import com.clinica.api.web.dto.update.RegistroUpdateRequest;
import com.clinica.api.web.dto.response.RegistroResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistroService {

    private final RegistroRepository registroRepository;
    private final CasoRepository casoRepository;
    private final RegistroMapper registroMapper;

    public RegistroResponse crear(Long casoId, RegistroCreateRequest request) {

        Caso caso = casoRepository.findById(casoId)
                .orElseThrow(() -> new ResourceNotFoundException("Caso no encontrado"+casoId));

        Registro registro = registroMapper.toEntity(request);
        registro.setCaso(caso);

        Registro guardado = registroRepository.save(registro);

        return registroMapper.toResponse(guardado);
    }

    public RegistroResponse actualizar(Long id, RegistroUpdateRequest request) {



        Registro registro = registroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado"+id));

        registroMapper.updateEntity(registro, request);

        Registro actualizado = registroRepository.save(registro);

        return registroMapper.toResponse(actualizado);
    }

    public void eliminar(Long id) {

        Registro registro = registroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado"+id));

        registroRepository.delete(registro);
    }

    public RegistroResponse obtenerPorId(Long id) {

        Registro registro = registroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado"+id));

        return registroMapper.toResponse(registro);
    }

    public PageResponse<RegistroResponse> listarPorCaso(Long casoId, Pageable pageable){

        Page<RegistroResponse> page = registroRepository
                .findByCasoId(casoId, pageable) // ✅ BIEN
                .map(registroMapper::toResponse);

        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

}
