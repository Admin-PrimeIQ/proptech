"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import AdminSectionCard from "@/components/Admin/Layout/AdminSectionCard";
import SectionHeader from "@/components/Admin/Layout/SectionHeader";
import ImageUploader from "@/components/Admin/Fields/ImageUploader";

type ImagenItem = { idRecurso: string; url: string } | null;

type AcercaDeNosotrosData = {
  titulo: string;
  tituloSeccionRazones: string;
  textoSeccionRazones: string;
  informacionExcelencia: string;
  informacionLogros: string;
  informacionCalidad: string;
  informacionTransparencia: string;
  imagenPrincipal: ImagenItem;
  imagenPrincipalRazones: ImagenItem;
  imagenSecundariaRazones: ImagenItem;
  imagenEncuentraTuFuturo: ImagenItem;
  imagenCompraAlquila: ImagenItem;
  imagenListaTuPropiedad: ImagenItem;
};

const emptyData: AcercaDeNosotrosData = {
  titulo: "",
  tituloSeccionRazones: "",
  textoSeccionRazones: "",
  informacionExcelencia: "",
  informacionLogros: "",
  informacionCalidad: "",
  informacionTransparencia: "",
  imagenPrincipal: null,
  imagenPrincipalRazones: null,
  imagenSecundariaRazones: null,
  imagenEncuentraTuFuturo: null,
  imagenCompraAlquila: null,
  imagenListaTuPropiedad: null,
};

function parseApiResponse(data: Record<string, unknown>): AcercaDeNosotrosData {
  const img = (v: unknown): ImagenItem =>
    v && typeof v === "object" && "idRecurso" in v && "url" in v
      ? { idRecurso: String((v as { idRecurso: string }).idRecurso), url: String((v as { url: string }).url) }
      : null;
  return {
    titulo: String(data.titulo ?? ""),
    tituloSeccionRazones: String(data.tituloSeccionRazones ?? ""),
    textoSeccionRazones: String(data.textoSeccionRazones ?? ""),
    informacionExcelencia: String(data.informacionExcelencia ?? ""),
    informacionLogros: String(data.informacionLogros ?? ""),
    informacionCalidad: String(data.informacionCalidad ?? ""),
    informacionTransparencia: String(data.informacionTransparencia ?? ""),
    imagenPrincipal: img(data.imagenPrincipal),
    imagenPrincipalRazones: img(data.imagenPrincipalRazones),
    imagenSecundariaRazones: img(data.imagenSecundariaRazones),
    imagenEncuentraTuFuturo: img(data.imagenEncuentraTuFuturo),
    imagenCompraAlquila: img(data.imagenCompraAlquila),
    imagenListaTuPropiedad: img(data.imagenListaTuPropiedad),
  };
}

export default function AcercaDeNosotrosForm() {
  const [saved, setSaved] = useState<AcercaDeNosotrosData>(emptyData);
  const [loading, setLoading] = useState(true);

  // Sección principal
  const [titulo, setTitulo] = useState("");
  const [imagenPrincipalUrl, setImagenPrincipalUrl] = useState<string | null>(null);
  const [imagenPrincipalIdRecurso, setImagenPrincipalIdRecurso] = useState<string | null>(null);
  const [editingPrincipal, setEditingPrincipal] = useState(false);
  const [savingPrincipal, setSavingPrincipal] = useState(false);

  // Sección razones
  const [tituloSeccionRazones, setTituloSeccionRazones] = useState("");
  const [textoSeccionRazones, setTextoSeccionRazones] = useState("");
  const [imagenPrincipalRazonesUrl, setImagenPrincipalRazonesUrl] = useState<string | null>(null);
  const [imagenPrincipalRazonesIdRecurso, setImagenPrincipalRazonesIdRecurso] = useState<string | null>(null);
  const [imagenSecundariaRazonesUrl, setImagenSecundariaRazonesUrl] = useState<string | null>(null);
  const [imagenSecundariaRazonesIdRecurso, setImagenSecundariaRazonesIdRecurso] = useState<string | null>(null);
  const [editingRazones, setEditingRazones] = useState(false);
  const [savingRazones, setSavingRazones] = useState(false);

  // Sección búsqueda
  const [imagenEncuentraTuFuturoUrl, setImagenEncuentraTuFuturoUrl] = useState<string | null>(null);
  const [imagenEncuentraTuFuturoIdRecurso, setImagenEncuentraTuFuturoIdRecurso] = useState<string | null>(null);
  const [imagenCompraAlquilaUrl, setImagenCompraAlquilaUrl] = useState<string | null>(null);
  const [imagenCompraAlquilaIdRecurso, setImagenCompraAlquilaIdRecurso] = useState<string | null>(null);
  const [imagenListaTuPropiedadUrl, setImagenListaTuPropiedadUrl] = useState<string | null>(null);
  const [imagenListaTuPropiedadIdRecurso, setImagenListaTuPropiedadIdRecurso] = useState<string | null>(null);
  const [editingBusqueda, setEditingBusqueda] = useState(false);
  const [savingBusqueda, setSavingBusqueda] = useState(false);

  // Sección cómo hacemos esto fácil
  const [informacionExcelencia, setInformacionExcelencia] = useState("");
  const [informacionLogros, setInformacionLogros] = useState("");
  const [informacionCalidad, setInformacionCalidad] = useState("");
  const [informacionTransparencia, setInformacionTransparencia] = useState("");
  const [editingFacil, setEditingFacil] = useState(false);
  const [savingFacil, setSavingFacil] = useState(false);

  const applySaved = useCallback((data: AcercaDeNosotrosData) => {
    setTitulo(data.titulo);
    setImagenPrincipalUrl(data.imagenPrincipal?.url ?? null);
    setImagenPrincipalIdRecurso(data.imagenPrincipal?.idRecurso ?? null);
    setTituloSeccionRazones(data.tituloSeccionRazones);
    setTextoSeccionRazones(data.textoSeccionRazones);
    setImagenPrincipalRazonesUrl(data.imagenPrincipalRazones?.url ?? null);
    setImagenPrincipalRazonesIdRecurso(data.imagenPrincipalRazones?.idRecurso ?? null);
    setImagenSecundariaRazonesUrl(data.imagenSecundariaRazones?.url ?? null);
    setImagenSecundariaRazonesIdRecurso(data.imagenSecundariaRazones?.idRecurso ?? null);
    setImagenEncuentraTuFuturoUrl(data.imagenEncuentraTuFuturo?.url ?? null);
    setImagenEncuentraTuFuturoIdRecurso(data.imagenEncuentraTuFuturo?.idRecurso ?? null);
    setImagenCompraAlquilaUrl(data.imagenCompraAlquila?.url ?? null);
    setImagenCompraAlquilaIdRecurso(data.imagenCompraAlquila?.idRecurso ?? null);
    setImagenListaTuPropiedadUrl(data.imagenListaTuPropiedad?.url ?? null);
    setImagenListaTuPropiedadIdRecurso(data.imagenListaTuPropiedad?.idRecurso ?? null);
    setInformacionExcelencia(data.informacionExcelencia);
    setInformacionLogros(data.informacionLogros);
    setInformacionCalidad(data.informacionCalidad);
    setInformacionTransparencia(data.informacionTransparencia);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/acerca-de-nosotros")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.error) {
          toast.error(json.error ?? "Error al cargar Acerca de nosotros");
          return;
        }
        const data = parseApiResponse(json);
        setSaved(data);
        applySaved(data);
      })
      .catch(() => {
        if (!cancelled) toast.error("Error al cargar Acerca de nosotros");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applySaved]);

  const saveSection = useCallback(
    async (
      payload: Record<string, unknown>,
      setSaving: (v: boolean) => void,
      setEditing: (v: boolean) => void
    ) => {
      setSaving(true);
      try {
        const res = await fetch("/api/acerca-de-nosotros", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) {
          toast.error(json?.error ?? "Error al guardar");
          return;
        }
        const data = parseApiResponse(json);
        setSaved(data);
        applySaved(data);
        setEditing(false);
        toast.success("Cambios guardados correctamente");
      } catch {
        toast.error("Error al guardar");
      } finally {
        setSaving(false);
      }
    },
    [applySaved]
  );

  const cancelPrincipal = useCallback(() => {
    setTitulo(saved.titulo);
    setImagenPrincipalUrl(saved.imagenPrincipal?.url ?? null);
    setImagenPrincipalIdRecurso(saved.imagenPrincipal?.idRecurso ?? null);
    setEditingPrincipal(false);
  }, [saved]);
  const cancelRazones = useCallback(() => {
    setTituloSeccionRazones(saved.tituloSeccionRazones);
    setTextoSeccionRazones(saved.textoSeccionRazones);
    setImagenPrincipalRazonesUrl(saved.imagenPrincipalRazones?.url ?? null);
    setImagenPrincipalRazonesIdRecurso(saved.imagenPrincipalRazones?.idRecurso ?? null);
    setImagenSecundariaRazonesUrl(saved.imagenSecundariaRazones?.url ?? null);
    setImagenSecundariaRazonesIdRecurso(saved.imagenSecundariaRazones?.idRecurso ?? null);
    setEditingRazones(false);
  }, [saved]);
  const cancelBusqueda = useCallback(() => {
    setImagenEncuentraTuFuturoUrl(saved.imagenEncuentraTuFuturo?.url ?? null);
    setImagenEncuentraTuFuturoIdRecurso(saved.imagenEncuentraTuFuturo?.idRecurso ?? null);
    setImagenCompraAlquilaUrl(saved.imagenCompraAlquila?.url ?? null);
    setImagenCompraAlquilaIdRecurso(saved.imagenCompraAlquila?.idRecurso ?? null);
    setImagenListaTuPropiedadUrl(saved.imagenListaTuPropiedad?.url ?? null);
    setImagenListaTuPropiedadIdRecurso(saved.imagenListaTuPropiedad?.idRecurso ?? null);
    setEditingBusqueda(false);
  }, [saved]);
  const cancelFacil = useCallback(() => {
    setInformacionExcelencia(saved.informacionExcelencia);
    setInformacionLogros(saved.informacionLogros);
    setInformacionCalidad(saved.informacionCalidad);
    setInformacionTransparencia(saved.informacionTransparencia);
    setEditingFacil(false);
  }, [saved]);

  const savePrincipal = useCallback(() => {
    saveSection(
      { titulo, imagenPrincipalIdRecurso: imagenPrincipalIdRecurso || null },
      setSavingPrincipal,
      setEditingPrincipal
    );
  }, [titulo, imagenPrincipalIdRecurso, saveSection]);

  const saveRazones = useCallback(() => {
    saveSection(
      {
        tituloSeccionRazones,
        textoSeccionRazones,
        imagenPrincipalRazonesIdRecurso: imagenPrincipalRazonesIdRecurso || null,
        imagenSecundariaRazonesIdRecurso: imagenSecundariaRazonesIdRecurso || null,
      },
      setSavingRazones,
      setEditingRazones
    );
  }, [
    tituloSeccionRazones,
    textoSeccionRazones,
    imagenPrincipalRazonesIdRecurso,
    imagenSecundariaRazonesIdRecurso,
    saveSection,
  ]);

  const saveBusqueda = useCallback(() => {
    saveSection(
      {
        imagenEncuentraTuFuturoIdRecurso: imagenEncuentraTuFuturoIdRecurso || null,
        imagenCompraAlquilaIdRecurso: imagenCompraAlquilaIdRecurso || null,
        imagenListaTuPropiedadIdRecurso: imagenListaTuPropiedadIdRecurso || null,
      },
      setSavingBusqueda,
      setEditingBusqueda
    );
  }, [
    imagenEncuentraTuFuturoIdRecurso,
    imagenCompraAlquilaIdRecurso,
    imagenListaTuPropiedadIdRecurso,
    saveSection,
  ]);

  const saveFacil = useCallback(() => {
    saveSection(
      {
        informacionExcelencia,
        informacionLogros,
        informacionCalidad,
        informacionTransparencia,
      },
      setSavingFacil,
      setEditingFacil
    );
  }, [
    informacionExcelencia,
    informacionLogros,
    informacionCalidad,
    informacionTransparencia,
    saveSection,
  ]);

  const handleImagenPrincipal = useCallback((idRecurso: string, url: string) => {
    setImagenPrincipalIdRecurso(idRecurso);
    setImagenPrincipalUrl(url);
  }, []);
  const handleImagenPrincipalRazones = useCallback((idRecurso: string, url: string) => {
    setImagenPrincipalRazonesIdRecurso(idRecurso);
    setImagenPrincipalRazonesUrl(url);
  }, []);
  const handleImagenSecundariaRazones = useCallback((idRecurso: string, url: string) => {
    setImagenSecundariaRazonesIdRecurso(idRecurso);
    setImagenSecundariaRazonesUrl(url);
  }, []);
  const handleImagenEncuentraTuFuturo = useCallback((idRecurso: string, url: string) => {
    setImagenEncuentraTuFuturoIdRecurso(idRecurso);
    setImagenEncuentraTuFuturoUrl(url);
  }, []);
  const handleImagenCompraAlquila = useCallback((idRecurso: string, url: string) => {
    setImagenCompraAlquilaIdRecurso(idRecurso);
    setImagenCompraAlquilaUrl(url);
  }, []);
  const handleImagenListaTuPropiedad = useCallback((idRecurso: string, url: string) => {
    setImagenListaTuPropiedadIdRecurso(idRecurso);
    setImagenListaTuPropiedadUrl(url);
  }, []);

  const textareaStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #E6E6E6",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical" as const,
  };

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <i className="fa-light fa-spinner fa-spin" style={{ fontSize: "24px", marginRight: "8px" }} />
        Cargando…
      </div>
    );
  }

  return (
    <>
      {/* Sección principal */}
      <AdminSectionCard>
        <SectionHeader
          title="Sección principal"
          subtitle="Título e imagen principal de la página"
          showEditButton
          isEditing={editingPrincipal}
          onEditToggle={() => setEditingPrincipal((p) => !p)}
          onSave={savePrincipal}
          onCancel={cancelPrincipal}
          saving={savingPrincipal}
        />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-12">
              <div className="tp-dashboard-new-property-box">
                <div className="tp-dashboard-new-input">
                  <label>Título</label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título de la página Acerca de nosotros"
                    disabled={!editingPrincipal}
                  />
                </div>
                <div className="tp-dashboard-new-input">
                  <ImageUploader
                    label="Imagen principal"
                    currentImageUrl={imagenPrincipalUrl}
                    onUploadComplete={handleImagenPrincipal}
                    folder="acerca-de-nosotros"
                    textoAlternativo="Imagen principal Acerca de nosotros"
                    width={280}
                    height={160}
                    placeholderIconOnly
                    disabled={!editingPrincipal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminSectionCard>

      {/* Sección razones para utilizar nuestro servicio */}
      <div style={{ marginTop: "24px" }}>
        <AdminSectionCard>
          <SectionHeader
            title="Razones para utilizar nuestro servicio"
            subtitle="Título, texto e imágenes de la sección"
            showEditButton
            isEditing={editingRazones}
            onEditToggle={() => setEditingRazones((p) => !p)}
            onSave={saveRazones}
            onCancel={cancelRazones}
            saving={savingRazones}
          />
          <div className="tp-dashboard-profile-info">
            <div className="row">
              <div className="col-lg-12">
                <div className="tp-dashboard-new-property-box">
                  <div className="tp-dashboard-new-input">
                    <label>Título sección razones</label>
                    <input
                      type="text"
                      value={tituloSeccionRazones}
                      onChange={(e) => setTituloSeccionRazones(e.target.value)}
                      placeholder="Ej: Por qué elegirnos"
                      disabled={!editingRazones}
                    />
                  </div>
                  <div className="tp-dashboard-new-input">
                    <label>Texto sección razones</label>
                    <textarea
                      value={textoSeccionRazones}
                      onChange={(e) => setTextoSeccionRazones(e.target.value)}
                      placeholder="Escribe el contenido de la sección razones..."
                      disabled={!editingRazones}
                      rows={5}
                      style={textareaStyle}
                    />
                  </div>
                  <div className="tp-dashboard-new-input">
                    <ImageUploader
                      label="Imagen principal sección razones"
                      currentImageUrl={imagenPrincipalRazonesUrl}
                      onUploadComplete={handleImagenPrincipalRazones}
                      folder="acerca-de-nosotros"
                      textoAlternativo="Imagen principal sección razones"
                      width={280}
                      height={160}
                      placeholderIconOnly
                      disabled={!editingRazones}
                    />
                  </div>
                  <div className="tp-dashboard-new-input">
                    <ImageUploader
                      label="Imagen secundaria sección razones"
                      currentImageUrl={imagenSecundariaRazonesUrl}
                      onUploadComplete={handleImagenSecundariaRazones}
                      folder="acerca-de-nosotros"
                      textoAlternativo="Imagen secundaria sección razones"
                      width={280}
                      height={160}
                      placeholderIconOnly
                      disabled={!editingRazones}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminSectionCard>
      </div>

      {/* Sección búsqueda */}
      <div style={{ marginTop: "24px" }}>
        <AdminSectionCard>
          <SectionHeader
            title="Sección búsqueda"
            subtitle="Imágenes para Encuentra tu futuro, Compra o alquila y Lista tu propiedad"
            showEditButton
            isEditing={editingBusqueda}
            onEditToggle={() => setEditingBusqueda((p) => !p)}
            onSave={saveBusqueda}
            onCancel={cancelBusqueda}
            saving={savingBusqueda}
          />
          <div className="tp-dashboard-profile-info">
            <div className="row">
              <div className="col-lg-4">
                <div className="tp-dashboard-new-input">
                  <ImageUploader
                    label="Imagen: Encuentra tu futuro"
                    currentImageUrl={imagenEncuentraTuFuturoUrl}
                    onUploadComplete={handleImagenEncuentraTuFuturo}
                    folder="acerca-de-nosotros"
                    textoAlternativo="Encuentra tu futuro"
                    width={200}
                    height={120}
                    placeholderIconOnly
                    disabled={!editingBusqueda}
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="tp-dashboard-new-input">
                  <ImageUploader
                    label="Imagen: Compra o alquila"
                    currentImageUrl={imagenCompraAlquilaUrl}
                    onUploadComplete={handleImagenCompraAlquila}
                    folder="acerca-de-nosotros"
                    textoAlternativo="Compra o alquila"
                    width={200}
                    height={120}
                    placeholderIconOnly
                    disabled={!editingBusqueda}
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="tp-dashboard-new-input">
                  <ImageUploader
                    label="Imagen: Lista tu propiedad"
                    currentImageUrl={imagenListaTuPropiedadUrl}
                    onUploadComplete={handleImagenListaTuPropiedad}
                    folder="acerca-de-nosotros"
                    textoAlternativo="Lista tu propiedad"
                    width={200}
                    height={120}
                    placeholderIconOnly
                    disabled={!editingBusqueda}
                  />
                </div>
              </div>
            </div>
          </div>
        </AdminSectionCard>
      </div>

      {/* Sección cómo hacemos esto fácil para ti */}
      <AdminSectionCard style={{ marginTop: "24px" }}>
        <SectionHeader
          title="Cómo hacemos esto fácil para ti"
          subtitle="Información de excelencia, logros, calidad y transparencia"
          showEditButton
          isEditing={editingFacil}
          onEditToggle={() => setEditingFacil((p) => !p)}
          onSave={saveFacil}
          onCancel={cancelFacil}
          saving={savingFacil}
        />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-12">
              <div className="tp-dashboard-new-property-box">
                <div className="tp-dashboard-new-input">
                  <label>Información excelencia</label>
                  <textarea
                    value={informacionExcelencia}
                    onChange={(e) => setInformacionExcelencia(e.target.value)}
                    placeholder="Texto sobre excelencia..."
                    disabled={!editingFacil}
                    rows={4}
                    style={textareaStyle}
                  />
                </div>
                <div className="tp-dashboard-new-input">
                  <label>Información logros</label>
                  <textarea
                    value={informacionLogros}
                    onChange={(e) => setInformacionLogros(e.target.value)}
                    placeholder="Texto sobre logros..."
                    disabled={!editingFacil}
                    rows={4}
                    style={textareaStyle}
                  />
                </div>
                <div className="tp-dashboard-new-input">
                  <label>Información calidad</label>
                  <textarea
                    value={informacionCalidad}
                    onChange={(e) => setInformacionCalidad(e.target.value)}
                    placeholder="Texto sobre calidad..."
                    disabled={!editingFacil}
                    rows={4}
                    style={textareaStyle}
                  />
                </div>
                <div className="tp-dashboard-new-input">
                  <label>Información transparencia</label>
                  <textarea
                    value={informacionTransparencia}
                    onChange={(e) => setInformacionTransparencia(e.target.value)}
                    placeholder="Texto sobre transparencia..."
                    disabled={!editingFacil}
                    rows={4}
                    style={textareaStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminSectionCard>
    </>
  );
}
