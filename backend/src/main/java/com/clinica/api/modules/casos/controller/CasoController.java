package com.clinica.api.modules.casos.controller;

import com.clinica.api.modules.casos.service.CasoService;
import com.clinica.api.web.dto.request.CasoCreateRequest;
import com.clinica.api.web.dto.response.CasoResponse;
import com.clinica.api.web.dto.response.PageResponse;
import com.clinica.api.web.dto.update.CasoUpdateRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Casos", description = "Operaciones relacionadas a los casos de cada Historia Clincia")
@RestController
@RequestMapping("/api/casos")
public class CasoController {

    private final CasoService casoService;

    public CasoController(CasoService casoService) {this.casoService = casoService;}

    //preguntar por que se usa respondeEntity en todos los metodos HTTP y porque tmb se crea un objeto de casoResponse
    @PostMapping("/historiasClinicas/{HCid}/casos")
    public ResponseEntity<CasoResponse> crear(@PathVariable Long HCid, @Valid @RequestBody CasoCreateRequest request){
        CasoResponse created = casoService.crear(HCid,request);
        return ResponseEntity.created(URI.create("/api/casos/" + created.id())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CasoResponse> obtener(@PathVariable Long id){
        CasoResponse response = casoService.obtenerPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/historiasClinicas/{HCid}")
    public ResponseEntity<PageResponse<CasoResponse>> listarPorHistoriaClinica(@PathVariable Long HCid, Pageable pageable){
        return ResponseEntity.ok(casoService.listarPorHistoriaClinica(HCid, pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CasoResponse> actualizar(@PathVariable Long id, @Valid @RequestBody CasoUpdateRequest request){
        return ResponseEntity.ok(casoService.actualizar(id,request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        casoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
