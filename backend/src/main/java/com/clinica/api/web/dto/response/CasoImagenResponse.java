package com.clinica.api.web.dto.response;

import com.clinica.api.modules.casoImagen.domain.enums.TipoImagen;

public record CasoImagenResponse (
        String url,
        TipoImagen tipo
){
}
