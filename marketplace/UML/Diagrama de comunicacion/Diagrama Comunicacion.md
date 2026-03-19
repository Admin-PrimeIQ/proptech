---
config:
  look: neo
  theme: redux-dark
---
classDiagram
direction LR

class Visitante {
  +consultarPropiedades()
  +verDetallePropiedad()
}

class UsuarioAutenticado {
  +administrarFavoritos()
  +enviarSolicitudContacto()
  +gestionarPropiedades()
}

class UsuarioEnterprise {
  +consultarMapaDinamico()
  +seleccionarZonaYSubzonas()
  +dibujarPoligono()
  +dibujarCirculo()
  +filtrarMarcadoresPorCategoria()
  +cambiarEstiloDeMapa()
  +crearProyectoLifestyle()
  +activarProyectoLifestyle()
  +seleccionarPuntosDeInteres()
  +asignarPrioridad()
  +reordenarPuntosDeInteres()
  +configurarParametrosIsochrone()
  +seleccionarUbicaciones()
  +cargarMapaLifestyleMatcher()
  +decidirRecalcularIsochrone()
  +filtrarProyectosPorTipo()
}

class Administrador {
  +gestionarContenidoHome()
  +gestionarConfiguracionSitio()
  +gestionarContenidoEnterprise()
  +gestionarServiciosEnterprise()
  +gestionarPlanesYBeneficios()
}

class SuperAdministrador {
  +gestionarUsuarios()
  +gestionarConfiguracionEnterprise()
}

class Propiedad {
  -int id
  -string idPublic
  -string nombrePropiedad
  -string referenciaCorta
  -string descripcionGeneral
  -string estadoPublicacion
  -int idCategoria
  -int idTipoOperacionInmobiliaria
  -int idZona
  -string direccionPublica
  -decimal latitud
  -decimal longitud
  -int habitaciones
  -int banos
  -int parqueos
  -int metrosConstruccion
  -int metrosTerreno
  -int anoConstruccion
  -int idVendedor
  -int creadoPor
  -DateTime fechaPublicacion
  -DateTime fechaCreacion
  -DateTime fechaActualizacion
  +obtenerPropiedades()
  +obtenerDetallePropiedad()
  +crearOEditarPropiedad()
}

class Favoritos {
  -int id
  -string idPublic
  -int idUsuario
  -int idPropiedad
  -DateTime fechaCreacion
  +registrarFavorito()
  +eliminarFavorito()
}

class SolicitudContacto {
  -int id
  -string idPublic
  -int idPropiedad
  -int idUsuario
  -string nombre
  -string correo
  -string telefono
  -string mensaje
  -bool contactado
  -string estado
  -DateTime fechaCreacion
  +registrarSolicitudContacto()
  +cambiarEstado()
}

class Contenido {
  +actualizarContenido()
  +actualizarConfiguracion()
}

class Usuarios {
  -int id
  -string idPublic
  -string correo
  -string nombreUsuario
  -string contrasenaHash
  -string nombreCompleto
  -string telefono
  -bool activo
  -DateTime fechaCreacion
  -DateTime fechaActualizacion
  +actualizarUsuarios()
  +asignarRol()
}

class Recurso {
  -int id
  -string idPublic
  -string tipoRecurso
  -string url
  -string textoAlternativo
  -json metadatos
  -int creadoPor
  -DateTime fechaCreacion
  +gestionarImagenes()
  +actualizarRecursos()
}

class Mapa {
  +cargarMapaDinamico()
  +generarGeoJSON()
  +cambiarEstiloDeMapa()
  +renderizarPuntosDeInteres()
  +renderizarIsochrone()
  +reRenderizarIsochrone()
  +actualizarMarcadoresVisibles()
}

class Subzona {
  -int id
  -string idPublic
  -string codigoSubzona
  -string nombre
  -string nombreDescriptivo
  -string zonaPrimaria
  -int origenFid
  -string origenLayer
  -string origenPath
  -string flagNombrePrevio
  -string codigoReevalGeom
  -json geom
  -DateTime createdAt
  -DateTime updatedAt
  +obtenerSubzonas()
}

class MarcadorHousingUniverse {
  -int id
  -string codProyecto
  -Date fechaRecoleccion
  -string proyecto
  -string fase
  -string torre
  -string periodo
  -string categoria
  -string pais
  -string departamento
  -string municipio
  -string zona
  -string subzona
  -string desarrollador
  -string estado
  -string uso
  -Date fechaInicio
  -Date fechaEntrega
  -int mesesDeComercializacion
  -float latitud
  -float longitud
  -float precioPromedio
  -int totalUnidades
  -int unidadesDisponibles
  -string mercado
  -string urlImagen
  -DateTime createdAt
  +obtenerMarcadoresAsociados()
  +filtrarProyectosPorAreaEspacial()
  +filtrarMarcadoresPorCategoria()
  +obtenerProyectosDentroDelIsochrone()
  +filtrarProyectosPorTipo()
  +obtenerProyectosActualizados()
}

class SolucionEmpresarial {
  -int id
  -string idPublic
  -int idRecursos
  -string tituloHero
  -string tituloSeccionInformacion
  -string contextoSeccionInformacion
  -DateTime fechaCreacion
  -DateTime fechaActualizacion
  +actualizarSolucionesEmpresariales()
  +actualizarConfiguracionEnterprise()
}

class ServicioEmpresarial {
  -int id
  -string idPublic
  -string tituloServicio
  -string descripcion
  -int idRecursos
  -int orden
  -bool activo
  -DateTime fechaCreacion
  -DateTime fechaActualizacion
  +actualizarServiciosEmpresariales()
}

class Plan {
  -int id
  -string idPublic
  -string titulo
  -decimal montoQuetzales
  -decimal montoDolares
  -int orden
  -bool activo
  -DateTime fechaCreacion
  -DateTime fechaActualizacion
  +actualizarPlanes()
}

class BeneficioPlan {
  -int id
  -string idPublic
  -int idPlan
  -string tituloVentaja
  -int orden
  -bool activo
  -DateTime fechaCreacion
  +actualizarBeneficiosDelPlan()
}

class ProyectoLifestyle {
  -int id
  -string idPublic
  -int idUsuario
  -string nombre
  -string descripcion
  -bool activo
  -DateTime fechaCreacion
  -DateTime fechaActualizacion
  +crearProyecto()
  +activarProyecto()
  +desactivarProyecto()
  +obtenerProyectoActivo()
}

class PuntoInteres {
  -int id
  -string idPublic
  -int idProyecto
  -string categoria
  -string nombre
  -int prioridad
  -decimal latitud
  -decimal longitud
  -DateTime fechaCreacion
  -DateTime fechaActualizacion
  +obtenerCategoriasDisponibles()
  +guardarPunto()
  +actualizarPrioridad()
  +guardarUbicacion()
  +obtenerPuntosOrdenadosPorPrioridad()
}

class Isochrone {
  -int id
  -string idPublic
  -string hashCombinacion
  -string tipoDesplazamiento
  -int tiempoMaximo
  -decimal distanciaMaxima
  -decimal velocidad
  -json areaCobertura
  -DateTime fechaCreacion
  +generarHash()
  +buscarPorHash()
  +crearIsochrone()
  +obtenerAreaCobertura()
}

class ProyectoIsochrone {
  -int id
  -int idProyecto
  -int idIsochrone
  -bool esVersionActual
  -DateTime fechaAsociacion
  +asociarIsochroneAProyecto()
  +marcarComoActual()
  +obtenerIsochroneActual()
  +obtenerHistorial()
}

class IsochronePuntoInteres {
  -int id
  -int idIsochrone
  -int idPuntoInteres
  -int prioridad
  -decimal peso
  -bool esPuntoPrincipal
  -DateTime fechaCreacion
  +asociarPuntoAIsochrone()
  +obtenerPuntosOrdenadosPorPrioridad()
  +obtenerPuntoPrincipal()
}

class Visitante:::role
class UsuarioAutenticado:::role
class UsuarioEnterprise:::role
class Administrador:::role
class SuperAdministrador:::role

Visitante "1" --> "0..*" Propiedad : consulta
Visitante "1" --> "0..1" Propiedad : visualiza detalle

UsuarioAutenticado "1" --> "0..*" Favoritos : administra
UsuarioAutenticado "1" --> "0..*" SolicitudContacto : registra
UsuarioAutenticado "1" --> "0..*" Propiedad : crea o edita
UsuarioAutenticado "1" --> "0..*" Recurso : gestiona imagenes

Administrador "1" --> "0..*" Contenido : actualiza
Administrador "1" --> "0..*" SolucionEmpresarial : gestiona
Administrador "1" --> "0..*" ServicioEmpresarial : gestiona
Administrador "1" --> "0..*" Plan : gestiona
Administrador "1" --> "0..*" BeneficioPlan : gestiona

SuperAdministrador "1" --> "0..*" Usuarios : administra
SuperAdministrador "1" --> "0..*" SolucionEmpresarial : configura

Usuarios "1" --> "0..*" Favoritos : registra
Usuarios "1" --> "0..*" SolicitudContacto : envia

Propiedad "1" --> "0..*" Recurso : usa
Propiedad "1" --> "0..*" SolicitudContacto : recibe

Contenido "1" --> "0..*" Recurso : consume
SolucionEmpresarial "1" --> "0..*" Recurso : usa
ServicioEmpresarial "1" --> "0..*" Recurso : usa

UsuarioEnterprise "1" --> "1" Mapa : consulta
UsuarioEnterprise "1" --> "0..*" Subzona : selecciona
UsuarioEnterprise "1" --> "0..*" ProyectoLifestyle : crea y gestiona
UsuarioEnterprise "1" --> "1" ProyectoLifestyle : tiene activo

Mapa "1" --> "0..*" Subzona : muestra
Mapa "1" --> "0..*" MarcadorHousingUniverse : visualiza
Mapa "1" --> "0..*" PuntoInteres : visualiza puntos del usuario
Subzona "1" --> "0..*" MarcadorHousingUniverse : agrupa

ProyectoLifestyle "1" --> "0..*" PuntoInteres : contiene exclusivamente
ProyectoLifestyle "1" --> "0..*" ProyectoIsochrone : historial de isochrones
ProyectoLifestyle "1" --> "1" ProyectoIsochrone : tiene version actual

ProyectoIsochrone "0..*" --> "1" Isochrone : referencia isochrone compartido
ProyectoIsochrone "1" --> "1" ProyectoLifestyle : pertenece a

Isochrone "1" --> "1..*" IsochronePuntoInteres : snapshot de puntos
Isochrone "1" --> "0..*" MarcadorHousingUniverse : delimita proyectos
IsochronePuntoInteres "1" --> "1" PuntoInteres : referencia punto

Isochrone "1" --> "1" Mapa : renderiza area de cobertura

Plan "1" --> "1..*" BeneficioPlan : contiene

Usuarios <|-- UsuarioAutenticado
Usuarios <|-- UsuarioEnterprise
UsuarioAutenticado <|-- Administrador
Administrador <|-- SuperAdministrador

classDef role fill:#F3E8FF,stroke:#A855F7,color:#222222,stroke-width:2px;