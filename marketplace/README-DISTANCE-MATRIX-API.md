# Respuesta de Google Distance Matrix (uso en isocronas)

Este documento describe **qué enviamos** y **qué recibimos** al llamar a la API **Distance Matrix** de Google Maps Platform, en el contexto del backend:

`src/app/api/isochrone-corrected/route.ts` → función `fetchDistanceMatrixDurations`.

Documentación oficial de referencia: [Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix/overview).

---

## 1. Llamada que hace el proyecto

| Aspecto | Valor |
|---------|--------|
| Método | `GET` |
| URL base | `https://maps.googleapis.com/maps/api/distancematrix/json` |
| Uso en código | `MATRIX_BASE_URL` en `isochrone-corrected/route.ts` |

### Parámetros de consulta (query string)

| Parámetro | Ejemplo / valor | Notas |
|-----------|-----------------|--------|
| `origins` | `14.634915,-90.506882` | Un solo origen: **centro** de la isocrona (`lat,lng`). |
| `destinations` | `14.64,-90.51\|14.63,-90.50\|...` | Hasta **varios destinos** separados por `\|` (puntos de control en el borde). |
| `mode` | `driving` | Conducción. |
| `departure_time` | `now` | Permite que la respuesta incluya **`duration_in_traffic`** cuando Google aplica tráfico en vivo. |
| `traffic_model` | `pessimistic` | Modelo de tráfico pesimista. |
| `key` | API key | Orden de resolución de claves en servidor: ver `README-ISOCHRONES-TRAFFIC-MATRIX.md` / `README-AGENTE.md`. |

El cliente HTTP usa `cache: "no-store"` para no cachear la respuesta en el fetch.

---

## 2. Respuesta HTTP

- **Código 2xx:** el cuerpo es JSON. El código del proyecto exige `response.ok`; si no, lanza error.
- **Cuerpo:** objeto JSON raíz descrito abajo (misma forma que documenta Google como **Distance Matrix response**).

### GeoJSON

Esta API **no** devuelve **GeoJSON** (`FeatureCollection`, `Polygon`, etc.). Solo devuelve **matriz de tiempos/distancias** (`status`, `rows`, `elements`). Las **geometrías** de isocronas vienen de **Mapbox** en el flujo de Lifestyle Matcher; Matrix aporta únicamente **duraciones** (y distancias) entre puntos.

---

## 3. Campos que trae la respuesta de la API (estructura oficial)

La API devuelve un único objeto JSON. Abajo: **qué propiedades trae** cada nivel y qué tipo de dato es.

### 3.1 Objeto raíz (`DistanceMatrixResponse`)

| Campo | ¿Obligatorio? | Tipo | Qué es |
|--------|----------------|------|--------|
| `status` | Sí | string | Estado global de la petición. Valores: `OK`, `INVALID_REQUEST`, `MAX_ELEMENTS_EXCEEDED`, `MAX_DIMENSIONS_EXCEEDED`, `OVER_DAILY_LIMIT`, `OVER_QUERY_LIMIT`, `REQUEST_DENIED`, `UNKNOWN_ERROR`. |
| `error_message` | No | string | Mensaje legible si hubo error al procesar la solicitud (sobre todo cuando `status` ≠ `OK`). |
| `origin_addresses` | Sí | `string[]` | Direcciones formateadas de los **orígenes** (como las resolvió el geocoder). Solo lectura humana; Google desaconseja parsearlas en código. |
| `destination_addresses` | Sí | `string[]` | Igual para los **destinos**, en el orden de la petición. |
| `rows` | Sí | array de filas | Una **fila por cada origen**. Cada fila tiene un array `elements`. |

### 3.2 Cada fila (`rows[]` → `DistanceMatrixRow`)

| Campo | ¿Obligatorio? | Tipo | Qué es |
|--------|----------------|------|--------|
| `elements` | Sí | array | Un elemento por cada **par origen → destino**. El orden de `elements` coincide con el orden de `destinations` en la URL. |

### 3.3 Cada celda (`rows[].elements[]` → `DistanceMatrixElement`)

| Campo | ¿Obligatorio? | Tipo | Qué es |
|--------|----------------|------|--------|
| `status` | Sí | string | Estado de **ese** par origen-destino: `OK`, `NOT_FOUND`, `ZERO_RESULTS`, `MAX_ROUTE_LENGTH_EXCEEDED`. |
| `distance` | No | objeto | Distancia del trayecto. Ver **TextValueObject** abajo. Puede faltar si el elemento no es `OK`. |
| `duration` | No | objeto | Duración del trayecto **sin** depender del tráfico en vivo en el sentido de `duration_in_traffic`. **TextValueObject** (`value` en **segundos**). |
| `duration_in_traffic` | No | objeto | Duración estimada con **tráfico** (histórico + en vivo según modelo). **TextValueObject** (`value` en **segundos**). Solo aplica si la petición cumple condiciones (p. ej. `mode=driving`, `departure_time`, datos de tráfico disponibles para la ruta). |
| `fare` | No | objeto | Tarifa de transporte público. Solo en `mode=transit` cuando el proveedor expone precio. Campos típicos: `currency`, `text`, `value`. |

En el flujo **driving** de este proyecto **no** esperamos `fare`.

### 3.4 Objetos `distance`, `duration`, `duration_in_traffic` (`TextValueObject`)

Cada uno, cuando viene, tiene la misma forma:

| Campo | Tipo | Qué es |
|--------|------|--------|
| `text` | string | Valor formateado para mostrar al usuario (idioma según `language` de la petición). |
| `value` | number | Valor numérico: **metros** para `distance`; **segundos** para `duration` y `duration_in_traffic`. |

---

## 4. Ejemplo real: Zona 1 → Zona 10 (Ciudad de Guatemala)

Petición de prueba con **un origen y un destino** (coordenadas aproximadas en centro histórico y Zona 10):

| | Latitud | Longitud |
|--|---------|----------|
| Zona 1 (origen) | 14.6425 | -90.5132 |
| Zona 10 (destino) | 14.5855 | -90.4792 |

Parámetros: `mode=driving`, `departure_time=now`, `traffic_model=pessimistic` (igual que en `isochrone-corrected`).

El JSON **completo** (incluye metadatos de la prueba y la respuesta de Google) está en:

[`docs/examples/distance-matrix-response-zona1-zona10.json`](./docs/examples/distance-matrix-response-zona1-zona10.json)

Para **volver a generar** el archivo con tu propia clave (misma prioridad de env que el route):

```bash
node scripts/fetch-distance-matrix-sample.mjs
```

### Respuesta de Google (`googleResponse` en el archivo)

Valores reales de una ejecución (las direcciones en texto pueden variar ligeramente si Google actualiza el geocodificador):

```json
{
  "destination_addresses": [
    "Ruta Sin Nombre, Ciudad de Guatemala, Guatemala"
  ],
  "origin_addresses": [
    "5A Calle 696, Cdad. de Guatemala 10001, Guatemala"
  ],
  "rows": [
    {
      "elements": [
        {
          "distance": {
            "text": "10.6 km",
            "value": 10592
          },
          "duration": {
            "text": "26 mins",
            "value": 1530
          },
          "duration_in_traffic": {
            "text": "43 mins",
            "value": 2551
          },
          "status": "OK"
        }
      ]
    }
  ],
  "status": "OK"
}
```

Si `status` raíz no es `OK`, la respuesta puede incluir `error_message` y `rows` vacías o incompletas según el caso.

---

## 5. Qué usa exactamente nuestro código

Implementación: `fetchDistanceMatrixDurations` en `src/app/api/isochrone-corrected/route.ts`.

1. **Validación global:** `payload.status === "OK"`. Si no, se lanza error con `error_message` o el status.
2. **Fila:** `payload.rows[0].elements` (un origen → varios destinos).
3. **Por cada elemento:**
   - Se ignora si `element.status !== "OK"`.
   - Duración en segundos:  
     `duration_in_traffic.value` **si existe**; si no, `duration.value`.
   - Se convierte a **minutos**: `segundos / 60`.
   - Se descartan valores no finitos o `<= 0`.

**Resultado devuelto por la función:** un arreglo de números (`number[]`), cada uno = **minutos** de viaje para un destino válido, en orden paralelo a los elementos `OK` (tras el filtro, la longitud puede ser menor que la de destinos si algunos fallaron).

Ese arreglo se usa luego para calcular el **promedio** de minutos y el **factor de escala** de la geometría (ver `README-ISOCHRONES-TRAFFIC-MATRIX.md`).

---

## 6. Casos que provocan fallback en la ruta

| Situación | Comportamiento en `/api/isochrone-corrected` |
|-----------|-----------------------------------------------|
| HTTP no OK | Error capturado → fallback con geometría original. |
| `status` raíz ≠ `OK` | Igual. |
| Ningún elemento con `status === "OK"` o sin duraciones válidas | Fallback: razón del tipo *"Google no devolvio duraciones aprovechables."* |
| Sin API key | Fallback sin llamar a Matrix. |

---

## 7. Resumen

- **Respuesta completa (campos):** raíz → `status`, `error_message?`, `origin_addresses[]`, `destination_addresses[]`, `rows[]` → cada fila `elements[]` → cada celda `status`, `distance?`, `duration?`, `duration_in_traffic?`, `fare?` (transit). Los objetos de distancia/duración llevan `text` + `value`.
- **En isocronas solo usamos:** `status` raíz, `rows[0].elements`, y por celda `status`, `duration_in_traffic.value` o `duration.value` (segundos → minutos).
- **No usamos** aquí: `distance`, `fare`, `text`, ni las direcciones formateadas.

Para el flujo completo de isocronas (Mapbox + esta corrección), ver [`README-ISOCHRONES-TRAFFIC-MATRIX.md`](./README-ISOCHRONES-TRAFFIC-MATRIX.md).
