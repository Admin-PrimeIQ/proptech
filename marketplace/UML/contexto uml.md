# Contexto UML - Marketplace

Este documento consolida el contexto funcional y tecnico del proyecto para servir como base de modelado UML. El objetivo es describir el sistema, sus modulos, actores, entidades principales, relaciones y flujos de negocio antes de construir diagramas de casos de uso, clases, componentes, secuencia o despliegue.

## 1. Identificacion del proyecto

- Nombre del proyecto: Marketplace inmobiliario
- Tipo de sistema: plataforma web con sitio publico, panel administrativo, APIs internas y modulo GIS/Enterprise
- Dominio principal: comercializacion y administracion de propiedades inmobiliarias
- Proposito: publicar propiedades, administrar catalogos y contenido dinamico, gestionar solicitudes de contacto y operar modulos empresariales con mapas interactivos

## 2. Objetivo del sistema

El sistema permite:

- Mostrar propiedades al publico general
- Gestionar propiedades, vendedores, configuraciones y contenido desde un panel administrativo
- Recibir y administrar solicitudes de contacto
- Operar un modulo Enterprise con capacidades GIS, filtros espaciales y visualizacion de marcadores
- Administrar recursos multimedia asociados a propiedades, banners, logos y contenido dinamico

## 3. Alcance funcional

### 3.1 Frontend publico

- Home principal
- Listado de propiedades
- Detalle de propiedad
- Favoritos
- Autenticacion de usuarios
- Navegacion principal y footer
- Secciones dinamicas administrables desde backend

### 3.2 Panel administrativo

- CRUD de propiedades
- CRUD de vendedores
- Configuracion de home
- Configuracion de pagina principal
- Gestion de solicitudes de contacto
- Modulo admin Enterprise

### 3.3 Modulo Enterprise

- Dashboard enterprise
- Mapa dinamico
- Mapa de absorcion
- Visualizacion de subzonas
- Filtros por zona y subzona
- Dibujo de poligonos y circulos
- Consulta espacial de marcadores

## 4. Arquitectura general

La arquitectura sigue un enfoque modular dentro de `Next.js` con `App Router`, separando frontend, backend y componentes reutilizables.

### 4.1 Estilo arquitectonico

- Arquitectura web full-stack con `Next.js`
- App Router para paginas y rutas
- APIs REST internas en `src/app/api`
- Componentes reutilizables para UI y modulos complejos
- Persistencia con `PostgreSQL + Prisma`
- Integracion de almacenamiento externo con `AWS S3`

### 4.2 Capas principales

- Capa de presentacion: paginas, layouts, componentes visuales y estilos SCSS
- Capa de aplicacion: hooks, logica de UI, helpers, orquestacion de modulos
- Capa de servicios/API: endpoints REST, validaciones, transformacion de datos
- Capa de persistencia: Prisma ORM y PostgreSQL
- Capa de integracion externa: S3, SMTP y librerias GIS

## 5. Stack tecnologico

| Capa | Tecnologia |
|------|------------|
| Framework | Next.js 16 |
| UI | React 19 |
| Routing | App Router |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Estilos | SCSS + Bootstrap 5 |
| Estado | Redux + hooks locales |
| Validacion | React Hook Form + Yup/Zod |
| Storage | AWS S3 |
| Mapas | Leaflet + plugins |
| Testing | Vitest |

## 6. Estructura general del repositorio

```text
src/
├── app/
│   ├── (homes)/
│   ├── (dashboard)/
│   ├── (propiedades)/
│   ├── enterprise/
│   └── api/
├── components/
├── hooks/
├── layouts/
├── lib/
└── types/

prisma/
public/
scripts/
tests/
documentation/
```

## 7. Modulos principales del sistema

### 7.1 Modulo publico de propiedades

Responsabilidades:

- Mostrar propiedades disponibles
- Filtrar por criterios de negocio
- Mostrar detalle por `idPublic`
- Permitir favoritos segun sesion

Rutas relevantes:

- `/`
- `/propiedades`
- `/property-details-2/[id]`
- `/favoritos`

### 7.2 Modulo administrativo

Responsabilidades:

- Gestion de catalogo inmobiliario
- Gestion de home y contenido visual
- Gestion de vendedores y recursos asociados
- Gestion de solicitudes de contacto

Ruta base:

- `/administrador`

### 7.3 Modulo de solicitudes

Responsabilidades:

- Registrar solicitudes desde frontend
- Revisar solicitudes desde dashboard
- Actualizar estado operativo

Ruta relevante:

- `/dashboard/review`

### 7.4 Modulo Enterprise

Responsabilidades:

- Gestionar contenido enterprise
- Exponer modulo GIS
- Mostrar mapas, subzonas y marcadores
- Permitir filtros espaciales por figuras y zonas

Rutas activas:

- `/enterprise/dashboard`
- `/enterprise/mapa-dinamico`
- `/enterprise/mapa-absorcion`

### 7.5 Modulo GIS / mapa dinamico

Responsabilidades:

- Mostrar mapa reusable con Leaflet
- Dibujar poligonos y circulos
- Consultar GeoJSON de subzonas
- Consultar marcadores por area dibujada o por seleccion de zona
- Mostrar sidebar con cards reales de proyectos
- Cambiar estilos de mapa y mini mapas

## 8. Actores del sistema

### 8.1 Visitante

- Navega el sitio publico
- Consulta propiedades
- Visualiza detalle de propiedad
- Puede iniciar sesion o registrarse

### 8.2 Usuario autenticado

- Usa favoritos
- Accede a opciones de cuenta
- Puede acceder a menu Enterprise si corresponde

### 8.3 Administrador

- Administra propiedades y contenido
- Gestiona solicitudes
- Accede al panel administrativo

### 8.4 Super Administrador

- Tiene acceso ampliado sobre modulos administrativos
- Puede ver accesos especiales del panel

### 8.5 Sistema externo de almacenamiento

- AWS S3 para archivos e imagenes

### 8.6 Sistema de correo

- SMTP para notificaciones o comunicaciones del sistema

## 9. Convenciones y reglas arquitectonicas

- `id` es el identificador interno en base de datos y relaciones
- `idPublic` es el identificador expuesto en APIs y rutas
- Las foreign keys usan siempre `id` interno
- Los recursos publicos deben exponerse por `idPublic`
- Se deben reutilizar componentes existentes antes de crear nuevos
- No se debe romper el componente reusable `LeafletMap`
- No se deben hardcodear credenciales fuera de `.env`

## 10. Estructura de backend y APIs

El backend esta implementado como endpoints REST dentro de `src/app/api`.

### 10.1 APIs principales del dominio inmobiliario

- `/api/propiedades`
- `/api/vendedores`
- `/api/categorias-propiedad`
- `/api/departamentos`
- `/api/solicitudes-contacto`
- `/api/upload`
- `/api/recursos`

### 10.2 APIs del home dinamico

- `/api/departamentos-destacados`
- `/api/comentarios-personas`
- `/api/palabras-clave`
- `/api/administradores-publicos`
- `/api/logos-asociados`
- `/api/informacion-pagina-items`
- `/api/usuarios/count`

### 10.3 APIs del modulo Enterprise

- `/api/soluciones-empresariales`
- `/api/servicios-empresariales`
- `/api/planes`
- `/api/beneficios-plan`

### 10.4 APIs GIS / mapa

- `/api/subzonas`
- `/api/subzonas/geojson`
- `/api/search/subzonas`
- `/api/housing-universe/geojson`
- `/api/housing-universe/categories`

## 11. Modelo de datos de alto nivel

### 11.1 Entidades de seguridad y usuarios

- `usuarios`
- `roles`
- `usuario_roles`
- `permisos_especificos_usuario`

### 11.2 Entidades del dominio inmobiliario

- `propiedades`
- `precios_propiedad`
- `imagenes_propiedad`
- `vendedores`
- `categorias_propiedad`
- `tipo_operacion_inmobiliaria`
- `favoritos`
- `solicitudes_contacto`

### 11.3 Entidades geograficas

- `paises`
- `departamentos`
- `ciudades`
- `zonas`
- `geo_subzonas.subzona`

### 11.4 Entidades de contenido y home

- `home_configuracion`
- `configuracion_sitio`
- `departamentos_destacados`
- `comentarios_personas`
- `palabras_clave`
- `administradores_publicos`
- `logos_asociados`
- `caracteristicas_pagina_principal`
- `informacion_pagina_items`

### 11.5 Entidades de recursos

- `recursos`

### 11.6 Entidades enterprise

- `soluciones_empresariales`
- `planes`
- `beneficios_plan`
- `servicios_empresariales`
- `planes_servicios`

## 12. Relaciones conceptuales clave

### 12.1 Relaciones del dominio inmobiliario

- Un vendedor puede tener muchas propiedades
- Una propiedad puede tener muchas imagenes
- Una propiedad puede tener uno o varios registros de precio
- Una propiedad pertenece a una categoria
- Una propiedad pertenece a un tipo de operacion
- Un usuario puede tener muchos favoritos
- Una solicitud de contacto puede estar vinculada a una propiedad

### 12.2 Relaciones de seguridad

- Un usuario puede tener uno o varios roles
- Un usuario puede tener permisos especificos adicionales

### 12.3 Relaciones de contenido

- El home consume multiples secciones dinamicas
- Muchas secciones pueden depender de recursos multimedia

### 12.4 Relaciones enterprise

- Una solucion empresarial puede usar recursos
- Un servicio empresarial puede usar recursos
- Un plan puede tener muchos beneficios
- Un plan puede relacionarse con muchos servicios mediante `planes_servicios`

### 12.5 Relaciones GIS

- Una zona contiene varias subzonas
- Una subzona puede participar en consultas espaciales
- Un marcador de `housing_universe` puede filtrarse por zona, subzona o figura geometrica

## 13. Componentes tecnicos relevantes

### 13.1 Componentes UI/core

- `CommonHeader`
- `DashboardLayout`
- `ImageUploader`
- `HeroBannerOne`

### 13.2 Componentes del mapa

- `LeafletMap`
- `leafletMapSetup.ts`
- `leafletDrawing.ts`
- `leafletGeoJson.ts`
- `leafletMap.types.ts`
- `MapaDinamicoBody`
- `SubzonaAutocomplete`
- `SubzonaChecklist`

### 13.3 Helpers y librerias

- `prisma`
- helpers de respuesta API
- helpers de lectura para home dinamico

## 14. Flujos de negocio principales

### 14.1 Consulta de propiedades

1. El visitante entra al home o listado
2. La UI consulta APIs de propiedades y catalogos
3. El usuario filtra resultados
4. La UI muestra listado y acceso al detalle

### 14.2 Solicitud de contacto

1. El usuario envia una solicitud desde frontend
2. La API registra la solicitud
3. El admin revisa la solicitud en dashboard
4. El admin actualiza el estado a `PENDIENTE`, `CONTACTADO` o `NO_CONTACTAR`

### 14.3 Administracion de propiedades

1. El admin entra al panel
2. Consulta listado y filtros
3. Crea o edita propiedad
4. Sube imagenes y recursos
5. La informacion se guarda en DB y archivos en S3

### 14.4 Home dinamico

1. El admin actualiza modulos del home
2. La informacion queda en tablas de configuracion
3. El frontend lee esa configuracion y renderiza secciones dinamicas

### 14.5 Mapa dinamico enterprise

1. El usuario entra al modulo GIS
2. Puede seleccionar zona/subzonas o dibujar figuras
3. El sistema obtiene GeoJSON segun el contexto
4. La API consulta marcadores de `housing_universe`
5. La UI renderiza overlay, marcadores y cards del sidebar
6. Los marcadores se pueden filtrar por categoria

## 15. Reglas GIS y mapa interactivo

- `LeafletMap` es el componente reusable central
- La logica de dibujo y exportacion de GeoJSON vive en modulos separados
- El sidebar del mapa vive en la integracion enterprise, no en la capa de DB
- Se soportan figuras multiples
- Se soportan subzonas y marcadores simultaneamente
- El merge de marcadores debe evitar duplicados
- Los estilos de mapa y minimapas son parte del mismo componente reusable

## 16. Reglas para diagramado UML

### 16.1 Casos de uso sugeridos

- Consultar propiedades
- Ver detalle de propiedad
- Agregar/eliminar favorito
- Iniciar sesion / registrarse
- Gestionar propiedades
- Gestionar solicitudes
- Configurar home
- Gestionar contenido Enterprise
- Consultar mapa dinamico
- Filtrar marcadores por figura o subzona

### 16.2 Diagramas de clases sugeridos

- Usuario, Rol, Permiso
- Propiedad, Vendedor, ImagenPropiedad, PrecioPropiedad
- SolicitudContacto, Favorito
- HomeConfiguracion, InformacionPaginaItem, Recurso
- SolucionEmpresarial, ServicioEmpresarial, Plan, BeneficioPlan
- Zona, Subzona, MarcadorHousingUniverse
- LeafletMap, MapaDinamicoBody, SubzonaAutocomplete, SubzonaChecklist

### 16.3 Diagramas de componentes sugeridos

- Frontend publico
- Dashboard admin
- API REST
- Prisma/PostgreSQL
- S3
- Modulo GIS

### 16.4 Diagramas de secuencia sugeridos

- Consulta de listado de propiedades
- Envio de solicitud de contacto
- Creacion/edicion de propiedad
- Carga de mapa con subzonas y marcadores
- Consulta espacial por figura dibujada

## 17. Dependencias externas relevantes

- AWS S3
- SMTP
- Leaflet
- Leaflet Sidebar
- Leaflet Minimap
- Leaflet EasyButton
- Leaflet Choropleth
- PostgreSQL / PostGIS

## 18. Variables de entorno relevantes

```env

```

## 19. Comandos utiles para analisis posterior

```bash
npm run dev
npm run build
npm run lint
npm run test:run
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

## 20. Riesgos y consideraciones para UML

- El sistema mezcla dominio inmobiliario, CMS dinamico y GIS, por lo que conviene separar diagramas por subdominio
- Las relaciones de DB usan `id`, mientras la exposicion publica usa `idPublic`
- El modulo GIS tiene comportamiento de UI complejo que no debe modelarse solo como entidad de DB
- Existen integraciones externas que conviene representar en diagramas de componentes y despliegue
- Hay modulos recientes y en evolucion, especialmente `Enterprise` y `Mapa dinamico`

## 21. Recomendacion de siguientes diagramas

1. Diagrama de contexto del sistema
2. Diagrama de casos de uso por actor
3. Diagrama de componentes de la arquitectura
4. Diagrama de clases del dominio inmobiliario
5. Diagrama de clases del modulo Enterprise/GIS
6. Diagramas de secuencia para flujos criticos
