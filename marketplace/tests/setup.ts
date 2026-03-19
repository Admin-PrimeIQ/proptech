/**
 * Setup global para Vitest.
 * Los mocks de auth y prisma se definen en cada archivo de test según el escenario.
 */
import { beforeAll, vi } from "vitest";

beforeAll(() => {
  // Evitar que los tests fallen por variables de entorno no definidas
  process.env.NODE_ENV = process.env.NODE_ENV || "test";
});
