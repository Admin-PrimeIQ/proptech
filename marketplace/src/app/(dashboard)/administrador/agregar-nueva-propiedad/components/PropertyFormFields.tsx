"use client";
import { useState } from "react";
import NiceSelect from "@/components/UI/NiceSelect";
import { CountryOptions } from "@/data/dropdownData";

interface PropertyFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function PropertyFormFields({ formData, setFormData }: PropertyFormFieldsProps) {
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const categoriaOptions = [
    { value: "apartamento", label: "Apartamento" },
    { value: "casa", label: "Casa" },
    { value: "terreno", label: "Terreno" },
    { value: "oficina", label: "Oficina" },
    { value: "local-comercial", label: "Local Comercial" },
    { value: "bodega", label: "Bodega" },
  ];

  const operacionOptions = [
    { value: "venta", label: "Venta" },
    { value: "renta", label: "Renta" },
  ];

  return (
    <div className="tp-dashboard-new-property mb-50">
      <h5 className="tp-dashboard-new-title">Información de la Propiedad</h5>
      <div className="tp-dashboard-new-property-box">
        {/* Nombre de la propiedad */}
        <div className="tp-dashboard-new-input">
          <label>Nombre de la Propiedad:*</label>
          <input
            type="text"
            placeholder="Ingrese el nombre de la propiedad"
            value={formData.nombre_propiedad || ""}
            onChange={(e) => handleInputChange("nombre_propiedad", e.target.value)}
          />
        </div>

        {/* Referencia corta */}
        <div className="tp-dashboard-new-input">
          <label>Referencia Corta:*</label>
          <input
            type="text"
            placeholder="Ingrese una referencia corta"
            value={formData.referencia_corta || ""}
            onChange={(e) => handleInputChange("referencia_corta", e.target.value)}
          />
        </div>

        {/* Descripción general */}
        <div className="tp-dashboard-new-input">
          <label>Descripción General:*</label>
          <textarea
            placeholder="Ingrese la descripción general de la propiedad"
            rows={5}
            value={formData.descripcion_general || ""}
            onChange={(e) => handleInputChange("descripcion_general", e.target.value)}
          />
        </div>

        {/* Categoría y Operación */}
        <div className="row">
          <div className="col-lg-6">
            <div className="tp-dashboard-new-input">
              <label>Categoría:*</label>
              <div className="tp-property-tabs-select tp-select">
                <NiceSelect
                  options={categoriaOptions}
                  defaultCurrent={0}
                  onChange={(value) => handleInputChange("categoria", value)}
                  name="categoria"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="tp-dashboard-new-input">
              <label>Operación Inmobiliaria:*</label>
              <div className="tp-property-tabs-select tp-select">
                <NiceSelect
                  options={operacionOptions}
                  defaultCurrent={0}
                  onChange={(value) => handleInputChange("operacion_inmobiliaria", value)}
                  name="operacion_inmobiliaria"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="row">
          <div className="col-lg-3">
            <div className="tp-dashboard-new-input">
              <label>País:*</label>
              <div className="tp-property-tabs-select tp-select">
                <NiceSelect
                  options={CountryOptions}
                  defaultCurrent={0}
                  onChange={(value) => handleInputChange("pais", value)}
                  name="pais"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="tp-dashboard-new-input">
              <label>Departamento:*</label>
              <input
                type="text"
                placeholder="Departamento"
                value={formData.departamento || ""}
                onChange={(e) => handleInputChange("departamento", e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-3">
            <div className="tp-dashboard-new-input">
              <label>Ciudad:*</label>
              <input
                type="text"
                placeholder="Ciudad"
                value={formData.ciudad || ""}
                onChange={(e) => handleInputChange("ciudad", e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-3">
            <div className="tp-dashboard-new-input">
              <label>Zona:*</label>
              <input
                type="text"
                placeholder="Zona"
                value={formData.zona || ""}
                onChange={(e) => handleInputChange("zona", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Dirección pública */}
        <div className="tp-dashboard-new-input">
          <label>Dirección Pública:*</label>
          <input
            type="text"
            placeholder="Ingrese la dirección pública"
            value={formData.direccion_publica || ""}
            onChange={(e) => handleInputChange("direccion_publica", e.target.value)}
          />
        </div>

        {/* Latitud y Longitud */}
        <div className="row">
          <div className="col-lg-6">
            <div className="tp-dashboard-new-input">
              <label>Latitud:*</label>
              <input
                type="text"
                placeholder="Ej: 14.6349"
                value={formData.latitud || ""}
                onChange={(e) => handleInputChange("latitud", e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="tp-dashboard-new-input">
              <label>Longitud:*</label>
              <input
                type="text"
                placeholder="Ej: -90.5069"
                value={formData.longitud || ""}
                onChange={(e) => handleInputChange("longitud", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
