import { describe, expect, it } from "vitest";
import { isPriorityTitleWithoutPlaceSuggestions } from "@/app/enterprise/lifestyle-matcher/puntos/services/priorityPlaceSuggestions.policy";

describe("isPriorityTitleWithoutPlaceSuggestions", () => {
  it("excluye Trabajo (case insensitive)", () => {
    expect(isPriorityTitleWithoutPlaceSuggestions("Trabajo")).toBe(true);
    expect(isPriorityTitleWithoutPlaceSuggestions("trabajo")).toBe(true);
    expect(isPriorityTitleWithoutPlaceSuggestions("  Trabajo  ")).toBe(true);
  });

  it("no excluye otros títulos", () => {
    expect(isPriorityTitleWithoutPlaceSuggestions("Hospital")).toBe(false);
    expect(isPriorityTitleWithoutPlaceSuggestions("Mi trabajo cerca")).toBe(false);
  });
});
