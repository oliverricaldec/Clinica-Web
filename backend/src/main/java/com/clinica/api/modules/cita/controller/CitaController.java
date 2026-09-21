package com.clinica.api.modules.cita.controller;

import com.clinica.api.web.dto.request.CitaRequest;
import com.clinica.api.web.dto.response.CitaResponse;
import com.clinica.api.modules.cita.service.CitaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @GetMapping
    public ResponseEntity<List<CitaResponse>> obtenerTodas() {
        return ResponseEntity.ok(citaService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CitaResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(citaService.obtenerPorId(id));
    }

    @GetMapping("/rango")
    public ResponseEntity<List<CitaResponse>> obtenerPorRangoFechas(
            @RequestParam String inicio,
            @RequestParam String fin) {

        // Si la cadena contiene la 'Z' o el signo '+', usa OffsetDateTime; si no, usa LocalDateTime directo
        LocalDateTime fechaInicio = (inicio.contains("Z") || inicio.contains("+"))
                ? OffsetDateTime.parse(inicio).toLocalDateTime()
                : LocalDateTime.parse(inicio);

        LocalDateTime fechaFin = (fin.contains("Z") || fin.contains("+"))
                ? OffsetDateTime.parse(fin).toLocalDateTime()
                : LocalDateTime.parse(fin);

        return ResponseEntity.ok(citaService.obtenerPorRangoFechas(fechaInicio, fechaFin));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<CitaResponse>> obtenerPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(citaService.obtenerPorPaciente(pacienteId));
    }

    @PostMapping
    public ResponseEntity<CitaResponse> crearCita(@Valid @RequestBody CitaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(citaService.crearCita(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CitaResponse> actualizarCita(
            @PathVariable Long id,
            @Valid @RequestBody CitaRequest request) {
        return ResponseEntity.ok(citaService.actualizarCita(id, request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<CitaResponse> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String estado) {
        return ResponseEntity.ok(citaService.cambiarEstado(id, estado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCita(@PathVariable Long id) {
        citaService.eliminarCita(id);
        return ResponseEntity.noContent().build();
    }
}