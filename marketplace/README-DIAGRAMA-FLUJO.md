# Diagrama de flujo del proyecto — Marketplace Inmobiliario

Este documento resume el flujo principal del sistema (público y admin) y la relación entre UI, APIs y base de datos.

## Diagrama general (Mermaid)

```mermaid
flowchart TD
  %% NODOS PRINCIPALES
  START([Inicio]):::start
  FIN([Fin]):::end

  %% DECISIÓN PRINCIPAL
  START --> DEC{¿Qué desea hacer?}

  %% RAMA: COMPRA
  DEC -->|Compra| C1[Explorar propiedades]:::step
  C1 --> C2[Filtrar /propiedades]:::step
  C2 --> C3[Ver detalle /property-details-2/[idPublic]]:::step
  C3 --> C4{¿Contactar?}
  C4 -->|Sí| C5[Enviar formulario<br/>POST /api/solicitudes-contacto]:::api
  C4 -->|No| C6[Guardar en favoritos<br/>POST /api/favoritos]:::api

  %% RAMA: VENTA
  DEC -->|Venta| V1[Iniciar sesión]:::step
  V1 --> V2[Acceder a /administrador]:::step
  V2 --> V3[Crear/editar propiedad]:::step
  V3 --> V4[Subir imágenes]:::step
  V4 --> V5[Publicar propiedad]:::step

  %% RAMA: INICIAR SESIÓN
  DEC -->|Iniciar sesión| S1[Sign-in / sign-up]:::step
  S1 --> S2{¿Rol?}
  S2 -->|Usuario| S3[Ver favoritos / perfil]:::step
  S2 -->|Admin| S4[Gestionar propiedades / solicitudes]:::step
  S2 -->|Super Admin| S5[Configurar home + contenido]:::step

  %% RAMA: SUPER ADMIN (CAMBIOS DE PÁGINA)
  DEC -->|Configurar página| SA1[Super Admin entra al panel]:::step
  SA1 --> SA2[Editar home/configuración]:::step
  SA2 --> SA3[Actualizar contenido dinámico]:::step

  %% UNIÓN DE RAMAS
  C5 --> JOIN((Unión)):::join
  C6 --> JOIN
  V5 --> JOIN
  S3 --> JOIN
  S4 --> JOIN
  S5 --> JOIN
  SA3 --> JOIN
  JOIN --> FIN

  classDef start fill:#f3f9f3,stroke:#2f7d32,stroke-width:1px;
  classDef end fill:#fff3f3,stroke:#b71c1c,stroke-width:1px;
  classDef step fill:#ffffff,stroke:#666,stroke-width:1px;
  classDef api fill:#eef6ff,stroke:#3a6ea5,stroke-width:1px;
  classDef join fill:#f6f6f6,stroke:#333,stroke-width:1px;
```

## Flujos clave (resumen)

1. **Home y propiedades**  
   UI pública consume `GET /api/propiedades` y `GET /api/propiedades/[idPublic]`. Prisma consulta en PostgreSQL y responde.

2. **Favoritos (con sesión)**  
   UI valida sesión con NextAuth. El API de favoritos requiere sesión y opera sobre la tabla `favoritos`.

3. **Solicitudes de contacto**  
   Desde el detalle se envía a `POST /api/solicitudes-contacto` y se guarda en `solicitudes_contacto`.

4. **Admin / Dashboard**  
   CRUD completo sobre propiedades, vendedores, configuración del home y contenido dinámico. Todo pasa por APIs en `src/app/api/*`.

5. **Imágenes y recursos**  
   Subida a S3 mediante `POST /api/upload`. Se crea el registro en `recursos` y se asocia a propiedades/vendedores/home.

## Convenciones críticas

- `id` (BigInt) es interno para relaciones y BD.
- `idPublic` (UUID) es el identificador público en APIs y URLs.
- Las rutas públicas usan `idPublic` (ej. `/property-details-2/[idPublic]`).

## Archivos de referencia

- `README-AGENTE.md` (arquitectura y reglas)
- `README-AGENTE-FRONTEND.md` (frontend)
- `README-LAYOUT.md` (layout y estructura de UI)
- `prisma/schema.prisma` (modelos de datos)
