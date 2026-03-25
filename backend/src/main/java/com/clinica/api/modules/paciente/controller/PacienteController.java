package com.clinica.api.modules.paciente.controller;

import com.clinica.api.modules.paciente.service.PacienteService;
import com.clinica.api.web.dto.request.PacienteCreateRequest;
import com.clinica.api.web.dto.response.PageResponse;
import com.clinica.api.web.dto.update.PacienteUpdateRequest;
import com.clinica.api.web.dto.response.PacienteResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.net.URI;

@Tag(name = "Pacientes", description = "Operaciones relacionadas a pacientes")
@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @PostMapping
    public ResponseEntity<PacienteResponse> crear(@Valid @RequestBody PacienteCreateRequest request) {
        PacienteResponse created = pacienteService.crear(request);
        return ResponseEntity.created(URI.create("/api/pacientes/" + created.id())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponse> obtener(@PathVariable Long id) {
        PacienteResponse response = pacienteService.obtenerPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<PacienteResponse>> listar(Pageable pageable) {
        return ResponseEntity.ok(pacienteService.listar(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponse> actualizar(@PathVariable Long id, @RequestBody PacienteUpdateRequest request) {
        return ResponseEntity.ok(pacienteService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        pacienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<PacienteResponse> buscarPorDNI(@PathVariable String dni){
        return ResponseEntity.ok(pacienteService.buscarPorDNI(dni));
    }
}
