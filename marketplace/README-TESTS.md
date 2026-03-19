# Resultados de pruebas — Marketplace Inmobiliario

Este documento resume los resultados de las pruebas unitarias/integración para escenarios críticos de la aplicación.

---

## Ejecución

```bash
npm run test:run
```

Salida esperada (18 pruebas, 7 archivos):

```
 ✓ tests/api/propiedades-concurrent.test.ts (1 test)
 ✓ tests/api/autorizacion.test.ts (2 tests)
 ✓ tests/api/favoritos-vs-delete.test.ts (3 tests)
 ✓ tests/api/validacion.test.ts (4 tests)
 ✓ tests/api/propiedades-load.test.ts (1 test)
 ✓ tests/api/solicitudes-contacto.test.ts (6 tests)
 ✓ tests/api/not-found.test.ts (1 test)

 Test Files  7 passed (7)
      Tests  18 passed (18)
```

---

## Resultados por escenario

### Escenario 1: Ruta/recurso inexistente (404)

| Prueba | Resultado | Descripción |
|--------|-----------|-------------|
| GET /api/propiedades/[idPublic] con id inexistente | ✅ PASA | Devuelve 404 y mensaje "Propiedad no encontrada" |

**Comportamiento:** Si un usuario solicita el detalle de una propiedad con un `idPublic` que no existe en BD, la API responde con status 404 y un mensaje de error apropiado.

---

### Escenario 2: Dos usuarios agregan propiedad a la vez (concurrencia)

| Prueba | Resultado | Descripción |
|--------|-----------|-------------|
| Dos POST /api/propiedades en paralelo | ✅ PASA | Ambas respuestas 200, recursos con idPublic distintos |

**Comportamiento:** Dos peticiones POST simultáneas para crear propiedades pueden completarse sin pisarse. Cada creación devuelve un recurso con su propio `idPublic`.

---

### Escenario 3: Carga — 50 usuarios viendo propiedades

| Prueba | Resultado | Descripción |
|--------|-----------|-------------|
| 50 GET /api/propiedades en paralelo | ✅ PASA | Todas las respuestas 200, estructura correcta (data + pagination) |

**Comportamiento:** Con muchas peticiones GET simultáneas al listado de propiedades, todas responden correctamente con status 200 y la estructura esperada (array `data` y objeto `pagination`).

---

### Escenario 4: Favoritos vs eliminación de propiedad (race)

| Prueba | Resultado | Descripción |
|--------|-----------|-------------|
| POST favoritos con propiedad ya eliminada | ✅ PASA | Devuelve 404 "Propiedad no encontrada" |
| POST favoritos sin sesión | ✅ PASA | Devuelve 401 "Debes iniciar sesión" |
| POST en paralelo (propiedad inexistente) | ✅ PASA | No devuelven 500; respuestas 404 o 200/409 |

**Comportamiento:** Cuando un usuario intenta agregar a favoritos una propiedad que ya fue eliminada por el propietario, la API devuelve 404. En paralelo, no se producen errores 500. El esquema Prisma usa `onDelete: Cascade` para favoritos, por lo que al borrar una propiedad se eliminan sus favoritos automáticamente.

---

### Escenario 5: API autorización (prioridad alta)

| Prueba | Resultado | Descripción |
|--------|-----------|-------------|
| DELETE propiedad sin ser dueño | ✅ PASA | Devuelve 403 "No puede eliminar esta propiedad" |
| PUT propiedad sin ser dueño | ✅ PASA | Devuelve 403 "No puede editar esta propiedad" |

**Comportamiento:** Un vendedor que no es dueño de una propiedad no puede eliminarla ni editarla. La API devuelve 403 en ambos casos.

---

### Escenario 6: API validación (prioridad alta)

| Prueba | Resultado | Descripción |
|--------|-----------|-------------|
| POST propiedades sin nombrePropiedad | ✅ PASA | Devuelve 400 "El nombre de la propiedad es requerido" |
| POST favoritos sin idPropiedadPublic | ✅ PASA | Devuelve 400 "Se requiere idPropiedadPublic" |
| POST solicitudes con correo inválido | ✅ PASA | Devuelve 400 (validación Zod) |
| POST solicitudes sin nombre | ✅ PASA | Devuelve 400 (validación Zod) |

**Comportamiento:** Las APIs rechazan datos inválidos o incompletos con status 400 y mensajes de error claros.

---

### Escenario 7: Solicitudes de contacto (prioridad alta)

| Prueba | Resultado | Descripción |
|--------|-----------|-------------|
| POST con propiedad inexistente | ✅ PASA | Devuelve 404 "Propiedad no encontrada" |
| POST con datos válidos y propiedad existente | ✅ PASA | Devuelve 200 con idPublic y mensaje de éxito |
| GET listado | ✅ PASA | Devuelve 200 con array de solicitudes |
| PATCH con id inexistente | ✅ PASA | Devuelve 404 "Solicitud no encontrada" |
| PATCH con estado inválido | ✅ PASA | Devuelve 400 (validación Zod) |
| PATCH con estado válido (CONTACTADO) | ✅ PASA | Devuelve 200 con estado y contactado actualizados |

**Comportamiento:** El módulo de solicitudes de contacto valida entradas, maneja recursos inexistentes (404) y permite actualizar el estado (PENDIENTE, CONTACTADO, NO_CONTACTAR).

---

## Pros

1. **Sin base de datos real:** Los tests usan mocks de Prisma y auth, no requieren BD ni seed.
2. **Ejecución rápida:** ~3 s para las 18 pruebas.
3. **Escenarios claros:** Cubren 404, concurrencia, carga, race favoritos/eliminación, autorización (403), validación (400) y solicitudes de contacto.
4. **Arquitectura respetada:** Se reutilizan los handlers reales; solo se mockean dependencias externas (BD, auth).
5. **Idioma consistente:** Mensajes y nombres de pruebas en español, alineado con README-AGENTE.

---

## Contras

1. **Mocks extensos:** Los tests de propiedades requieren mockear varios módulos (prisma, auth-helpers, api-propiedades).
2. **No integración real con BD:** No se valida el comportamiento contra PostgreSQL ni migraciones.
3. **Carga simbólica:** Las 50 peticiones se lanzan en paralelo contra mocks; no mide rendimiento real del servidor o la BD.
4. **Race parcial:** El test de favoritos vs eliminación simula solo el caso “propiedad inexistente”; no se ejecuta el DELETE real contra BD en paralelo con POST.
5. **Dependencia de NextRequest:** El test 404 necesita `NextRequest` para acceder a `nextUrl`; una Request estándar no es suficiente.

---

## Archivos de test

| Archivo | Escenarios |
|---------|------------|
| `tests/api/not-found.test.ts` | Recurso inexistente (404) |
| `tests/api/propiedades-concurrent.test.ts` | Dos POST propiedades en paralelo |
| `tests/api/propiedades-load.test.ts` | 50 GET listado en paralelo |
| `tests/api/favoritos-vs-delete.test.ts` | Favoritos con propiedad eliminada / sin sesión / paralelo |
| `tests/api/autorizacion.test.ts` | DELETE/PUT propiedad sin permiso → 403 |
| `tests/api/validacion.test.ts` | POST con datos inválidos → 400 |
| `tests/api/solicitudes-contacto.test.ts` | POST/GET/PATCH solicitudes (404, 400, 200) |

---

## Configuración

- **Vitest:** `vitest.config.ts` en la raíz
- **Setup:** `tests/setup.ts` (variables de entorno)
- **Alias:** `@/` → `src/`, `next/server` → `node_modules/next/server.js` para compatibilidad con next-auth

---

*Última ejecución: febrero 2026*
prueba