package com.clinica.api.web.dto.update;

import com.clinica.api.modules.casoImagen.domain.enums.TipoImagen;

public record CasoImagenUpdateRequest(String url, TipoImagen tipo) {
}
