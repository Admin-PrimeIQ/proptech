# Contexto UML - Marketplace

Este documento concentra el contexto del subdominio `Marketplace`, es decir, toda la gestion inmobiliaria principal del sistema: propiedades, compra, venta, panel administrativo, configuracion de contenido y presentacion publica.

## 1. Alcance del subdominio

El subdominio `Marketplace` cubre:

- Sitio publico de propiedades
- Listado y detalle de propiedades
- Favoritos
- Formularios y solicitudes de contacto
- Panel administrativo
- CRUD de propiedades
- CRUD de vendedores
- Configuracion de home
- Configuracion de pagina principal
- Gestion de contenido visual y diseno de pagina

No incluye:

- Modulo GIS de mapas interactivos
- Clasificacion espacial avanzada
- Flujos propios de `Enterprise`

## 2. Objetivo funcional

Permitir la publicacion, consulta y administracion de propiedades inmobiliarias, junto con la configuracion operativa y visual de las secciones publicas del sitio.

## 3. Actores principales

- Visitante
- Usuario autenticado
- Administrador
- Super Administrador

## 4. Modulos funcionales incluidos

### 4.1 Sitio publico

- Home principal
- Listado de propiedades
- Detalle de propiedad
- Favoritos
- Paginas auxiliares del sitio

### 4.2 Administracion inmobiliaria

- Alta, edicion y eliminacion de propiedades
- Gestion de precios
- Gestion de imagenes
- Asociacion de propiedades con vendedores

### 4.3 Administracion de catalogos

- Categorias de propiedad
- Departamentos
- Tipos de operacion
- Catalogos relacionados de ubicacion

### 4.4 Administracion de contenido del sitio

- Hero principal
- Pagina principal
- Informacion de pagina
- Comentarios
- Logos asociados
- Administradores publicos
- Palabras clave
- Departamentos destacados

### 4.5 Solicitudes y conversion

- Envio de solicitudes de contacto
- Revision desde dashboard
- Cambio de estado operativo

## 5. Arquitectura del subdominio

### 5.1 Capas

- Presentacion: paginas de `src/app`, componentes y SCSS
- Aplicacion: hooks, transformaciones, formularios, validaciones
- API: endpoints REST en `src/app/api`
- Persistencia: Prisma + PostgreSQL
- Integracion: S3 y SMTP

### 5.2 Rutas principales

- `/`
- `/propiedades`
- `/property-details-2/[id]`
- `/favoritos`
- `/sign-in`
- `/sign-up`
- `/administrador`
- `/dashboard/review`

## 6. Entidades principales

### 6.1 Seguridad

- `usuarios`
- `roles`
- `usuario_roles`
- `permisos_especificos_usuario`

### 6.2 Dominio inmobiliario

- `propiedades`
- `precios_propiedad`
- `imagenes_propiedad`
- `vendedores`
- `categorias_propiedad`
- `tipo_operacion_inmobiliaria`
- `favoritos`
- `solicitudes_contacto`

### 6.3 Ubicacion

- `paises`
- `departamentos`
- `ciudades`
- `zonas`

### 6.4 Contenido y CMS

- `home_configuracion`
- `configuracion_sitio`
- `departamentos_destacados`
- `comentarios_personas`
- `palabras_clave`
- `administradores_publicos`
- `logos_asociados`
- `caracteristicas_pagina_principal`
- `informacion_pagina_items`
- `recursos`

## 7. Relaciones conceptuales clave

- Un vendedor tiene muchas propiedades
- Una propiedad tiene muchas imagenes
- Una propiedad puede tener varios registros de precio
- Una propiedad pertenece a una categoria
- Una propiedad pertenece a un tipo de operacion
- Un usuario puede tener muchos favoritos
- Una solicitud de contacto puede apuntar a una propiedad
- Varias secciones de contenido pueden consumir un `recurso`

## 8. Reglas de modelado importantes

- En base de datos se usa `id` interno
- En API y URL se expone `idPublic`
- Las foreign keys siempre usan `id`
- No se deben duplicar componentes ya existentes
- Los cambios visuales del sitio deben respetar la arquitectura de componentes y estilos actual

## 9. APIs principales del subdominio

- `/api/propiedades`
- `/api/vendedores`
- `/api/categorias-propiedad`
- `/api/departamentos`
- `/api/solicitudes-contacto`
- `/api/upload`
- `/api/recursos`

APIs de contenido:

- `/api/departamentos-destacados`
- `/api/comentarios-personas`
- `/api/palabras-clave`
- `/api/administradores-publicos`
- `/api/logos-asociados`
- `/api/informacion-pagina-items`
- `/api/usuarios/count`

## 10. Componentes tecnicos relevantes

- `CommonHeader`
- `DashboardLayout`
- `HeroBannerOne`
- `ImageUploader`
- formularios de auth
- componentes de propiedades
- componentes del panel admin

## 11. Flujos principales

### 11.1 Consulta de propiedades

1. El visitante entra al home o al listado
2. La UI consulta propiedades y catalogos
3. El usuario aplica filtros
4. El sistema renderiza resultados y acceso al detalle

### 11.2 Detalle de propiedad

1. El usuario entra al detalle usando `idPublic`
2. El sistema consulta datos de la propiedad
3. Se muestran imagenes, informacion y formularios de contacto

### 11.3 Favoritos

1. El usuario autenticado marca una propiedad
2. La API valida sesion
3. Se registra o elimina el favorito

### 11.4 Solicitud de contacto

1. El visitante o usuario envia formulario
2. La API registra la solicitud
3. El admin revisa la solicitud
4. El estado cambia a `PENDIENTE`, `CONTACTADO` o `NO_CONTACTAR`

### 11.5 Administracion de propiedades

1. El admin accede al panel
2. Lista propiedades con filtros y paginacion
3. Crea o edita una propiedad
4. Asocia vendedor, imagenes y datos de negocio
5. Guarda cambios en DB y recursos en S3

### 11.6 Gestion de home y diseno de pagina

1. El admin edita hero y secciones dinamicas
2. La informacion queda persistida en tablas de configuracion
3. El frontend publico consume esa configuracion
4. El home se renderiza con contenido administrable

## 12. Casos de uso sugeridos para UML

- Consultar propiedades
- Ver detalle de propiedad
- Administrar favoritos
- Iniciar sesion
- Registrarse
- Enviar solicitud de contacto
- Gestionar propiedades
- Gestionar vendedores
- Gestionar contenido del home
- Gestionar configuracion del sitio

## 13. Clases candidatas para UML

- Usuario
- Rol
- Permiso
- Propiedad
- Vendedor
- ImagenPropiedad
- PrecioPropiedad
- CategoriaPropiedad
- TipoOperacionInmobiliaria
- Favorito
- SolicitudContacto
- HomeConfiguracion
- Recurso
- InformacionPaginaItem

## 14. Diagramas recomendados

1. Diagrama de casos de uso del Marketplace
2. Diagrama de clases del dominio inmobiliario
3. Diagrama de clases del CMS/home
4. Diagrama de componentes del panel admin y frontend publico
5. Diagrama de secuencia para alta de propiedad
6. Diagrama de secuencia para solicitud de contacto
