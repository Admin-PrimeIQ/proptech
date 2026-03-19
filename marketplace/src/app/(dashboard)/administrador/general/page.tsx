"use client";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useConfiguracionGeneral } from "@/hooks/useConfiguracionGeneral";
import AdminPageHeader from "@/components/Admin/Layout/AdminPageHeader";
import AdminSectionCard from "@/components/Admin/Layout/AdminSectionCard";
import SectionHeader from "@/components/Admin/Layout/SectionHeader";
import EditableField from "@/components/Admin/Fields/EditableField";
import EditableSocialLinks from "@/components/Admin/Fields/EditableSocialLinks";
import EditableTextarea from "@/components/Admin/Fields/EditableTextarea";
import ImageUploader from "@/components/Admin/Fields/ImageUploader";
import Divider from "@/components/Admin/UI/Divider";
import Button from "@/components/Admin/UI/Button";

interface SocialLinks {
  facebook: string;
  instagram: string;
  whatsapp: string;
  twitter: string;
}

interface ConfiguracionGeneral {
  nombreEmpresa: string;
  esloganEmpresa: string;
  logoPreview?: string | null;
  telefono: string;
  email: string;
  redesSociales: SocialLinks;
  informacionTexto: string;
  tituloSeo?: string;
  descripcionSeo?: string;
}

const DEFAULT_CONFIG: ConfiguracionGeneral = {
  nombreEmpresa: "Nombre de la Compañía",
  esloganEmpresa: "Tu eslogan aquí",
  logoPreview: null,
  telefono: "+624 423 26 72",
  email: "support@bhumi.com",
  redesSociales: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    whatsapp: "+1234567890",
    twitter: "https://twitter.com/",
  },
  informacionTexto: "Información sobre la empresa, servicios y más detalles relevantes para los visitantes del sitio web.",
  tituloSeo: "",
  descripcionSeo: "",
};

// UUID fijo para el logo (equivalente a "1" pero en formato UUID válido)
const LOGO_RECURSO_ID = "00000000-0000-4000-8000-000000000001";

export default function General() {
  const { configuracion, loading, updateConfiguracion } = useConfiguracionGeneral();

  // Estados de edición por sección
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingMultimedia, setIsEditingMultimedia] = useState(false);
  const [isEditingFooter, setIsEditingFooter] = useState(false);
  const [isEditingContacto, setIsEditingContacto] = useState(false);
  const [isEditingRedes, setIsEditingRedes] = useState(false);
  const [isEditingInformacion, setIsEditingInformacion] = useState(false);

  // Valores temporales durante edición
  const [tempNombreEmpresa, setTempNombreEmpresa] = useState(configuracion.nombreEmpresa);
  const [tempEsloganEmpresa, setTempEsloganEmpresa] = useState(configuracion.esloganEmpresa);
  const [logoPreview, setLogoPreview] = useState<string | null>(configuracion.logoPreview || null);
  const [logoRecursoId, setLogoRecursoId] = useState<string | null>(LOGO_RECURSO_ID);
  const [tempTelefono, setTempTelefono] = useState(configuracion.telefono);
  const [tempEmail, setTempEmail] = useState(configuracion.email);
  const [tempRedesSociales, setTempRedesSociales] = useState(
    configuracion.redesSociales || DEFAULT_CONFIG.redesSociales
  );
  const [tempInformacionTexto, setTempInformacionTexto] = useState(
    configuracion.informacionTexto || DEFAULT_CONFIG.informacionTexto
  );
  const [tempTituloSeo, setTempTituloSeo] = useState(configuracion.tituloSeo || "");
  const [tempDescripcionSeo, setTempDescripcionSeo] = useState(configuracion.descripcionSeo || "");

  // Sincronizar valores temporales cuando cambia la configuración
  useEffect(() => {
    setTempNombreEmpresa(configuracion.nombreEmpresa);
    setTempEsloganEmpresa(configuracion.esloganEmpresa);
    setLogoPreview(configuracion.logoPreview || null);
    setTempTelefono(configuracion.telefono);
    setTempEmail(configuracion.email);
    setTempRedesSociales(configuracion.redesSociales || DEFAULT_CONFIG.redesSociales);
    setTempInformacionTexto(configuracion.informacionTexto || DEFAULT_CONFIG.informacionTexto);
    setTempTituloSeo(configuracion.tituloSeo || "");
    setTempDescripcionSeo(configuracion.descripcionSeo || "");
  }, [configuracion]);
  
  // Obtener idLogoRecurso cuando se carga la configuración
  useEffect(() => {
    const fetchLogoRecursoId = async () => {
      try {
        const configResponse = await fetch("/api/configuracion-general").then((res) => res.json());
        if (configResponse && configResponse.idLogoRecurso) {
          setLogoRecursoId(configResponse.idLogoRecurso);
        } else {
          // Si no hay logo, usar el UUID fijo para el logo
          setLogoRecursoId(LOGO_RECURSO_ID);
        }
      } catch (error) {
        console.error("Error fetching logo recurso ID:", error);
        // En caso de error, usar el UUID fijo
        setLogoRecursoId(LOGO_RECURSO_ID);
      }
    };
    fetchLogoRecursoId();
  }, []);

  // Handlers para sección General
  const handleEditGeneral = () => {
    setIsEditingGeneral(true);
  };

  const handleSaveGeneral = async () => {
    try {
      await updateConfiguracion({
        nombreEmpresa: tempNombreEmpresa,
        tituloSeo: tempTituloSeo,
        descripcionSeo: tempDescripcionSeo,
      });
      setIsEditingGeneral(false);
      toast.success("Configuración general guardada correctamente");
    } catch (error) {
      toast.error("Error al guardar la configuración");
    }
  };

  const handleCancelGeneral = () => {
    setTempNombreEmpresa(configuracion.nombreEmpresa);
    setTempTituloSeo(configuracion.tituloSeo || "");
    setTempDescripcionSeo(configuracion.descripcionSeo || "");
    setIsEditingGeneral(false);
  };

  // Handlers para sección Footer
  const handleEditFooter = () => {
    setIsEditingFooter(true);
  };

  const handleSaveFooter = async () => {
    try {
      await updateConfiguracion({
        esloganEmpresa: tempEsloganEmpresa,
      });
      setIsEditingFooter(false);
      toast.success("Eslogan guardado correctamente");
    } catch (error) {
      toast.error("Error al guardar el eslogan");
    }
  };

  const handleCancelFooter = () => {
    setTempEsloganEmpresa(configuracion.esloganEmpresa);
    setIsEditingFooter(false);
  };

  // Handlers para sección Contacto
  const handleEditContacto = () => {
    setIsEditingContacto(true);
  };

  const handleSaveContacto = async () => {
    try {
      await updateConfiguracion({
        telefono: tempTelefono,
        email: tempEmail,
      });
      setIsEditingContacto(false);
      toast.success("Información de contacto guardada correctamente");
    } catch (error) {
      toast.error("Error al guardar la información de contacto");
    }
  };

  const handleCancelContacto = () => {
    setTempTelefono(configuracion.telefono);
    setTempEmail(configuracion.email);
    setIsEditingContacto(false);
  };

  // Handlers para sección Redes Sociales
  const handleEditRedes = () => {
    setIsEditingRedes(true);
  };

  const handleSaveRedes = async () => {
    try {
      await updateConfiguracion({
        redesSociales: tempRedesSociales,
      });
      setIsEditingRedes(false);
      toast.success("Redes sociales guardadas correctamente");
    } catch (error) {
      toast.error("Error al guardar las redes sociales");
    }
  };

  const handleCancelRedes = () => {
    setTempRedesSociales(configuracion.redesSociales || DEFAULT_CONFIG.redesSociales);
    setIsEditingRedes(false);
  };

  // Handlers para sección Información
  const handleEditInformacion = () => {
    setIsEditingInformacion(true);
  };

  const handleSaveInformacion = async () => {
    try {
      await updateConfiguracion({
        informacionTexto: tempInformacionTexto,
      });
      setIsEditingInformacion(false);
      toast.success("Información guardada correctamente");
    } catch (error) {
      toast.error("Error al guardar la información");
    }
  };

  const handleCancelInformacion = () => {
    setTempInformacionTexto(configuracion.informacionTexto || DEFAULT_CONFIG.informacionTexto);
    setIsEditingInformacion(false);
  };

  // Handler para editar logo en Multimedia
  const handleEditMultimedia = () => {
    setIsEditingMultimedia(true);
  };

  // Handler para cuando se completa la subida del logo (actualiza recurso con id "1")
  const handleLogoUploadComplete = async (idRecurso: string, url: string) => {
    setLogoRecursoId(idRecurso);
    setLogoPreview(url);
    // No guardamos inmediatamente, se guardará con el botón Guardar
  };

  // Handler para guardar Multimedia
  const handleSaveMultimedia = async () => {
    try {
      // Usar el UUID fijo para el logo (equivalente a "1")
      const idRecursoFinal = logoRecursoId || LOGO_RECURSO_ID;
      
      // Actualizar idLogoRecurso en la configuración
      const response = await fetch("/api/configuracion-general", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idLogoRecurso: idRecursoFinal }),
      });
      
      if (!response.ok) {
        throw new Error("Error al actualizar el logo en la configuración");
      }
      
      setLogoRecursoId(idRecursoFinal);
      setIsEditingMultimedia(false);
      toast.success("Multimedia guardada correctamente");
      
      // Disparar evento para actualizar otros componentes
      window.dispatchEvent(new Event("configuracionUpdated"));
    } catch (error) {
      console.error("Error saving multimedia:", error);
      toast.error("Error al guardar multimedia");
    }
  };

  // Handler para cancelar Multimedia
  const handleCancelMultimedia = () => {
    // Revertir preview al valor original
    setLogoPreview(configuracion.logoPreview || null);
    setIsEditingMultimedia(false);
  };

  // Verificar si hay cambios pendientes
  const hasChangesGeneral = 
    tempNombreEmpresa !== configuracion.nombreEmpresa ||
    tempTituloSeo !== (configuracion.tituloSeo || "") ||
    tempDescripcionSeo !== (configuracion.descripcionSeo || "");
  const hasChangesMultimedia = logoPreview !== (configuracion.logoPreview || null);
  const hasChangesFooter = tempEsloganEmpresa !== configuracion.esloganEmpresa;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="tp-dashboard-profile-wrapper">
          <AdminPageHeader 
            title="Configuración General"
            subtitle="Gestiona la configuración básica de tu sitio"
          />
          <div className="text-center p-4">Cargando...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout>
        <div className="tp-dashboard-profile-wrapper">
          <AdminPageHeader 
            title="Configuración General"
            subtitle="Gestiona la configuración básica de tu sitio"
          />

          {/* Sección Multimedia */}
          <AdminSectionCard>
            <SectionHeader
              title="Multimedia"
              isEditing={isEditingMultimedia}
              onEditToggle={handleEditMultimedia}
            />
            <div className="tp-dashboard-profile-info">
              <div className="row">
                <div className="col-lg-12">
                  {/* Logo */}
                  <ImageUploader
                    label="Logo"
                    currentImageUrl={logoPreview}
                    onUploadComplete={handleLogoUploadComplete}
                    folder="logos"
                    tipoRecurso="IMAGEN"
                    textoAlternativo="Logo de la empresa"
                    width={150}
                    height={60}
                    disabled={!isEditingMultimedia}
                    recursoId={logoRecursoId || LOGO_RECURSO_ID} // Usar UUID fijo para el logo (equivalente a "1")
                  />

                  {/* Botones de Guardar/Cancelar */}
                  {isEditingMultimedia && (
                    <div className="d-flex align-items-center gap-3 mt-3">
                      <Button
                        onClick={handleSaveMultimedia}
                        disabled={!hasChangesMultimedia}
                      >
                        Guardar
                      </Button>
                      <Button variant="secondary" onClick={handleCancelMultimedia}>
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AdminSectionCard>

          {/* Sección General */}
          <AdminSectionCard>
            <SectionHeader
              title="General"
              isEditing={isEditingGeneral}
              onEditToggle={handleEditGeneral}
            />
            <div className="tp-dashboard-profile-info">
              <div className="row">
                <div className="col-lg-12">
                  {/* Nombre de Compañía */}
                  <EditableField
                    label="Nombre de Compañía"
                    value={tempNombreEmpresa}
                    onChange={setTempNombreEmpresa}
                    isEditing={isEditingGeneral}
                    onEdit={handleEditGeneral}
                    onSave={handleSaveGeneral}
                    onCancel={handleCancelGeneral}
                    placeholder="Ingresa el nombre de la compañía"
                    originalValue={configuracion.nombreEmpresa}
                    showEditButton={false}
                    showSaveButton={false}
                  />

                  {/* Título SEO */}
                  <div style={{ marginTop: "16px" }}>
                    <EditableField
                      label="Título SEO"
                      value={tempTituloSeo}
                      onChange={setTempTituloSeo}
                      isEditing={isEditingGeneral}
                      onEdit={handleEditGeneral}
                      onSave={handleSaveGeneral}
                      onCancel={handleCancelGeneral}
                      placeholder="Ingresa el título SEO para buscadores"
                      originalValue={configuracion.tituloSeo || ""}
                      showEditButton={false}
                      showSaveButton={false}
                    />
                  </div>

                  {/* Descripción SEO */}
                  <div style={{ marginTop: "16px" }}>
                    <EditableTextarea
                      label="Descripción SEO"
                      value={tempDescripcionSeo}
                      onChange={setTempDescripcionSeo}
                      isEditing={isEditingGeneral}
                      onEdit={handleEditGeneral}
                      onSave={handleSaveGeneral}
                      onCancel={handleCancelGeneral}
                      placeholder="Ingresa la descripción SEO para buscadores (máximo 160 caracteres recomendado)"
                      rows={3}
                      disabled={!isEditingGeneral}
                      showEditButton={false}
                      showSaveButton={false}
                      originalValue={configuracion.descripcionSeo || ""}
                    />
                  </div>

                  {/* Botones de Guardar/Cancelar */}
                  {isEditingGeneral && (
                    <div className="d-flex align-items-center gap-3 mt-3">
                      <Button
                        onClick={handleSaveGeneral}
                        disabled={!hasChangesGeneral}
                      >
                        Guardar
                      </Button>
                      <Button variant="secondary" onClick={handleCancelGeneral}>
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AdminSectionCard>

          {/* Sección Footer */}
          <AdminSectionCard>
            <SectionHeader
              title="Footer"
              isEditing={isEditingFooter}
              onEditToggle={handleEditFooter}
            />
            <div className="tp-dashboard-profile-info">
              <div className="row">
                <div className="col-lg-12">
                  <EditableField
                    label="Eslogan"
                    value={tempEsloganEmpresa}
                    onChange={setTempEsloganEmpresa}
                    isEditing={isEditingFooter}
                    onEdit={handleEditFooter}
                    onSave={handleSaveFooter}
                    onCancel={handleCancelFooter}
                    placeholder="Ingresa el eslogan de la empresa"
                    originalValue={configuracion.esloganEmpresa}
                    showEditButton={false}
                  />
                </div>
              </div>
            </div>
          </AdminSectionCard>

          {/* Sección Contacto */}
          <AdminSectionCard>
            <SectionHeader
              title="Contacto"
              isEditing={isEditingContacto}
              onEditToggle={handleEditContacto}
            />
            <div className="tp-dashboard-profile-info">
              <div className="row">
                <div className="col-lg-12">
                  <div style={{ marginBottom: "16px" }}>
                    <EditableField
                      label="Teléfono"
                      value={tempTelefono}
                      onChange={setTempTelefono}
                      isEditing={isEditingContacto}
                      onEdit={handleEditContacto}
                      onSave={handleSaveContacto}
                      onCancel={handleCancelContacto}
                      placeholder="Ej: +624 423 26 72"
                      type="tel"
                      originalValue={configuracion.telefono}
                      showEditButton={false}
                      showSaveButton={false}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <EditableField
                      label="Email"
                      value={tempEmail}
                      onChange={setTempEmail}
                      isEditing={isEditingContacto}
                      onEdit={handleEditContacto}
                      onSave={handleSaveContacto}
                      onCancel={handleCancelContacto}
                      placeholder="Ej: support@empresa.com"
                      type="email"
                      originalValue={configuracion.email}
                      showEditButton={false}
                      showSaveButton={false}
                    />
                  </div>
                  {isEditingContacto && (
                    <div className="d-flex align-items-center gap-3 mt-3">
                      <Button
                        onClick={handleSaveContacto}
                        disabled={
                          tempTelefono === configuracion.telefono &&
                          tempEmail === configuracion.email
                        }
                      >
                        Guardar
                      </Button>
                      <Button variant="secondary" onClick={handleCancelContacto}>
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AdminSectionCard>

          {/* Sección Redes Sociales */}
          <AdminSectionCard>
            <SectionHeader
              title="Redes Sociales"
              isEditing={isEditingRedes}
              onEditToggle={handleEditRedes}
            />
            <div className="tp-dashboard-profile-info">
              <div className="row">
                <div className="col-lg-12">
                  <EditableSocialLinks
                    socialLinks={tempRedesSociales}
                    onChange={setTempRedesSociales}
                    isEditing={isEditingRedes}
                    onEdit={handleEditRedes}
                    onSave={handleSaveRedes}
                    onCancel={handleCancelRedes}
                    originalValue={configuracion.redesSociales || DEFAULT_CONFIG.redesSociales}
                  />
                </div>
              </div>
            </div>
          </AdminSectionCard>

          {/* Sección Información */}
          <AdminSectionCard>
            <SectionHeader
              title="Información"
              isEditing={isEditingInformacion}
              onEditToggle={handleEditInformacion}
            />
            <div className="tp-dashboard-profile-info">
              <div className="row">
                <div className="col-lg-12">
                  <EditableTextarea
                    label="Información de la empresa"
                    value={tempInformacionTexto}
                    onChange={setTempInformacionTexto}
                    isEditing={isEditingInformacion}
                    onEdit={handleEditInformacion}
                    onSave={handleSaveInformacion}
                    onCancel={handleCancelInformacion}
                    placeholder="Escribe la información sobre tu empresa, servicios y detalles relevantes..."
                    rows={6}
                    disabled={!isEditingInformacion}
                    showEditButton={false}
                    originalValue={configuracion.informacionTexto || DEFAULT_CONFIG.informacionTexto}
                  />
                </div>
              </div>
            </div>
          </AdminSectionCard>
        </div>
      </DashboardLayout>
    </>
  );
}
