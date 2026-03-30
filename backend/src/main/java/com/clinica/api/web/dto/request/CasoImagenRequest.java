package com.clinica.api.web.dto.request;

import com.clinica.api.modules.casoImagen.domain.enums.TipoImagen;

public record CasoImagenRequest (
        String url,
        TipoImagen tipo
){
}
