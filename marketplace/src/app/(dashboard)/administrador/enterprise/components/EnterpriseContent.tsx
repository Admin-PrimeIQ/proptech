"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ImageUploader from "@/components/Admin/Fields/ImageUploader";
import AdminSectionCard from "@/components/Admin/Layout/AdminSectionCard";
import SectionHeader from "@/components/Admin/Layout/SectionHeader";
import styles from "./EnterpriseContent.module.scss";

type RecursoImagen = { idPublic: string; url: string } | null;

type SolucionEnterprise = {
  idPublic: string;
  tituloHero: string;
  tituloSeccionInformacion: string | null;
  contextoSeccionInformacion: string | null;
  imagen: RecursoImagen;
};

type ServicioEnterprise = {
  idPublic: string;
  tituloServicio: string;
  descripcion: string;
  orden: number;
  activo: boolean;
  imagen: RecursoImagen;
};

type PlanEnterprise = {
  idPublic: string;
  titulo: string;
  montoQuetzales: string;
  montoDolares: string;
  orden: number;
  activo: boolean;
};

type BeneficioEnterprise = {
  idPublic: string;
  idPlanPublic: string;
  planTitulo: string;
  tituloVentaja: string;
  orden: number;
  activo: boolean;
};

export default function EnterpriseContent() {
  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [isEditingHeroSection, setIsEditingHeroSection] = useState(false);

  const [hero, setHero] = useState<SolucionEnterprise | null>(null);
  const [heroTitulo, setHeroTitulo] = useState("");
  const [heroTituloInfo, setHeroTituloInfo] = useState("");
  const [heroContextoInfo, setHeroContextoInfo] = useState("");
  const [heroImagenIdRecurso, setHeroImagenIdRecurso] = useState<string | null>(null);
  const [heroImagenUrl, setHeroImagenUrl] = useState<string | null>(null);

  const [servicios, setServicios] = useState<ServicioEnterprise[]>([]);
  const [servicioEditId, setServicioEditId] = useState<string | null>(null);
  const [servicioTitulo, setServicioTitulo] = useState("");
  const [servicioDescripcion, setServicioDescripcion] = useState("");
  const [servicioOrden, setServicioOrden] = useState(0);
  const [servicioActivo, setServicioActivo] = useState(true);
  const [servicioImagenIdRecurso, setServicioImagenIdRecurso] = useState<string | null>(null);
  const [servicioImagenUrl, setServicioImagenUrl] = useState<string | null>(null);
  const [savingServicio, setSavingServicio] = useState(false);
  const [isEditingServiciosSection, setIsEditingServiciosSection] = useState(false);

  const [planes, setPlanes] = useState<PlanEnterprise[]>([]);
  const [planEditId, setPlanEditId] = useState<string | null>(null);
  const [planTitulo, setPlanTitulo] = useState("");
  const [planMontoQ, setPlanMontoQ] = useState("");
  const [planMontoD, setPlanMontoD] = useState("");
  const [planOrden, setPlanOrden] = useState(0);
  const [planActivo, setPlanActivo] = useState(true);
  const [savingPlan, setSavingPlan] = useState(false);
  const [isEditingPlanesSection, setIsEditingPlanesSection] = useState(false);

  const [beneficios, setBeneficios] = useState<BeneficioEnterprise[]>([]);
  const [beneficioEditId, setBeneficioEditId] = useState<string | null>(null);
  const [beneficioPlanPublic, setBeneficioPlanPublic] = useState("");
  const [beneficioTitulo, setBeneficioTitulo] = useState("");
  const [beneficioOrden, setBeneficioOrden] = useState(0);
  const [beneficioActivo, setBeneficioActivo] = useState(true);
  const [savingBeneficio, setSavingBeneficio] = useState(false);
  const [isEditingBeneficiosSection, setIsEditingBeneficiosSection] = useState(false);

  const planOptions = useMemo(
    () => planes.map((p) => ({ value: p.idPublic, label: p.titulo })),
    [planes]
  );
  const HERO_MIN_WIDTH = 1300;
  const HERO_MIN_HEIGHT = 500;

  const getImageDimensions = (url: string) =>
    new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => reject(new Error("No se pudo leer la imagen"));
      image.src = url;
    });

  const resetServicioForm = () => {
    setServicioEditId(null);
    setServicioTitulo("");
    setServicioDescripcion("");
    setServicioOrden(0);
    setServicioActivo(true);
    setServicioImagenIdRecurso(null);
    setServicioImagenUrl(null);
  };

  const resetPlanForm = () => {
    setPlanEditId(null);
    setPlanTitulo("");
    setPlanMontoQ("");
    setPlanMontoD("");
    setPlanOrden(0);
    setPlanActivo(true);
  };

  const resetBeneficioForm = () => {
    setBeneficioEditId(null);
    setBeneficioPlanPublic("");
    setBeneficioTitulo("");
    setBeneficioOrden(0);
    setBeneficioActivo(true);
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      const [heroRes, serviciosRes, planesRes, beneficiosRes] = await Promise.all([
        fetch("/api/soluciones-empresariales"),
        fetch("/api/servicios-empresariales"),
        fetch("/api/planes"),
        fetch("/api/beneficios-plan"),
      ]);

      const heroData = heroRes.ok ? await heroRes.json() : [];
      const serviciosData = serviciosRes.ok ? await serviciosRes.json() : [];
      const planesData = planesRes.ok ? await planesRes.json() : [];
      const beneficiosData = beneficiosRes.ok ? await beneficiosRes.json() : [];

      const heroList: SolucionEnterprise[] = Array.isArray(heroData) ? heroData : heroData?.data ?? [];
      const heroItem = heroList[0] ?? null;
      setHero(heroItem);
      setHeroTitulo(heroItem?.tituloHero ?? "");
      setHeroTituloInfo(heroItem?.tituloSeccionInformacion ?? "");
      setHeroContextoInfo(heroItem?.contextoSeccionInformacion ?? "");
      setHeroImagenIdRecurso(heroItem?.imagen?.idPublic ?? null);
      setHeroImagenUrl(heroItem?.imagen?.url ?? null);

      const serviciosList: ServicioEnterprise[] = Array.isArray(serviciosData)
        ? serviciosData
        : serviciosData?.data ?? [];
      setServicios(serviciosList);

      const planesList: PlanEnterprise[] = Array.isArray(planesData) ? planesData : planesData?.data ?? [];
      setPlanes(planesList);

      const beneficiosList: BeneficioEnterprise[] = Array.isArray(beneficiosData)
        ? beneficiosData
        : beneficiosData?.data ?? [];
      setBeneficios(beneficiosList);
    } catch {
      toast.error("No se pudo cargar la informacion de Enterprise");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSaveHero = async () => {
    if (!heroTitulo.trim()) {
      toast.error("El titulo hero es requerido");
      return;
    }
    if (!heroImagenIdRecurso) {
      toast.error("Debes subir la imagen de hero");
      return;
    }
    if (heroImagenUrl) {
      try {
        const { width, height } = await getImageDimensions(heroImagenUrl);
        if (width < HERO_MIN_WIDTH || height < HERO_MIN_HEIGHT) {
          toast.error(
            `La imagen hero debe ser mayor o igual a ${HERO_MIN_WIDTH}x${HERO_MIN_HEIGHT}px. Imagen actual: ${width}x${height}px.`
          );
          return;
        }
      } catch {
        toast.error("No se pudo validar el tamaño de la imagen hero");
        return;
      }
    }

    setSavingHero(true);
    try {
      const payload = {
        idPublic: hero?.idPublic,
        tituloHero: heroTitulo.trim(),
        tituloSeccionInformacion: heroTituloInfo.trim() || null,
        contextoSeccionInformacion: heroContextoInfo.trim() || null,
        imagenIdRecurso: heroImagenIdRecurso,
      };

      const method = hero?.idPublic ? "PUT" : "POST";
      const response = await fetch("/api/soluciones-empresariales", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Error al guardar configuracion hero");
      }

      toast.success("Configuracion hero guardada");
      await loadAll();
      setIsEditingHeroSection(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar configuracion hero");
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveServicio = async () => {
    if (!servicioTitulo.trim()) {
      toast.error("El titulo del servicio es requerido");
      return;
    }
    if (!servicioDescripcion.trim()) {
      toast.error("La descripcion del servicio es requerida");
      return;
    }
    if (!servicioImagenIdRecurso) {
      toast.error("Debes subir imagen del servicio");
      return;
    }

    setSavingServicio(true);
    try {
      const payload = {
        idPublic: servicioEditId,
        tituloServicio: servicioTitulo.trim(),
        descripcion: servicioDescripcion.trim(),
        orden: servicioOrden,
        activo: servicioActivo,
        imagenIdRecurso: servicioImagenIdRecurso,
      };

      const response = await fetch("/api/servicios-empresariales", {
        method: servicioEditId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Error al guardar servicio");
      }

      toast.success(servicioEditId ? "Servicio actualizado" : "Servicio creado");
      resetServicioForm();
      await loadAll();
      setIsEditingServiciosSection(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar servicio");
    } finally {
      setSavingServicio(false);
    }
  };

  const handleEditServicio = (item: ServicioEnterprise) => {
    setIsEditingServiciosSection(true);
    setServicioEditId(item.idPublic);
    setServicioTitulo(item.tituloServicio);
    setServicioDescripcion(item.descripcion);
    setServicioOrden(item.orden);
    setServicioActivo(item.activo);
    setServicioImagenIdRecurso(item.imagen?.idPublic ?? null);
    setServicioImagenUrl(item.imagen?.url ?? null);
  };

  const handleDeleteServicio = async (idPublic: string) => {
    if (!confirm("Eliminar este servicio?")) return;
    try {
      const response = await fetch(`/api/servicios-empresariales?idPublic=${encodeURIComponent(idPublic)}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("No se pudo eliminar");
      toast.success("Servicio eliminado");
      await loadAll();
      if (servicioEditId === idPublic) resetServicioForm();
    } catch {
      toast.error("No se pudo eliminar el servicio");
    }
  };

  const handleSavePlan = async () => {
    if (!planTitulo.trim()) {
      toast.error("El titulo del plan es requerido");
      return;
    }
    if (!planMontoQ || !planMontoD) {
      toast.error("Los montos en quetzales y dolares son requeridos");
      return;
    }

    setSavingPlan(true);
    try {
      const payload = {
        idPublic: planEditId,
        titulo: planTitulo.trim(),
        montoQuetzales: planMontoQ,
        montoDolares: planMontoD,
        orden: planOrden,
        activo: planActivo,
      };

      const response = await fetch("/api/planes", {
        method: planEditId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Error al guardar plan");
      }

      toast.success(planEditId ? "Plan actualizado" : "Plan creado");
      resetPlanForm();
      await loadAll();
      setIsEditingPlanesSection(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar plan");
    } finally {
      setSavingPlan(false);
    }
  };

  const handleEditPlan = (item: PlanEnterprise) => {
    setIsEditingPlanesSection(true);
    setPlanEditId(item.idPublic);
    setPlanTitulo(item.titulo);
    setPlanMontoQ(item.montoQuetzales);
    setPlanMontoD(item.montoDolares);
    setPlanOrden(item.orden);
    setPlanActivo(item.activo);
  };

  const handleDeletePlan = async (idPublic: string) => {
    if (!confirm("Eliminar este plan?")) return;
    try {
      const response = await fetch(`/api/planes?idPublic=${encodeURIComponent(idPublic)}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("No se pudo eliminar");
      toast.success("Plan eliminado");
      await loadAll();
      if (planEditId === idPublic) resetPlanForm();
    } catch {
      toast.error("No se pudo eliminar el plan");
    }
  };

  const handleSaveBeneficio = async () => {
    if (!beneficioPlanPublic) {
      toast.error("Selecciona un plan");
      return;
    }
    if (!beneficioTitulo.trim()) {
      toast.error("El titulo del beneficio es requerido");
      return;
    }

    setSavingBeneficio(true);
    try {
      const payload = {
        idPublic: beneficioEditId,
        idPlanPublic: beneficioPlanPublic,
        tituloVentaja: beneficioTitulo.trim(),
        orden: beneficioOrden,
        activo: beneficioActivo,
      };

      const response = await fetch("/api/beneficios-plan", {
        method: beneficioEditId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Error al guardar beneficio");
      }

      toast.success(beneficioEditId ? "Beneficio actualizado" : "Beneficio creado");
      resetBeneficioForm();
      await loadAll();
      setIsEditingBeneficiosSection(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar beneficio");
    } finally {
      setSavingBeneficio(false);
    }
  };

  const handleEditBeneficio = (item: BeneficioEnterprise) => {
    setIsEditingBeneficiosSection(true);
    setBeneficioEditId(item.idPublic);
    setBeneficioPlanPublic(item.idPlanPublic);
    setBeneficioTitulo(item.tituloVentaja);
    setBeneficioOrden(item.orden);
    setBeneficioActivo(item.activo);
  };

  const handleDeleteBeneficio = async (idPublic: string) => {
    if (!confirm("Eliminar este beneficio?")) return;
    try {
      const response = await fetch(`/api/beneficios-plan?idPublic=${encodeURIComponent(idPublic)}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("No se pudo eliminar");
      toast.success("Beneficio eliminado");
      await loadAll();
      if (beneficioEditId === idPublic) resetBeneficioForm();
    } catch {
      toast.error("No se pudo eliminar el beneficio");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <i className="fa-light fa-spinner fa-spin" style={{ fontSize: "24px", marginRight: "8px" }} />
        Cargando configuracion de enterprise...
      </div>
    );
  }

  return (
    <div className={styles.enterpriseForm}>
      <AdminSectionCard>
        <SectionHeader
          title="Hero e informacion"
          subtitle="Configura imagen principal, titulo hero y contenido de informacion"
          showEditButton
          isEditing={isEditingHeroSection}
          onEditToggle={() => setIsEditingHeroSection(true)}
        />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-6">
              <div className="tp-dashboard-new-input">
                <ImageUploader
                  label="Imagen hero"
                  currentImageUrl={heroImagenUrl}
                  onUploadComplete={async (idRecurso, url) => {
                    try {
                      const { width, height } = await getImageDimensions(url);
                      if (width < HERO_MIN_WIDTH || height < HERO_MIN_HEIGHT) {
                        toast.error(
                          `La imagen hero debe ser mayor o igual a ${HERO_MIN_WIDTH}x${HERO_MIN_HEIGHT}px. Imagen actual: ${width}x${height}px.`
                        );
                        setHeroImagenIdRecurso(null);
                        setHeroImagenUrl(null);
                        return;
                      }
                      setHeroImagenIdRecurso(idRecurso);
                      setHeroImagenUrl(url);
                    } catch {
                      toast.error("No se pudo validar el tamaño de la imagen hero");
                      setHeroImagenIdRecurso(null);
                      setHeroImagenUrl(null);
                    }
                  }}
                  folder="enterprise"
                  textoAlternativo="Imagen hero enterprise"
                  width={280}
                  height={160}
                  placeholderIconOnly
                  disabled={!isEditingHeroSection}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="tp-dashboard-new-property-box">
                <div className="tp-dashboard-new-input">
                  <label>Titulo hero*</label>
                  <input
                    value={heroTitulo}
                    onChange={(e) => setHeroTitulo(e.target.value)}
                    placeholder="Ej: Enterprise"
                    disabled={!isEditingHeroSection}
                  />
                </div>
                <div className="tp-dashboard-new-input">
                  <label>Titulo seccion informacion</label>
                  <input
                    value={heroTituloInfo}
                    onChange={(e) => setHeroTituloInfo(e.target.value)}
                    placeholder="Ej: Impulsa tu negocio inmobiliario"
                    disabled={!isEditingHeroSection}
                  />
                </div>
                <div className="tp-dashboard-new-input">
                  <label>Contexto seccion informacion</label>
                  <textarea
                    rows={4}
                    value={heroContextoInfo}
                    onChange={(e) => setHeroContextoInfo(e.target.value)}
                    placeholder="Escribe una descripcion breve de la propuesta de valor enterprise..."
                    disabled={!isEditingHeroSection}
                  />
                </div>
                <div className={styles.sectionActions}>
                  <button
                    type="button"
                    className="tp-btn"
                    onClick={handleSaveHero}
                    disabled={savingHero || !isEditingHeroSection}
                  >
                    {savingHero ? "Guardando..." : "Guardar hero"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard className="mt-4">
        <SectionHeader
          title="Servicios empresariales"
          subtitle="Crea, edita y elimina servicios con su imagen, orden y estado"
          showEditButton
          isEditing={isEditingServiciosSection}
          onEditToggle={() => setIsEditingServiciosSection(true)}
        />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-7">
              <div className="tp-dashboard-new-property-box">
                <div className="tp-dashboard-new-input">
                  <label>Titulo servicio*</label>
                  <input
                    value={servicioTitulo}
                    onChange={(e) => setServicioTitulo(e.target.value)}
                    placeholder="Ej: Gestion comercial para desarrolladores"
                    disabled={!isEditingServiciosSection}
                  />
                </div>
                <div className="tp-dashboard-new-input">
                  <label>Descripcion*</label>
                  <textarea
                    rows={4}
                    value={servicioDescripcion}
                    onChange={(e) => setServicioDescripcion(e.target.value)}
                    placeholder="Describe el servicio empresarial..."
                    disabled={!isEditingServiciosSection}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="tp-dashboard-new-input">
                      <label>Orden</label>
                      <input
                        type="number"
                        value={servicioOrden}
                        onChange={(e) => setServicioOrden(Number(e.target.value || 0))}
                        placeholder="Ej: 1"
                        disabled={!isEditingServiciosSection}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="tp-dashboard-new-input">
                      <label>
                        <input
                          type="checkbox"
                          checked={servicioActivo}
                          onChange={(e) => setServicioActivo(e.target.checked)}
                          style={{ marginRight: 8 }}
                          disabled={!isEditingServiciosSection}
                        />
                        Activo
                      </label>
                    </div>
                  </div>
                </div>
                <div className={`d-flex gap-2 ${styles.sectionActions}`}>
                  <button
                    type="button"
                    className="tp-btn"
                    onClick={handleSaveServicio}
                    disabled={savingServicio || !isEditingServiciosSection}
                  >
                    {savingServicio ? "Guardando..." : servicioEditId ? "Actualizar servicio" : "Crear servicio"}
                  </button>
                  {servicioEditId && (
                    <button
                      type="button"
                      className="tp-btn btn-2"
                      onClick={resetServicioForm}
                      disabled={!isEditingServiciosSection}
                    >
                      Cancelar edicion
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="tp-dashboard-new-input">
                <ImageUploader
                  label="Imagen servicio"
                  currentImageUrl={servicioImagenUrl}
                  onUploadComplete={(idRecurso, url) => {
                    setServicioImagenIdRecurso(idRecurso);
                    setServicioImagenUrl(url);
                  }}
                  folder="enterprise"
                  textoAlternativo="Imagen servicio enterprise"
                  width={250}
                  height={150}
                  placeholderIconOnly
                  disabled={!isEditingServiciosSection}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            {servicios.length === 0 ? (
              <p className="mb-0 text-muted">No hay servicios registrados todavia.</p>
            ) : (
              servicios.map((item) => (
                <div
                  key={item.idPublic}
                  className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded"
                >
                  <div>
                    <strong>{item.tituloServicio}</strong> - orden {item.orden} {item.activo ? "(Activo)" : "(Inactivo)"}
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="tp-btn btn-2" onClick={() => handleEditServicio(item)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className={`tp-btn btn-2 ${styles.dangerButton}`}
                      onClick={() => handleDeleteServicio(item.idPublic)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard className="mt-4">
        <SectionHeader
          title="Planes de precios"
          subtitle="Administra montos, orden y estado de cada plan"
          showEditButton
          isEditing={isEditingPlanesSection}
          onEditToggle={() => setIsEditingPlanesSection(true)}
        />
        <div className="tp-dashboard-profile-info">
          <div className="tp-dashboard-new-property-box">
            <div className="tp-dashboard-new-input">
              <label>Titulo del plan*</label>
              <input
                value={planTitulo}
                onChange={(e) => setPlanTitulo(e.target.value)}
                placeholder="Ej: Plan corporativo"
                disabled={!isEditingPlanesSection}
              />
            </div>

            <div className="row">
              <div className="col-lg-4">
                <div className="tp-dashboard-new-input">
                  <label>Monto en quetzales*</label>
                  <input
                    value={planMontoQ}
                    onChange={(e) => setPlanMontoQ(e.target.value)}
                    placeholder="Ej: 1500.00"
                    disabled={!isEditingPlanesSection}
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="tp-dashboard-new-input">
                  <label>Monto en dolares*</label>
                  <input
                    value={planMontoD}
                    onChange={(e) => setPlanMontoD(e.target.value)}
                    placeholder="Ej: 199.00"
                    disabled={!isEditingPlanesSection}
                  />
                </div>
              </div>
              <div className="col-lg-2">
                <div className="tp-dashboard-new-input">
                  <label>Orden</label>
                  <input
                    type="number"
                    value={planOrden}
                    onChange={(e) => setPlanOrden(Number(e.target.value || 0))}
                    placeholder="Ej: 1"
                    disabled={!isEditingPlanesSection}
                  />
                </div>
              </div>
              <div className="col-lg-2">
                <div className="tp-dashboard-new-input">
                  <label>
                    <input
                      type="checkbox"
                      checked={planActivo}
                      onChange={(e) => setPlanActivo(e.target.checked)}
                      style={{ marginRight: 8 }}
                      disabled={!isEditingPlanesSection}
                    />
                    Activo
                  </label>
                </div>
              </div>
            </div>

            <div className={`d-flex gap-2 ${styles.sectionActions}`}>
              <button
                type="button"
                className="tp-btn"
                onClick={handleSavePlan}
                disabled={savingPlan || !isEditingPlanesSection}
              >
                {savingPlan ? "Guardando..." : planEditId ? "Actualizar plan" : "Crear plan"}
              </button>
              {planEditId && (
                <button
                  type="button"
                  className="tp-btn btn-2"
                  onClick={resetPlanForm}
                  disabled={!isEditingPlanesSection}
                >
                  Cancelar edicion
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            {planes.length === 0 ? (
              <p className="mb-0 text-muted">No hay planes registrados todavia.</p>
            ) : (
              planes.map((item) => (
                <div
                  key={item.idPublic}
                  className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded"
                >
                  <div>
                    <strong>{item.titulo}</strong> - Q {item.montoQuetzales} - $ {item.montoDolares} - orden {item.orden}{" "}
                    {item.activo ? "(Activo)" : "(Inactivo)"}
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="tp-btn btn-2" onClick={() => handleEditPlan(item)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className={`tp-btn btn-2 ${styles.dangerButton}`}
                      onClick={() => handleDeletePlan(item.idPublic)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard className="mt-4">
        <SectionHeader
          title="Beneficios del plan"
          subtitle="Relaciona beneficios a un plan y define su orden de despliegue"
          showEditButton
          isEditing={isEditingBeneficiosSection}
          onEditToggle={() => setIsEditingBeneficiosSection(true)}
        />
        <div className="tp-dashboard-profile-info">
          <div className="tp-dashboard-new-property-box">
            <div className="row">
              <div className="col-lg-4">
                <div className="tp-dashboard-new-input">
                  <label>Plan*</label>
                  <select
                    value={beneficioPlanPublic}
                    onChange={(e) => setBeneficioPlanPublic(e.target.value)}
                    disabled={!isEditingBeneficiosSection}
                  >
                    <option value="">Selecciona un plan</option>
                    {planOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="tp-dashboard-new-input">
                  <label>Titulo de beneficio*</label>
                  <input
                    value={beneficioTitulo}
                    onChange={(e) => setBeneficioTitulo(e.target.value)}
                    placeholder="Ej: Publicacion prioritaria"
                    disabled={!isEditingBeneficiosSection}
                  />
                </div>
              </div>
              <div className="col-lg-2">
                <div className="tp-dashboard-new-input">
                  <label>Orden</label>
                  <input
                    type="number"
                    value={beneficioOrden}
                    onChange={(e) => setBeneficioOrden(Number(e.target.value || 0))}
                    placeholder="Ej: 1"
                    disabled={!isEditingBeneficiosSection}
                  />
                </div>
              </div>
            </div>

            <div className="tp-dashboard-new-input">
              <label>
                <input
                  type="checkbox"
                  checked={beneficioActivo}
                  onChange={(e) => setBeneficioActivo(e.target.checked)}
                  style={{ marginRight: 8 }}
                  disabled={!isEditingBeneficiosSection}
                />
                Activo
              </label>
            </div>

            <div className={`d-flex gap-2 ${styles.sectionActions}`}>
              <button
                type="button"
                className="tp-btn"
                onClick={handleSaveBeneficio}
                disabled={savingBeneficio || !isEditingBeneficiosSection}
              >
                {savingBeneficio ? "Guardando..." : beneficioEditId ? "Actualizar beneficio" : "Crear beneficio"}
              </button>
              {beneficioEditId && (
                <button
                  type="button"
                  className="tp-btn btn-2"
                  onClick={resetBeneficioForm}
                  disabled={!isEditingBeneficiosSection}
                >
                  Cancelar edicion
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            {beneficios.length === 0 ? (
              <p className="mb-0 text-muted">No hay beneficios registrados todavia.</p>
            ) : (
              beneficios.map((item) => (
                <div
                  key={item.idPublic}
                  className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded"
                >
                  <div>
                    <strong>{item.tituloVentaja}</strong> - {item.planTitulo} - orden {item.orden}{" "}
                    {item.activo ? "(Activo)" : "(Inactivo)"}
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="tp-btn btn-2" onClick={() => handleEditBeneficio(item)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className={`tp-btn btn-2 ${styles.dangerButton}`}
                      onClick={() => handleDeleteBeneficio(item.idPublic)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </AdminSectionCard>
    </div>
  );
}
