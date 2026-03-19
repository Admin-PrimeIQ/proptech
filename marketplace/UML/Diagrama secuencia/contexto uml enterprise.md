# Contexto UML - Enterprise

Este documento concentra el contexto del subdominio `Enterprise`, enfocado en mapas, clasificacion espacial, consultas GIS, visualizacion de subzonas, marcadores y administracion del contenido enterprise.

## 1. Alcance del subdominio

El subdominio `Enterprise` cubre:

- Rutas enterprise
- Modulo de mapa dinamico
- Mapa de absorcion
- Sidebar con cards y filtros
- Dibujo de figuras espaciales
- Subzonas y zonas
- Consultas GeoJSON
- Marcadores `housing_universe`
- Clasificacion y filtrado de marcadores
- Estilos de mapa y minimapas
- Configuracion del contenido enterprise

No incluye:

- CRUD principal de propiedades del marketplace publico
- Home general del sitio
- Gestion publica de favoritos o formularios de compra/venta

## 2. Objetivo funcional

Permitir a usuarios del modulo enterprise consultar informacion geoespacial y proyectos inmobiliarios mediante mapas interactivos, filtros espaciales y clasificacion de datos.

## 3. Actores principales

- Usuario autenticado con acceso a Enterprise
- Administrador
- Super Administrador

## 4. Modulos funcionales incluidos

### 4.1 Navegacion Enterprise

- Dashboard enterprise
- Mapa dinamico
- Mapa de absorcion

### 4.2 Administracion Enterprise

- Configuracion de hero enterprise
- Configuracion de informacion enterprise
- CRUD de servicios empresariales
- CRUD de planes
- CRUD de beneficios del plan

### 4.3 Modulo GIS

- Render de mapa base
- Render de overlays GeoJSON
- Seleccion de zona
- Seleccion de subzonas
- Dibujo de poligonos
- Dibujo de circulos
- Soporte a multiples figuras
- Consultas espaciales a marcadores

### 4.4 Modulo de marcadores

- Consulta de marcadores `housing_universe`
- Filtrado por figura
- Filtrado por zona/subzona
- Filtro por categoria
- Cards en sidebar
- Popup de marcador
- Iconografia por tipo de vivienda

### 4.5 Modulo de estilos de mapa

- Cambio de mapa base
- Minimapas preview
- Selector de estilos desde submenu

## 5. Arquitectura del subdominio

### 5.1 Capas

- Presentacion: paginas enterprise y componentes de mapa
- Aplicacion: orquestacion de filtros, figuras y sidebar
- API: endpoints GIS y CRUD enterprise
- Persistencia: PostgreSQL, Prisma y PostGIS
- Integracion: Leaflet y plugins

### 5.2 Rutas principales

- `/enterprise/dashboard`
- `/enterprise/mapa-dinamico`
- `/enterprise/mapa-absorcion`
- `/administrador/enterprise`

## 6. Componentes tecnicos principales

### 6.1 Mapa reusable

- `LeafletMap`
- `leafletMapSetup.ts`
- `leafletDrawing.ts`
- `leafletGeoJson.ts`
- `leafletMap.types.ts`

### 6.2 Integracion del mapa dinamico

- `MapaDinamicoBody`
- `SubzonaAutocomplete`
- `SubzonaChecklist`

### 6.3 Administracion enterprise

- `EnterpriseContent`
- estilos locales del modulo

## 7. Entidades principales

### 7.1 Entidades enterprise

- `soluciones_empresariales`
- `servicios_empresariales`
- `planes`
- `beneficios_plan`
- `planes_servicios`
- `recursos`

### 7.2 Entidades geoespaciales

- `geo_subzonas.subzona`
- `geo_subzonas.subzona_lote_carga`
- `geo_subzonas.subzona_error_ingesta`

### 7.3 Entidades de clasificacion/consulta

- registros de `housing_universe` consumidos por API GeoJSON
- categorias de marcador
- geometria dibujada por el usuario

## 8. Relaciones conceptuales clave

- Una solucion empresarial puede usar recursos multimedia
- Un servicio empresarial puede usar recursos multimedia
- Un plan tiene muchos beneficios
- Un plan puede asociarse a muchos servicios
- Una zona contiene muchas subzonas
- Una subzona participa en filtros geograficos
- Los marcadores pueden ser filtrados por subzonas, zona o figuras dibujadas
- Un mapa puede mostrar simultaneamente overlays, figuras y marcadores

## 9. Reglas arquitectonicas importantes

- `LeafletMap` es reusable y no debe romperse
- La logica de dibujo y exportacion GeoJSON vive en archivos modulares
- La logica de negocio del modulo enterprise no debe mezclarse con persistencia directa dentro del componente reusable
- El sidebar y filtros viven en la capa de integracion enterprise
- El merge de marcadores debe evitar duplicados
- Las figuras multiples deben conservar su representacion y sus marcadores

## 10. APIs principales del subdominio

### 10.1 CRUD enterprise

- `/api/soluciones-empresariales`
- `/api/servicios-empresariales`
- `/api/planes`
- `/api/beneficios-plan`

### 10.2 GIS y mapas

- `/api/subzonas`
- `/api/subzonas/geojson`
- `/api/search/subzonas`
- `/api/housing-universe/geojson`
- `/api/housing-universe/categories`

## 11. Flujos principales

### 11.1 Carga inicial del mapa dinamico

1. El usuario entra a `/enterprise/mapa-dinamico`
2. Se monta el mapa reusable
3. El sidebar puede mostrar cards iniciales
4. El mapa espera seleccion o figuras para mostrar marcadores

### 11.2 Filtrado por zona y subzonas

1. El usuario selecciona una zona
2. La UI consulta subzonas y GeoJSON
3. Se renderiza overlay de subzonas
4. Se consultan marcadores asociados
5. El sidebar y el mapa se actualizan

### 11.3 Filtrado por figura dibujada

1. El usuario activa modo poligono o circulo
2. Dibuja una figura sobre el mapa
3. El componente genera GeoJSON
4. La API consulta marcadores por interseccion o distancia
5. Se muestran marcadores y cards

### 11.4 Multiples figuras

1. El usuario dibuja varias figuras
2. Cada figura queda persistida visualmente
3. El sistema consulta marcadores por cada figura
4. Los resultados se fusionan sin duplicar
5. Los marcadores permanecen visibles para todas las figuras activas

### 11.5 Filtrado por categoria de marcador

1. El sistema consulta categorias disponibles
2. El usuario marca o desmarca categorias
3. El frontend filtra el GeoJSON de marcadores
4. El mapa y el sidebar se sincronizan

### 11.6 Cambio de estilo de mapa

1. El usuario abre el submenu de estilos
2. Visualiza minimapa preview al pasar el cursor
3. Selecciona un estilo
4. El mapa principal cambia de tile layer

## 12. Reglas espaciales importantes

- Geometrias poligonales usan interseccion espacial
- Circulos usan consulta por distancia con `radius`
- Se utiliza saneamiento geometrico en backend
- El mapa puede mezclar resultados de figura y zona
- Los marcadores no deben duplicarse al fusionar colecciones

## 13. Comportamientos tecnicos relevantes

- Sidebar colapsable
- Marcadores visibles por zoom o por `forceMarkersVisible`
- Popup de subzona y popup de marcador coexisten
- Estilos de mapa con mini mapa preview
- Iconos de marcadores con SVG segun categoria
- Soporte de multiples circulos y poligonos

## 14. Casos de uso sugeridos para UML

- Consultar mapa dinamico
- Seleccionar zona y subzonas
- Dibujar poligono
- Dibujar circulo
- Filtrar proyectos por area espacial
- Filtrar marcadores por categoria
- Cambiar estilo de mapa
- Gestionar contenido enterprise
- Gestionar servicios enterprise
- Gestionar planes y beneficios

## 15. Clases candidatas para UML

- LeafletMap
- MapaDinamicoBody
- DrawingController
- GeoJsonEmitter
- Subzona
- Zona
- MarcadorHousingUniverse
- CategoriaMarcador
- SolucionEmpresarial
- ServicioEmpresarial
- Plan
- BeneficioPlan
- Recurso

## 16. Diagramas recomendados

1. Diagrama de componentes del modulo Enterprise
2. Diagrama de clases del mapa reusable y su integracion
3. Diagrama de clases del dominio enterprise
4. Diagrama de secuencia para consulta espacial por figura
5. Diagrama de secuencia para seleccion de zona y carga de marcadores
6. Diagrama de despliegue con PostgreSQL/PostGIS y frontend Next.js
