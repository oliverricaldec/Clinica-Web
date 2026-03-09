package com.clinica.api.modules.registros.controller;

import com.clinica.api.modules.registros.service.RegistroService;
import com.clinica.api.web.dto.request.RegistroCreateRequest;
import com.clinica.api.web.dto.response.RegistroResponse;
import com.clinica.api.web.dto.update.RegistroUpdateRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Registros", description = "Operaciones relacionadas a los registros de cada CASO")
@RestController
@RequestMapping("/api/registros")
public class RegistroController {

    private final RegistroService registroService;

    public RegistroController(RegistroService registroService) {this.registroService = registroService;}

    @PostMapping("/casos/{casoId}")
    public ResponseEntity<RegistroResponse> crear( @PathVariable Long casoId, @Valid @RequestBody RegistroCreateRequest request){
        RegistroResponse created = registroService.crear(casoId,request);
        return ResponseEntity.created(URI.create("/api/registros/" + created.id())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroResponse> obtener(@PathVariable Long id){
        RegistroResponse response = registroService.obtenerPorId(id);
        return ResponseEntity.ok(response);
    }

    //averiguar porque aqui defrente va al return y en otro crea un objeto y luego lo mete a "ok"
    @GetMapping
    public ResponseEntity<List<RegistroResponse>> listarPorCaso(Long casoId){
        return ResponseEntity.ok(registroService.listarPorCaso(casoId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistroResponse> actualizar(@PathVariable Long id,@Valid @RequestBody RegistroUpdateRequest request){
        return ResponseEntity.ok(registroService.actualizar(id,request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        registroService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
