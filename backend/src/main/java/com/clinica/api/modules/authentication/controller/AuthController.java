package com.clinica.api.modules.authentication.controller;

import com.clinica.api.exception.ConflictException;
import com.clinica.api.modules.authentication.service.JwtService;
import com.clinica.api.modules.usuario.entity.Usuario;
import com.clinica.api.modules.usuario.repository.UsuarioRepository;
import com.clinica.api.web.dto.request.LoginCreateRequest;
import com.clinica.api.web.dto.request.UsuarioRegisterRequest;
import com.clinica.api.web.dto.response.AuthResponse;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginCreateRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        String token = jwtService.generateToken(request.getUsername());
        return new AuthResponse(token);
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody UsuarioRegisterRequest request) {
        if (usuarioRepository.existsByUsername(request.username())) {
            throw new ConflictException("El nombre de usuario ya está registrado");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setUsername(request.username());
        nuevoUsuario.setPassword(passwordEncoder.encode(request.password()));
        nuevoUsuario.setRol(request.rol() != null ? request.rol() : "USER");

        usuarioRepository.save(nuevoUsuario);

        // Opcional: Generar token inmediatamente tras el registro
        String token = jwtService.generateToken(nuevoUsuario.getUsername());
        return new AuthResponse(token);
    }
}