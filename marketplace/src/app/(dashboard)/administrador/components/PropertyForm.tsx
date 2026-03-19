"use client";

import AdminSectionCard from "@/components/Admin/Layout/AdminSectionCard";
import SectionHeader from "@/components/Admin/Layout/SectionHeader";
import NiceSelect from "@/components/UI/NiceSelect";
import PropertyImageUpload, {
  type ImagenPropiedadItem,
} from "../agregar-nueva-propiedad/components/PropertyImageUpload";
import PropertyAmenidadesSection from "../agregar-nueva-propiedad/components/PropertyAmenidadesSection";
import PropertyPlanesPisoSection, {
  type PlanPisoItem,
} from "../agregar-nueva-propiedad/components/PropertyPlanesPisoSection";
import { toast } from "sonner";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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

const monedaOptions = [
  { value: "GTQ", label: "GTQ" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

const emptyForm = {
  nombrePropiedad: "",
  referenciaCorta: "",
  descripcionGeneral: "",
  categoria: "",
  operacionInmobiliaria: "",
  zona: "",
  ciudad: "",
  departamento: "",
  pais: "",
  direccionPublica: "",
  latitud: "",
  longitud: "",
  habitaciones: "",
  banos: "",
  parqueos: "",
  metroConstruccion: "",
  metrosTerreno: "",
  anoConstruccion: "",
  vendedorExistente: "",
  moneda: "GTQ",
  precio: "",
  precioPorM2Construccion: "",
  mantenimiento: "",
  zonaIdPublic: "" as string,
};

type ApiPropiedad = {
  idPublic: string;
  nombrePropiedad: string;
  referenciaCorta: string | null;
  descripcionGeneral: string | null;
  categoria?: { idPublic: string; nombre: string; slug: string } | null;
  tipoOperacion?: { idPublic: string; nombre: string } | null;
  zona?: { idPublic: string; nombre: string } | null;
  direccionPublica: string | null;
  latitud: number | null;
  longitud: number | null;
  habitaciones: number | null;
  banos: number | null;
  parqueos: number | null;
  metrosConstruccion: number | null;
  metrosTerreno: number | null;
  anoConstruccion: number | null;
  vendedor?: { idPublic: string; nombre: string } | null;
  precio?: {
    moneda: string;
    precio: number;
    precioPorM2Construccion: number | null;
    mantenimiento: number | null;
  } | null;
  imagenes?: Array<{ idRecurso: string; url: string; orden: number; esPortada: boolean }>;
  amenidades?: Array<{ idPublic: string; nombreAmenidad: string }>;
  planesPiso?: Array<{ idPublic: string; nombreDelPlano: string; idRecurso: string; url: string; orden: number }>;
};

interface PropertyFormProps {
  mode: "create" | "edit";
  idPublic?: string;
  submitLabel?: string;
}

export default function PropertyForm({
  mode,
  idPublic = "",
  submitLabel,
}: PropertyFormProps) {
  const [formData, setFormData] = useState({ ...emptyForm });
  const [imagenes, setImagenes] = useState<ImagenPropiedadItem[]>([]);
  const [selectedAmenidadIds, setSelectedAmenidadIds] = useState<string[]>([]);
  const [planesPiso, setPlanesPiso] = useState<PlanPisoItem[]>([]);
  const [vendedorOptions, setVendedorOptions] = useState<{ value: string; label: string }[]>([
    { value: "", label: "Seleccione un vendedor" },
  ]);
  const [paisesOptions, setPaisesOptions] = useState<{ value: string; label: string }[]>([
    { value: "", label: "Seleccione país" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(mode === "edit" && !!idPublic);
  const { data: session } = useSession();
  const isVendedor = Array.isArray(session?.user?.roles) && session.user.roles.includes("VENDEDOR");

  useEffect(() => {
    if (mode !== "create") return;
    let cancelled = false;
    fetch("/api/propiedades/siguiente-referencia")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setFormData((prev) => ({ ...prev, referenciaCorta: d.referenciaCorta ?? "" }));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [mode]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/vendedores")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const list = Array.isArray(d) ? d : d?.data ?? d;
        const opts = [{ value: "", label: "Seleccione un vendedor" }];
        if (Array.isArray(list)) {
          list.forEach((v: { idPublic: string; nombre: string }) => {
            opts.push({ value: v.idPublic, label: v.nombre });
          });
        }
        setVendedorOptions(opts);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/paises")
      .then((r) => {
        if (!r.ok) return r.json().then((err) => ({ ok: false, body: err }));
        return r.json().then((body) => ({ ok: true, body }));
      })
      .then((result) => {
        if (cancelled) return;
        const d = result.body;
        const list: Array<{ idPublic: string; nombre: string }> = Array.isArray(d)
          ? d
          : Array.isArray(d?.data)
            ? d.data
            : [];
        const opts = [{ value: "", label: "Seleccione país" }];
        list.forEach((p) => {
          opts.push({ value: p.nombre, label: p.nombre });
        });
        setPaisesOptions(opts);
      })
      .catch(() => {
        if (!cancelled) {
          setPaisesOptions([{ value: "", label: "Seleccione país" }]);
        }
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !idPublic) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/propiedades/${idPublic}?scope=admin`)
      .then((r) => {
        if (!r.ok) throw new Error("Propiedad no encontrada");
        return r.json();
      })
      .then((p: ApiPropiedad) => {
        if (cancelled) return;
        const cat = p.categoria?.slug ?? "";
        const op = (p.tipoOperacion?.nombre ?? "").toLowerCase();
        const opVal = op === "renta" ? "renta" : op === "venta" ? "venta" : "";
        setFormData({
          ...emptyForm,
          nombrePropiedad: p.nombrePropiedad ?? "",
          referenciaCorta: p.referenciaCorta ?? "",
          descripcionGeneral: p.descripcionGeneral ?? "",
          categoria: cat,
          operacionInmobiliaria: opVal,
          zona: p.zona?.nombre ?? "",
          zonaIdPublic: p.zona?.idPublic ?? "",
          ciudad: "",
          departamento: "",
          pais: "",
          direccionPublica: p.direccionPublica ?? "",
          latitud: p.latitud != null ? String(p.latitud) : "",
          longitud: p.longitud != null ? String(p.longitud) : "",
          habitaciones: p.habitaciones != null ? String(p.habitaciones) : "",
          banos: p.banos != null ? String(p.banos) : "",
          parqueos: p.parqueos != null ? String(p.parqueos) : "",
          metroConstruccion: p.metrosConstruccion != null ? String(p.metrosConstruccion) : "",
          metrosTerreno: p.metrosTerreno != null ? String(p.metrosTerreno) : "",
          anoConstruccion: p.anoConstruccion != null ? String(p.anoConstruccion) : "",
          vendedorExistente: p.vendedor?.idPublic ?? "",
          moneda: p.precio?.moneda ?? "GTQ",
          precio: p.precio?.precio != null ? String(p.precio.precio) : "",
          precioPorM2Construccion:
            p.precio?.precioPorM2Construccion != null ? String(p.precio.precioPorM2Construccion) : "",
          mantenimiento: p.precio?.mantenimiento != null ? String(p.precio.mantenimiento) : "",
        });
        setImagenes(
          (p.imagenes ?? []).map((im) => ({
            idRecurso: im.idRecurso,
            url: im.url,
            esPortada: im.esPortada,
          }))
        );
        setSelectedAmenidadIds((p.amenidades ?? []).map((a) => a.idPublic));
        setPlanesPiso(
          (p.planesPiso ?? []).map((pp) => ({
            idPublic: pp.idPublic,
            nombreDelPlano: pp.nombreDelPlano,
            idRecurso: pp.idRecurso,
            url: pp.url,
            orden: pp.orden,
          }))
        );
      })
      .catch(() => toast.error("Error al cargar la propiedad"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [mode, idPublic]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (item: { value: string; label: string }) => {
    setFormData((prev) => ({ ...prev, [name]: item.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombrePropiedad || !formData.categoria || !formData.operacionInmobiliaria) {
      toast.error("Complete los campos requeridos: nombre, categoría y operación inmobiliaria.");
      return;
    }
    setSubmitting(true);
    try {
      const precioPayload = {
        moneda: formData.moneda,
        precio: formData.precio || "0",
        precioPorM2Construccion: formData.precioPorM2Construccion || null,
        mantenimiento: formData.mantenimiento || null,
      };
      const imagenesPayload = imagenes.map((im, i) => ({
        idRecurso: im.idRecurso,
        orden: i,
        esPortada: im.esPortada ?? i === 0,
      }));
      const planesPisoPayload = planesPiso.map((p, i) => ({
        nombreDelPlano: p.nombreDelPlano,
        idRecurso: p.idRecurso,
        orden: p.orden ?? i,
      }));

      if (mode === "create") {
        let creadoPor: string | undefined;
        const userRes = await fetch("/api/users");
        if (userRes.ok) {
          const u = await userRes.json();
          creadoPor = u.idPublic ?? u.data?.idPublic;
        }
        const body: Record<string, unknown> = {
          creadoPor,
          nombrePropiedad: formData.nombrePropiedad,
          referenciaCorta: formData.referenciaCorta || null,
          descripcionGeneral: formData.descripcionGeneral || null,
          estadoPublicacion: "BORRADOR",
          categoria: formData.categoria,
          operacionInmobiliaria: formData.operacionInmobiliaria,
          pais: formData.pais || undefined,
          departamento: formData.departamento || undefined,
          ciudad: formData.ciudad || undefined,
          zona: formData.zona || undefined,
          direccionPublica: formData.direccionPublica || null,
          latitud: formData.latitud || null,
          longitud: formData.longitud || null,
          habitaciones: formData.habitaciones || null,
          banos: formData.banos || null,
          parqueos: formData.parqueos || null,
          metroConstruccion: formData.metroConstruccion || null,
          metrosTerreno: formData.metrosTerreno || null,
          anoConstruccion: formData.anoConstruccion || null,
          precio: precioPayload,
          imagenes: imagenesPayload,
          amenidades: selectedAmenidadIds,
          planesPiso: planesPisoPayload,
        };
        if (!isVendedor) body.vendedorIdPublic = formData.vendedorExistente || undefined;
        const res = await fetch("/api/propiedades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data?.error || "Error al guardar la propiedad.");
          return;
        }
        toast.success("Propiedad agregada exitosamente.");
        setFormData({ ...emptyForm });
        setImagenes([]);
        setSelectedAmenidadIds([]);
        setPlanesPiso([]);
        const refRes = await fetch("/api/propiedades/siguiente-referencia");
        if (refRes.ok) {
          const refData = await refRes.json();
          setFormData((prev) => ({ ...prev, referenciaCorta: refData.referenciaCorta ?? "" }));
        }
      } else {
        const body: Record<string, unknown> = {
          nombrePropiedad: formData.nombrePropiedad,
          referenciaCorta: formData.referenciaCorta || null,
          descripcionGeneral: formData.descripcionGeneral || null,
          categoria: formData.categoria,
          operacionInmobiliaria: formData.operacionInmobiliaria,
          zona: formData.zona || undefined,
          direccionPublica: formData.direccionPublica || null,
          latitud: formData.latitud || null,
          longitud: formData.longitud || null,
          habitaciones: formData.habitaciones || null,
          banos: formData.banos || null,
          parqueos: formData.parqueos || null,
          metroConstruccion: formData.metroConstruccion || null,
          metrosTerreno: formData.metrosTerreno || null,
          anoConstruccion: formData.anoConstruccion || null,
          precio: precioPayload,
          imagenes: imagenesPayload,
          amenidades: selectedAmenidadIds,
          planesPiso: planesPisoPayload,
        };
        if (formData.zonaIdPublic) body.zonaIdPublic = formData.zonaIdPublic;
        if (!isVendedor) body.vendedorIdPublic = formData.vendedorExistente || null;
        const res = await fetch(`/api/propiedades/${idPublic}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data?.error || "Error al actualizar la propiedad.");
          return;
        }
        toast.success("Propiedad actualizada correctamente.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar. Revisa la consola.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="tp-dashboard-profile-wrapper">
        <div className="py-5 text-center">Cargando propiedad…</div>
      </div>
    );
  }

  const defaultSubmitLabel = mode === "create" ? "Agregar Propiedad" : "Guardar cambios";
  const label = submitLabel ?? defaultSubmitLabel;

  return (
    <form onSubmit={handleSubmit}>
      <AdminSectionCard>
        <SectionHeader title="Información Básica" showEditButton={false} />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-12">
              <div className="tp-dashboard-new-property-box">
                <div className="tp-dashboard-new-input">
                  <label>Nombre de Propiedad:* </label>
                  <input
                    type="text"
                    name="nombrePropiedad"
                    value={formData.nombrePropiedad}
                    onChange={handleInputChange}
                    placeholder="Ingrese el nombre de la propiedad"
                  />
                </div>
                <div className="tp-dashboard-new-input">
                  <label>Descripción General: </label>
                  <textarea
                    name="descripcionGeneral"
                    value={formData.descripcionGeneral}
                    onChange={handleInputChange}
                    placeholder="Descripción detallada de la propiedad"
                    rows={5}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="tp-dashboard-new-input">
                      <label>Categoría:* </label>
                      <div className="tp-property-tabs-select tp-select">
                        <NiceSelect
                          options={categoriaOptions}
                          defaultCurrent={0}
                          onChange={handleSelectChange("categoria")}
                          name="categoria"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="tp-dashboard-new-input">
                      <label>Operación Inmobiliaria:* </label>
                      <div className="tp-property-tabs-select tp-select">
                        <NiceSelect
                          options={operacionOptions}
                          defaultCurrent={0}
                          onChange={handleSelectChange("operacionInmobiliaria")}
                          name="operacionInmobiliaria"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard>
        <SectionHeader title="Ubicación" showEditButton={false} />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-12">
              <div className="tp-dashboard-new-property-box">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="tp-dashboard-new-input">
                      <label>Zona:* </label>
                      <input
                        type="text"
                        name="zona"
                        value={formData.zona}
                        onChange={handleInputChange}
                        placeholder="Zona"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="tp-dashboard-new-input">
                      <label>Ciudad:* </label>
                      <input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        placeholder="Ciudad"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="tp-dashboard-new-input">
                      <label>Departamento:* </label>
                      <input
                        type="text"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleInputChange}
                        placeholder="Departamento"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="tp-dashboard-new-input">
                      <label>País:* </label>
                      <div className="tp-property-tabs-select tp-select">
                        <NiceSelect
                          options={paisesOptions}
                          defaultCurrent={0}
                          onChange={handleSelectChange("pais")}
                          name="pais"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tp-dashboard-new-input">
                  <label>Dirección Pública:* </label>
                  <input
                    type="text"
                    name="direccionPublica"
                    value={formData.direccionPublica}
                    onChange={handleInputChange}
                    placeholder="Dirección completa de la propiedad"
                  />
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="tp-dashboard-new-input">
                      <label>Latitud:* </label>
                      <input
                        type="text"
                        name="latitud"
                        value={formData.latitud}
                        onChange={handleInputChange}
                        placeholder="Ej: 14.6349"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="tp-dashboard-new-input">
                      <label>Longitud:* </label>
                      <input
                        type="text"
                        name="longitud"
                        value={formData.longitud}
                        onChange={handleInputChange}
                        placeholder="Ej: -90.5069"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard>
        <SectionHeader title="Características" showEditButton={false} />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4">
                  <div className="tp-dashboard-new-input">
                    <label>Habitaciones:* </label>
                    <input
                      type="number"
                      name="habitaciones"
                      value={formData.habitaciones}
                      onChange={handleInputChange}
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="tp-dashboard-new-input">
                    <label>Baños:* </label>
                    <input
                      type="number"
                      name="banos"
                      value={formData.banos}
                      onChange={handleInputChange}
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="tp-dashboard-new-input">
                    <label>Parqueos:* </label>
                    <input
                      type="number"
                      name="parqueos"
                      value={formData.parqueos}
                      onChange={handleInputChange}
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="tp-dashboard-new-input">
                    <label>Metros de Construcción:* </label>
                    <input
                      type="number"
                      name="metroConstruccion"
                      value={formData.metroConstruccion}
                      onChange={handleInputChange}
                      placeholder="0"
                      min={0}
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="tp-dashboard-new-input">
                    <label>Metros de Terreno:* </label>
                    <input
                      type="number"
                      name="metrosTerreno"
                      value={formData.metrosTerreno}
                      onChange={handleInputChange}
                      placeholder="0"
                      min={0}
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="tp-dashboard-new-input">
                    <label>Año de Construcción:* </label>
                    <input
                      type="number"
                      name="anoConstruccion"
                      value={formData.anoConstruccion}
                      onChange={handleInputChange}
                      placeholder="Ej: 2020"
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard>
        <SectionHeader title="Precios propiedad" showEditButton={false} />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-12">
              <div className="tp-dashboard-new-property-box">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="tp-dashboard-new-input">
                      <label>Moneda: </label>
                      <div className="tp-property-tabs-select tp-select">
                        <NiceSelect
                          options={monedaOptions}
                          defaultCurrent={0}
                          onChange={handleSelectChange("moneda")}
                          name="moneda"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="tp-dashboard-new-input">
                      <label>Precio: </label>
                      <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="tp-dashboard-new-input">
                      <label>Precio por m² construcción: </label>
                      <input
                        type="number"
                        name="precioPorM2Construccion"
                        value={formData.precioPorM2Construccion}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="tp-dashboard-new-input">
                      <label>Mantenimiento: </label>
                      <input
                        type="number"
                        name="mantenimiento"
                        value={formData.mantenimiento}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
                <div className="tp-dashboard-new-input" style={{ marginTop: "8px" }}>
                  <span className="text-muted" style={{ fontSize: "13px", color: "var(--tp-text-body)" }}>
                    Fecha de actualización: se guardará automáticamente al guardar la propiedad.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard>
        <SectionHeader title="Amenidades" showEditButton={false} />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-12">
              <PropertyAmenidadesSection
                selectedIds={selectedAmenidadIds}
                onSelectedChange={setSelectedAmenidadIds}
              />
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard>
        <SectionHeader title="Planes de piso" showEditButton={false} />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-12">
              <PropertyPlanesPisoSection
                planes={planesPiso}
                onPlanesChange={setPlanesPiso}
                maxPlanes={10}
              />
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard>
        <SectionHeader title="Imágenes del Edificio" showEditButton={false} />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-12">
              <PropertyImageUpload
                images={imagenes}
                onImagesChange={setImagenes}
                maxImages={10}
              />
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard>
        <SectionHeader title="Información del Vendedor" showEditButton={false} />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-12">
              {isVendedor ? (
                <div className="tp-dashboard-new-input">
                  <label>Vendedor</label>
                  <p className="mb-0" style={{ padding: "8px 0" }}>
                    <strong>{session?.user?.nombreCompleto ?? session?.user?.name ?? session?.user?.email ?? "Usted"}</strong>
                  </p>
                  <small className="text-muted">Las propiedades se asignan automáticamente a su cuenta.</small>
                </div>
              ) : (
                <div className="tp-dashboard-new-input">
                  <label>Seleccionar Vendedor:* </label>
                  <div className="tp-property-tabs-select tp-select">
                    <NiceSelect
                      options={vendedorOptions}
                      defaultCurrent={0}
                      onChange={handleSelectChange("vendedorExistente")}
                      name="vendedorExistente"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <div className="tp-dashboard-new-btn d-flex flex-wrap align-items-center" style={{ gap: "12px" }}>
        <button type="submit" className="add" disabled={submitting}>
          {submitting ? "Guardando…" : label}
        </button>
        {mode === "edit" && (
          <Link
            href="/administrador/propiedades"
            className="tp-btn tp-btn-border d-inline-flex align-items-center"
            style={{ gap: "8px" }}
          >
            <i className="fa-light fa-arrow-left" />
            Regresar
          </Link>
        )}
      </div>
    </form>
  );
}
