package com.clinica.api.modules.paciente.controller;

import com.clinica.api.modules.paciente.service.PacienteService;
import com.clinica.api.web.dto.request.PacienteCreateRequest;
import com.clinica.api.web.dto.request.PacienteUpdateRequest;
import com.clinica.api.web.dto.response.PacienteResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

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
    public ResponseEntity<List<PacienteResponse>> listar() {
        return ResponseEntity.ok(pacienteService.listar());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponse> actualizar(@PathVariable Long id, @RequestBody PacienteUpdateRequest request) {
        return ResponseEntity.ok(pacienteService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PacienteResponse> eliminar(@PathVariable Long id){
        pacienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
