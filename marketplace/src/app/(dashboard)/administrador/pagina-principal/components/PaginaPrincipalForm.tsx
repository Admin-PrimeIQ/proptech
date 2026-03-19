"use client";

import { useState, useEffect, useCallback } from "react";
import AdminSectionCard from "@/components/Admin/Layout/AdminSectionCard";
import SectionHeader from "@/components/Admin/Layout/SectionHeader";
import ImageUploader from "@/components/Admin/Fields/ImageUploader";
import { toast } from "sonner";
import InformacionPaginaItemsSection from "./InformacionPaginaItemsSection";

type HomeConfigRes = {
  tituloHero?: string | null;
  subtituloHero?: string | null;
  textoBotonHero?: string | null;
  imagenHero?: { idPublic: string; url: string } | null;
};

function parseConfig(res: HomeConfigRes) {
  const img = res.imagenHero;
  return {
    titulo: res.tituloHero ?? "",
    subtitulo: res.subtituloHero ?? "",
    textoBoton: res.textoBotonHero ?? "",
    imagenIdRecurso: img ? img.idPublic : null,
    imagenUrl: img ? img.url : null,
  };
}

export default function PaginaPrincipalForm() {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [textoBoton, setTextoBoton] = useState("");
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [imagenIdRecurso, setImagenIdRecurso] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estados para la sección "Información página"

  // Estados para la sección "Multimedia"
  const [multimediaImagenUrl, setMultimediaImagenUrl] = useState<string | null>(null);
  const [multimediaImagenIdRecurso, setMultimediaImagenIdRecurso] = useState<string | null>(null);
  const [isEditingMultimedia, setIsEditingMultimedia] = useState(false);
  const [savingMultimedia, setSavingMultimedia] = useState(false);
  const [loadingMultimedia, setLoadingMultimedia] = useState(true);

  // Estados para Departamentos Destacados
  const [departamentosDestacados, setDepartamentosDestacados] = useState<any[]>([]);
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(true);
  const [isEditingDepartamento, setIsEditingDepartamento] = useState(false);
  const [editingDepartamentoId, setEditingDepartamentoId] = useState<string | null>(null);
  const [departamentoNombre, setDepartamentoNombre] = useState("");
  const [departamentoImagenIdRecurso, setDepartamentoImagenIdRecurso] = useState<string | null>(null);
  const [departamentoImagenUrl, setDepartamentoImagenUrl] = useState<string | null>(null);
  const [departamentoOrden, setDepartamentoOrden] = useState(0);
  const [departamentoActivo, setDepartamentoActivo] = useState(true);
  const [departamentoIdPublic, setDepartamentoIdPublic] = useState<string | null>(null);
  const [departamentosOptions, setDepartamentosOptions] = useState<{ value: string; label: string }[]>([]);
  const [savingDepartamento, setSavingDepartamento] = useState(false);

  // Estados para Comentarios Personas
  const [comentariosPersonas, setComentariosPersonas] = useState<any[]>([]);
  const [loadingComentarios, setLoadingComentarios] = useState(true);
  const [isEditingComentario, setIsEditingComentario] = useState(false);
  const [editingComentarioId, setEditingComentarioId] = useState<string | null>(null);
  const [comentarioNombre, setComentarioNombre] = useState("");
  const [comentarioPuesto, setComentarioPuesto] = useState("");
  const [comentarioTexto, setComentarioTexto] = useState("");
  const [comentarioImagenIdRecurso, setComentarioImagenIdRecurso] = useState<string | null>(null);
  const [comentarioImagenUrl, setComentarioImagenUrl] = useState<string | null>(null);
  const [savingComentario, setSavingComentario] = useState(false);

  // Estados para Palabras Clave
  const [palabrasClave, setPalabrasClave] = useState<any[]>([]);
  const [loadingPalabras, setLoadingPalabras] = useState(true);
  const [isEditingPalabra, setIsEditingPalabra] = useState(false);
  const [editingPalabraId, setEditingPalabraId] = useState<string | null>(null);
  const [palabraTexto, setPalabraTexto] = useState("");
  const [savingPalabra, setSavingPalabra] = useState(false);

  // Estados para Administradores Públicos
  const [administradoresPublicos, setAdministradoresPublicos] = useState<any[]>([]);
  const [loadingAdministradores, setLoadingAdministradores] = useState(true);
  const [isEditingAdministrador, setIsEditingAdministrador] = useState(false);
  const [editingAdministradorId, setEditingAdministradorId] = useState<string | null>(null);
  const [administradorNombre, setAdministradorNombre] = useState("");
  const [administradorPuesto, setAdministradorPuesto] = useState("");
  const [administradorImagenIdRecurso, setAdministradorImagenIdRecurso] = useState<string | null>(null);
  const [administradorImagenUrl, setAdministradorImagenUrl] = useState<string | null>(null);
  const [administradorOrden, setAdministradorOrden] = useState(0);
  const [administradorActivo, setAdministradorActivo] = useState(true);
  const [savingAdministrador, setSavingAdministrador] = useState(false);

  // Estados para Logos Asociados
  const [logosAsociados, setLogosAsociados] = useState<any[]>([]);
  const [loadingLogos, setLoadingLogos] = useState(true);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [editingLogoId, setEditingLogoId] = useState<string | null>(null);
  const [logoNombre, setLogoNombre] = useState("");
  const [logoImagenIdRecurso, setLogoImagenIdRecurso] = useState<string | null>(null);
  const [logoImagenUrl, setLogoImagenUrl] = useState<string | null>(null);
  const [logoOrden, setLogoOrden] = useState(0);
  const [logoActivo, setLogoActivo] = useState(true);
  const [savingLogo, setSavingLogo] = useState(false);

  // Todos los useCallback deben estar antes del useEffect
  const handleImageUpload = useCallback((idRecurso: string, url: string) => {
    setImagenIdRecurso(idRecurso);
    setImagenUrl(url);
  }, []);

  const handleMultimediaUpload = useCallback((idRecurso: string, url: string) => {
    setMultimediaImagenIdRecurso(idRecurso);
    setMultimediaImagenUrl(url);
  }, []);

  // Callbacks para Departamentos Destacados
  const handleDepartamentoImagenUpload = useCallback((idRecurso: string, url: string) => {
    setDepartamentoImagenIdRecurso(idRecurso);
    setDepartamentoImagenUrl(url);
  }, []);

  // Callbacks para Comentarios Personas
  const handleComentarioImagenUpload = useCallback((idRecurso: string, url: string) => {
    setComentarioImagenIdRecurso(idRecurso);
    setComentarioImagenUrl(url);
  }, []);

  // Callbacks para Administradores Públicos
  const handleAdministradorImagenUpload = useCallback((idRecurso: string, url: string) => {
    setAdministradorImagenIdRecurso(idRecurso);
    setAdministradorImagenUrl(url);
  }, []);

  // Callbacks para Logos Asociados
  const handleLogoImagenUpload = useCallback((idRecurso: string, url: string) => {
    setLogoImagenIdRecurso(idRecurso);
    setLogoImagenUrl(url);
  }, []);

  const fetchConfig = useCallback(() => {
    return fetch("/api/home-configuracion")
      .then((r) => r.json())
      .then((res: HomeConfigRes) => parseConfig(res));
  }, []);

  const handleEditToggle = useCallback(() => setIsEditing(true), []);

  const handleCancel = useCallback(() => {
    fetchConfig().then((data) => {
      setTitulo(data.titulo);
      setSubtitulo(data.subtitulo);
      setTextoBoton(data.textoBoton);
      setImagenIdRecurso(data.imagenIdRecurso);
      setImagenUrl(data.imagenUrl);
      setIsEditing(false);
    });
  }, [fetchConfig]);

  const handleEditToggleMultimedia = useCallback(() => setIsEditingMultimedia(true), []);

  const handleCancelMultimedia = useCallback(() => {
    fetch("/api/caracteristicas-pagina-principal/multimedia")
      .then((r) => r.json())
      .then((res) => {
        if (res?.error) throw new Error(res.error);
        const data = res?.data ?? res;
        setMultimediaImagenIdRecurso(data?.imagen?.idPublic ?? null);
        setMultimediaImagenUrl(data?.imagen?.url ?? null);
      })
      .finally(() => setIsEditingMultimedia(false));
  }, []);

  const fetchMultimedia = useCallback(() => {
    return fetch("/api/caracteristicas-pagina-principal/multimedia")
      .then((r) => r.json())
      .then((res) => {
        if (res?.error) throw new Error(res.error);
        const data = res?.data ?? res;
        return {
          imagenIdRecurso: data?.imagen?.idPublic ?? null,
          imagenUrl: data?.imagen?.url ?? null,
        };
      });
  }, []);

  // Funciones para Departamentos Destacados
  const fetchDepartamentosDestacados = useCallback(() => {
    return fetch("/api/departamentos-destacados")
      .then((r) => r.json())
      .then((res) => {
        if (res?.error) throw new Error(res.error);
        return res?.data ?? res ?? [];
      });
  }, []);

  // Funciones para Comentarios Personas
  const fetchComentariosPersonas = useCallback(() => {
    return fetch("/api/comentarios-personas")
      .then((r) => r.json())
      .then((res) => {
        if (res?.error) throw new Error(res.error);
        return res?.data ?? res ?? [];
      });
  }, []);

  // Funciones para Palabras Clave
  const fetchPalabrasClave = useCallback(() => {
    return fetch("/api/palabras-clave")
      .then((r) => r.json())
      .then((res) => {
        if (res?.error) throw new Error(res.error);
        return res?.data ?? res ?? [];
      });
  }, []);

  // Funciones para Administradores Públicos
  const fetchAdministradoresPublicos = useCallback(() => {
    return fetch("/api/administradores-publicos")
      .then((r) => r.json())
      .then((res) => {
        if (res?.error) throw new Error(res.error);
        return res?.data ?? res ?? [];
      });
  }, []);

  // Funciones para Logos Asociados
  const fetchLogosAsociados = useCallback(() => {
    return fetch("/api/logos-asociados")
      .then((r) => r.json())
      .then((res) => {
        if (res?.error) throw new Error(res.error);
        return res?.data ?? res ?? [];
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchConfig()
      .then((data) => {
        if (cancelled) return;
        setTitulo(data.titulo);
        setSubtitulo(data.subtitulo);
        setTextoBoton(data.textoBoton);
        setImagenIdRecurso(data.imagenIdRecurso);
        setImagenUrl(data.imagenUrl);
      })
      .catch(() => {
        if (!cancelled) toast.error("Error al cargar la configuración.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [fetchConfig]);


  // Cargar multimedia al montar el componente
  useEffect(() => {
    let cancelled = false;
    setLoadingMultimedia(true);
    fetchMultimedia()
      .then((data) => {
        if (cancelled) return;
        setMultimediaImagenIdRecurso(data.imagenIdRecurso);
        setMultimediaImagenUrl(data.imagenUrl);
      })
      .catch(() => {
        if (!cancelled) toast.error("Error al cargar Multimedia.");
      })
      .finally(() => {
        if (!cancelled) setLoadingMultimedia(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchMultimedia]);

  // Cargar Departamentos Destacados
  useEffect(() => {
    let cancelled = false;
    setLoadingDepartamentos(true);
    fetchDepartamentosDestacados()
      .then((data) => {
        if (cancelled) return;
        setDepartamentosDestacados(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Error al cargar Departamentos Destacados.");
      })
      .finally(() => {
        if (!cancelled) setLoadingDepartamentos(false);
      });
    return () => { cancelled = true; };
  }, [fetchDepartamentosDestacados]);

  // Cargar opciones de Departamentos (para select en destacados)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/departamentos")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const list = res?.data ?? res ?? [];
        const opts = Array.isArray(list)
          ? list.map((d: { idPublic: string; nombre: string }) => ({ value: d.idPublic, label: d.nombre }))
          : [];
        setDepartamentosOptions(opts);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Cargar Comentarios Personas
  useEffect(() => {
    let cancelled = false;
    setLoadingComentarios(true);
    fetchComentariosPersonas()
      .then((data) => {
        if (cancelled) return;
        setComentariosPersonas(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Error al cargar Comentarios.");
      })
      .finally(() => {
        if (!cancelled) setLoadingComentarios(false);
      });
    return () => { cancelled = true; };
  }, [fetchComentariosPersonas]);

  // Cargar Palabras Clave
  useEffect(() => {
    let cancelled = false;
    setLoadingPalabras(true);
    fetchPalabrasClave()
      .then((data) => {
        if (cancelled) return;
        setPalabrasClave(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Error al cargar Palabras Clave.");
      })
      .finally(() => {
        if (!cancelled) setLoadingPalabras(false);
      });
    return () => { cancelled = true; };
  }, [fetchPalabrasClave]);

  // Cargar Administradores Públicos
  useEffect(() => {
    let cancelled = false;
    setLoadingAdministradores(true);
    fetchAdministradoresPublicos()
      .then((data) => {
        if (cancelled) return;
        setAdministradoresPublicos(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Error al cargar Administradores Públicos.");
      })
      .finally(() => {
        if (!cancelled) setLoadingAdministradores(false);
      });
    return () => { cancelled = true; };
  }, [fetchAdministradoresPublicos]);

  // Cargar Logos Asociados
  useEffect(() => {
    let cancelled = false;
    setLoadingLogos(true);
    fetchLogosAsociados()
      .then((data) => {
        if (cancelled) return;
        setLogosAsociados(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Error al cargar Logos Asociados.");
      })
      .finally(() => {
        if (!cancelled) setLoadingLogos(false);
      });
    return () => { cancelled = true; };
  }, [fetchLogosAsociados]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    setSaving(true);
    fetch("/api/home-configuracion", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tituloHero: titulo || null,
        subtituloHero: subtitulo || null,
        textoBotonHero: textoBoton || null,
        idImagenHero: imagenIdRecurso || null,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.error) throw new Error(data.error);
        toast.success("Configuración guardada.");
        setIsEditing(false);
      })
      .catch((err) => toast.error(err?.message ?? "Error al guardar."))
      .finally(() => setSaving(false));
  };
  const handleSubmitMultimedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingMultimedia) return;

    setSavingMultimedia(true);
    try {
      const response = await fetch("/api/caracteristicas-pagina-principal/multimedia", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagenIdRecurso: multimediaImagenIdRecurso || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const data = result?.data ?? result;
      setMultimediaImagenIdRecurso(data?.imagen?.idPublic ?? null);
      setMultimediaImagenUrl(data?.imagen?.url ?? null);

      toast.success("Multimedia guardado con éxito");
      setIsEditingMultimedia(false);
    } catch (err: any) {
      console.error("Error al guardar multimedia:", err);
      toast.error(err?.message ?? "Error al guardar Multimedia.");
    } finally {
      setSavingMultimedia(false);
    }
  };

  // Handlers para Departamentos Destacados
  const handleSubmitDepartamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingDepartamento) return;
    setSavingDepartamento(true);
    try {
      const url = editingDepartamentoId
        ? "/api/departamentos-destacados"
        : "/api/departamentos-destacados";
      const method = editingDepartamentoId ? "PUT" : "POST";
      const body: any = {
        nombreDepartamento: departamentoNombre,
        imagenIdRecurso: departamentoImagenIdRecurso,
        orden: departamentoOrden,
        activo: departamentoActivo,
      };
      if (departamentoIdPublic) body.departamentoIdPublic = departamentoIdPublic;
      if (editingDepartamentoId) body.idPublic = editingDepartamentoId;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Error ${response.status}`);
      }

      const data = await fetchDepartamentosDestacados();
      setDepartamentosDestacados(Array.isArray(data) ? data : []);
      toast.success(editingDepartamentoId ? "Departamento actualizado" : "Departamento creado");
      setIsEditingDepartamento(false);
      setEditingDepartamentoId(null);
      setDepartamentoNombre("");
      setDepartamentoImagenIdRecurso(null);
      setDepartamentoImagenUrl(null);
      setDepartamentoOrden(0);
      setDepartamentoActivo(true);
      setDepartamentoIdPublic(null);
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar departamento");
    } finally {
      setSavingDepartamento(false);
    }
  };

  const handleDeleteDepartamento = async (idPublic: string) => {
    if (!confirm("¿Eliminar este departamento destacado?")) return;
    try {
      const response = await fetch(`/api/departamentos-destacados?idPublic=${idPublic}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      const data = await fetchDepartamentosDestacados();
      setDepartamentosDestacados(Array.isArray(data) ? data : []);
      toast.success("Departamento eliminado");
    } catch (err: any) {
      toast.error(err?.message ?? "Error al eliminar");
    }
  };

  // Handlers para Comentarios Personas
  const handleSubmitComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingComentario) return;
    setSavingComentario(true);
    try {
      const url = "/api/comentarios-personas";
      const method = editingComentarioId ? "PUT" : "POST";
      const body: any = {
        nombrePersonaComentario: comentarioNombre,
        puesto: comentarioPuesto,
        comentario: comentarioTexto,
        imagenIdRecurso: comentarioImagenIdRecurso,
      };
      if (editingComentarioId) body.idPublic = editingComentarioId;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Error ${response.status}`);
      }

      const data = await fetchComentariosPersonas();
      setComentariosPersonas(Array.isArray(data) ? data : []);
      toast.success(editingComentarioId ? "Comentario actualizado" : "Comentario creado");
      setIsEditingComentario(false);
      setEditingComentarioId(null);
      setComentarioNombre("");
      setComentarioPuesto("");
      setComentarioTexto("");
      setComentarioImagenIdRecurso(null);
      setComentarioImagenUrl(null);
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar comentario");
    } finally {
      setSavingComentario(false);
    }
  };

  const handleDeleteComentario = async (idPublic: string) => {
    if (!confirm("¿Eliminar este comentario?")) return;
    try {
      const response = await fetch(`/api/comentarios-personas?idPublic=${idPublic}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      const data = await fetchComentariosPersonas();
      setComentariosPersonas(Array.isArray(data) ? data : []);
      toast.success("Comentario eliminado");
    } catch (err: any) {
      toast.error(err?.message ?? "Error al eliminar");
    }
  };

  // Handlers para Palabras Clave
  const handleSubmitPalabra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingPalabra) return;
    setSavingPalabra(true);
    try {
      const url = "/api/palabras-clave";
      const method = editingPalabraId ? "PUT" : "POST";
      const body: any = { palabraClave: palabraTexto };
      if (editingPalabraId) body.idPublic = editingPalabraId;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Error ${response.status}`);
      }

      const data = await fetchPalabrasClave();
      setPalabrasClave(Array.isArray(data) ? data : []);
      toast.success(editingPalabraId ? "Palabra clave actualizada" : "Palabra clave creada");
      setIsEditingPalabra(false);
      setEditingPalabraId(null);
      setPalabraTexto("");
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar palabra clave");
    } finally {
      setSavingPalabra(false);
    }
  };

  const handleDeletePalabra = async (idPublic: string) => {
    if (!confirm("¿Eliminar esta palabra clave?")) return;
    try {
      const response = await fetch(`/api/palabras-clave?idPublic=${idPublic}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      const data = await fetchPalabrasClave();
      setPalabrasClave(Array.isArray(data) ? data : []);
      toast.success("Palabra clave eliminada");
    } catch (err: any) {
      toast.error(err?.message ?? "Error al eliminar");
    }
  };

  // Handlers para Administradores Públicos
  const handleSubmitAdministrador = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingAdministrador) return;
    setSavingAdministrador(true);
    try {
      const url = "/api/administradores-publicos";
      const method = editingAdministradorId ? "PUT" : "POST";
      const body: any = {
        nombre: administradorNombre,
        puesto: administradorPuesto,
        imagenIdRecurso: administradorImagenIdRecurso,
        orden: administradorOrden,
        activo: administradorActivo,
      };
      if (editingAdministradorId) body.idPublic = editingAdministradorId;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Error ${response.status}`);
      }

      await fetchAdministradoresPublicos().then(setAdministradoresPublicos);
      toast.success(editingAdministradorId ? "Administrador actualizado" : "Administrador creado");
      setIsEditingAdministrador(false);
      setEditingAdministradorId(null);
      setAdministradorNombre("");
      setAdministradorPuesto("");
      setAdministradorImagenIdRecurso(null);
      setAdministradorImagenUrl(null);
      setAdministradorOrden(0);
      setAdministradorActivo(true);
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar administrador");
    } finally {
      setSavingAdministrador(false);
    }
  };

  const handleDeleteAdministrador = async (idPublic: string) => {
    if (!confirm("¿Eliminar este administrador público?")) return;
    try {
      const response = await fetch(`/api/administradores-publicos?idPublic=${idPublic}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      await fetchAdministradoresPublicos().then(setAdministradoresPublicos);
      toast.success("Administrador eliminado");
    } catch (err: any) {
      toast.error(err?.message ?? "Error al eliminar");
    }
  };

  // Handlers para Logos Asociados
  const handleSubmitLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingLogo) return;
    setSavingLogo(true);
    try {
      const url = "/api/logos-asociados";
      const method = editingLogoId ? "PUT" : "POST";
      const body: any = {
        nombreAsociado: logoNombre,
        imagenIdRecurso: logoImagenIdRecurso,
        orden: logoOrden,
        activo: logoActivo,
      };
      if (editingLogoId) body.idPublic = editingLogoId;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Error ${response.status}`);
      }

      const data = await fetchLogosAsociados();
      setLogosAsociados(Array.isArray(data) ? data : []);
      toast.success(editingLogoId ? "Logo actualizado" : "Logo creado");
      setIsEditingLogo(false);
      setEditingLogoId(null);
      setLogoNombre("");
      setLogoImagenIdRecurso(null);
      setLogoImagenUrl(null);
      setLogoOrden(0);
      setLogoActivo(true);
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar logo");
    } finally {
      setSavingLogo(false);
    }
  };

  const handleDeleteLogo = async (idPublic: string) => {
    if (!confirm("¿Eliminar este logo asociado?")) return;
    try {
      const response = await fetch(`/api/logos-asociados?idPublic=${idPublic}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      const data = await fetchLogosAsociados();
      setLogosAsociados(Array.isArray(data) ? data : []);
      toast.success("Logo eliminado");
    } catch (err: any) {
      toast.error(err?.message ?? "Error al eliminar");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <AdminSectionCard>
          <SectionHeader
            title="Sección principal"
            showEditButton
            isEditing={isEditing}
            onEditToggle={handleEditToggle}
          />
          <div className="tp-dashboard-profile-info">
            <div className="row">
              <div className="col-lg-12">
                <div className="tp-dashboard-new-property-box">
                  <div className="tp-dashboard-new-input">
                    <label>Título de home</label>
                    <input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Ej: Encuentra tu próximo hogar"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="tp-dashboard-new-input">
                    <label>Subtítulo</label>
                    <input
                      type="text"
                      value={subtitulo}
                      onChange={(e) => setSubtitulo(e.target.value)}
                      placeholder="Ej: Las mejores propiedades en un solo lugar"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="tp-dashboard-new-input">
                    <label>Texto del botón</label>
                    <input
                      type="text"
                      value={textoBoton}
                      onChange={(e) => setTextoBoton(e.target.value)}
                      placeholder="Ej: Ver propiedades"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="tp-dashboard-new-input">
                    <ImageUploader
                      label="Imagen"
                      currentImageUrl={imagenUrl}
                      onUploadComplete={handleImageUpload}
                      folder="home"
                      textoAlternativo="Imagen de home"
                      width={280}
                      height={160}
                      placeholderIconOnly
                      minWidth={1300}
                      minHeight={500}
                      previewFit="cover"
                      disabled={!isEditing}
                    />
                  </div>
                  {isEditing && (
                    <div className="tp-dashboard-new-btn d-flex flex-wrap align-items-center" style={{ gap: "12px", marginTop: "20px" }}>
                      <button type="submit" className="add" disabled={saving}>
                        {saving ? "Guardando…" : "Guardar"}
                      </button>
                      <button type="button" className="add" onClick={handleCancel} disabled={saving}>
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AdminSectionCard>
      </form>
      <InformacionPaginaItemsSection />

      <form onSubmit={handleSubmitMultimedia} style={{ marginTop: "30px" }}>
        <AdminSectionCard>
          <SectionHeader
            title="Multimedia"
            subtitle="Sección únete y experimenta hoy"
            showEditButton
            isEditing={isEditingMultimedia}
            onEditToggle={handleEditToggleMultimedia}
          />
          <div className="tp-dashboard-profile-info">
            <div className="row">
              <div className="col-lg-12">
                <div className="tp-dashboard-new-property-box">
                  {loadingMultimedia ? (
                    <div className="py-5 text-center">Cargando Multimedia…</div>
                  ) : (
                    <>
                      <div className="tp-dashboard-new-input">
                        <ImageUploader
                          label="Imagen"
                          currentImageUrl={multimediaImagenUrl}
                          onUploadComplete={handleMultimediaUpload}
                          folder="multimedia-home"
                          textoAlternativo="Imagen de sección multimedia"
                          width={320}
                          height={100}
                          placeholderIconOnly
                          minWidth={1300}
                          minHeight={500}
                          previewFit="cover"
                          disabled={!isEditingMultimedia}
                        />
                      </div>
                      {isEditingMultimedia && (
                        <div
                          className="tp-dashboard-new-btn d-flex flex-wrap align-items-center"
                          style={{ gap: "12px", marginTop: "20px" }}
                        >
                          <button type="submit" className="add" disabled={savingMultimedia}>
                            {savingMultimedia ? "Guardando…" : "Guardar"}
                          </button>
                          <button type="button" className="add" onClick={handleCancelMultimedia} disabled={savingMultimedia}>
                            Cancelar
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AdminSectionCard>
      </form>

      {/* Sección Departamentos Destacados */}
      <form onSubmit={handleSubmitDepartamento} style={{ marginTop: "30px" }}>
        <AdminSectionCard>
          <SectionHeader
            title="Departamentos Destacados"
            showEditButton={!loadingDepartamentos}
            isEditing={isEditingDepartamento}
            onEditToggle={() => {
              if (!isEditingDepartamento) {
                setIsEditingDepartamento(true);
                setEditingDepartamentoId(null);
                setDepartamentoNombre("");
                setDepartamentoImagenIdRecurso(null);
                setDepartamentoImagenUrl(null);
                setDepartamentoOrden(0);
                setDepartamentoActivo(true);
                setDepartamentoIdPublic(null);
              } else {
                setIsEditingDepartamento(false);
              }
            }}
          />
          {loadingDepartamentos ? (
            <div className="py-5 text-center">Cargando departamentos destacados…</div>
          ) : (
            <div className="tp-dashboard-profile-info">
              <div className="row">
                <div className="col-lg-12">
                  {departamentosDestacados.length > 0 && (
                    <div className="mb-4">
                      <h6 className="mb-3">Departamentos existentes:</h6>
                      {departamentosDestacados.map((item) => (
                        <div key={item.idPublic} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                          <div>
                            <strong>{item.nombreDepartamento}</strong> - Orden: {item.orden} - {item.activo ? "Activo" : "Inactivo"}
                          </div>
                          <div>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => {
                                setEditingDepartamentoId(item.idPublic);
                                setDepartamentoNombre(item.nombreDepartamento);
                                setDepartamentoImagenIdRecurso(item.imagen?.idPublic || null);
                                setDepartamentoImagenUrl(item.imagen?.url || null);
                                setDepartamentoOrden(item.orden);
                                setDepartamentoActivo(item.activo);
                                setDepartamentoIdPublic(item.departamentoIdPublic || null);
                                setIsEditingDepartamento(true);
                              }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteDepartamento(item.idPublic)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {isEditingDepartamento && (
                    <div className="tp-dashboard-new-property-box">
                      <div className="tp-dashboard-new-input">
                        <label>Departamento (para filtro en Propiedades)</label>
                        <select
                          className="form-select"
                          value={departamentoIdPublic ?? ""}
                          onChange={(e) => {
                            const v = e.target.value || null;
                            setDepartamentoIdPublic(v);
                            const opt = departamentosOptions.find((o) => o.value === v);
                            if (opt) setDepartamentoNombre(opt.label);
                          }}
                        >
                          <option value="">— Seleccionar departamento —</option>
                          {departamentosOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <small className="text-muted d-block mt-1">
                          Al hacer clic en la card se filtrarán propiedades por este departamento.
                        </small>
                      </div>
                      <div className="tp-dashboard-new-input">
                        <label>Nombre del Departamento (en la card)</label>
                        <input
                          type="text"
                          value={departamentoNombre}
                          onChange={(e) => setDepartamentoNombre(e.target.value)}
                          placeholder="Ej: Sacatepéquez"
                          required
                        />
                      </div>
                      <div className="tp-dashboard-new-input">
                        <label>Orden</label>
                        <input
                          type="number"
                          value={departamentoOrden}
                          onChange={(e) => setDepartamentoOrden(parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="tp-dashboard-new-input">
                        <label>
                          <input
                            type="checkbox"
                            checked={departamentoActivo}
                            onChange={(e) => setDepartamentoActivo(e.target.checked)}
                            className="me-2"
                          />
                          Activo
                        </label>
                      </div>
                      <div className="tp-dashboard-new-input">
                        <ImageUploader
                          label="Imagen"
                          currentImageUrl={departamentoImagenUrl}
                          onUploadComplete={handleDepartamentoImagenUpload}
                          folder="departamentos-destacados"
                          textoAlternativo="Imagen del departamento"
                          width={280}
                          height={160}
                          placeholderIconOnly
                          disabled={false}
                        />
                      </div>
                      <div className="tp-dashboard-new-btn d-flex flex-wrap align-items-center" style={{ gap: "12px", marginTop: "20px" }}>
                        <button type="submit" className="add" disabled={savingDepartamento}>
                          {savingDepartamento ? "Guardando…" : editingDepartamentoId ? "Actualizar" : "Crear"}
                        </button>
                        <button
                          type="button"
                          className="add"
                          onClick={() => {
                            setIsEditingDepartamento(false);
                            setEditingDepartamentoId(null);
                            setDepartamentoNombre("");
                            setDepartamentoImagenIdRecurso(null);
                            setDepartamentoImagenUrl(null);
                            setDepartamentoOrden(0);
                            setDepartamentoActivo(true);
                            setDepartamentoIdPublic(null);
                          }}
                          disabled={savingDepartamento}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </AdminSectionCard>
      </form>

      {/* Sección Comentarios Personas */}
      <form onSubmit={handleSubmitComentario} style={{ marginTop: "30px" }}>
        <AdminSectionCard>
          <SectionHeader
            title="Comentarios de Personas"
            showEditButton={!loadingComentarios}
            isEditing={isEditingComentario}
            onEditToggle={() => {
              if (!isEditingComentario) {
                setIsEditingComentario(true);
                setEditingComentarioId(null);
                setComentarioNombre("");
                setComentarioPuesto("");
                setComentarioTexto("");
                setComentarioImagenIdRecurso(null);
                setComentarioImagenUrl(null);
              } else {
                setIsEditingComentario(false);
              }
            }}
          />
          {loadingComentarios ? (
            <div className="py-5 text-center">Cargando comentarios…</div>
          ) : (
            <div className="tp-dashboard-profile-info">
              <div className="row">
                <div className="col-lg-12">
                  {comentariosPersonas.length > 0 && (
                    <div className="mb-4">
                      <h6 className="mb-3">Comentarios existentes:</h6>
                      {comentariosPersonas.map((item) => (
                        <div key={item.idPublic} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                          <div>
                            <strong>{item.nombrePersonaComentario}</strong> - {item.puesto}
                          </div>
                          <div>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => {
                                setEditingComentarioId(item.idPublic);
                                setComentarioNombre(item.nombrePersonaComentario);
                                setComentarioPuesto(item.puesto);
                                setComentarioTexto(item.comentario);
                                setComentarioImagenIdRecurso(item.imagen?.idPublic || null);
                                setComentarioImagenUrl(item.imagen?.url || null);
                                setIsEditingComentario(true);
                              }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteComentario(item.idPublic)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {isEditingComentario && (
                    <div className="tp-dashboard-new-property-box">
                      <div className="tp-dashboard-new-input">
                        <label>Nombre de la Persona</label>
                        <input
                          type="text"
                          value={comentarioNombre}
                          onChange={(e) => setComentarioNombre(e.target.value)}
                          placeholder="Ej: Juan Pérez"
                          required
                        />
                      </div>
                      <div className="tp-dashboard-new-input">
                        <label>Puesto</label>
                        <input
                          type="text"
                          value={comentarioPuesto}
                          onChange={(e) => setComentarioPuesto(e.target.value)}
                          placeholder="Ej: CEO"
                          required
                        />
                      </div>
                      <div className="tp-dashboard-new-input">
                        <label>Comentario</label>
                        <textarea
                          value={comentarioTexto}
                          onChange={(e) => setComentarioTexto(e.target.value)}
                          placeholder="Escribe el comentario aquí..."
                          rows={4}
                          required
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #E6E6E6",
                            borderRadius: "4px",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            resize: "vertical",
                          }}
                        />
                      </div>
                      <div className="tp-dashboard-new-input">
                        <ImageUploader
                          label="Imagen"
                          currentImageUrl={comentarioImagenUrl}
                          onUploadComplete={handleComentarioImagenUpload}
                          folder="comentarios-personas"
                          textoAlternativo="Imagen de la persona"
                          width={280}
                          height={160}
                          placeholderIconOnly
                          disabled={false}
                        />
                      </div>
                      <div className="tp-dashboard-new-btn d-flex flex-wrap align-items-center" style={{ gap: "12px", marginTop: "20px" }}>
                        <button type="submit" className="add" disabled={savingComentario}>
                          {savingComentario ? "Guardando…" : editingComentarioId ? "Actualizar" : "Crear"}
                        </button>
                        <button
                          type="button"
                          className="add"
                          onClick={() => {
                            setIsEditingComentario(false);
                            setEditingComentarioId(null);
                            setComentarioNombre("");
                            setComentarioPuesto("");
                            setComentarioTexto("");
                            setComentarioImagenIdRecurso(null);
                            setComentarioImagenUrl(null);
                          }}
                          disabled={savingComentario}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </AdminSectionCard>
      </form>

      {/* Sección Palabras Clave */}
      <form onSubmit={handleSubmitPalabra} style={{ marginTop: "30px" }}>
        <AdminSectionCard>
          <SectionHeader
            title="Palabras Clave de la Empresa (Carousel)"
            showEditButton={!loadingPalabras}
            isEditing={isEditingPalabra}
            onEditToggle={() => {
              if (!isEditingPalabra) {
                setIsEditingPalabra(true);
                setEditingPalabraId(null);
                setPalabraTexto("");
              } else {
                setIsEditingPalabra(false);
              }
            }}
          />
          {loadingPalabras ? (
            <div className="py-5 text-center">Cargando palabras clave…</div>
          ) : (
            <div className="tp-dashboard-profile-info">
              <div className="row">
                <div className="col-lg-12">
                  {palabrasClave.length > 0 && (
                    <div className="mb-4">
                      <h6 className="mb-3">Palabras clave existentes:</h6>
                      {palabrasClave.map((item) => (
                        <div key={item.idPublic} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                          <div>
                            <strong>{item.palabraClave}</strong>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => {
                                setEditingPalabraId(item.idPublic);
                                setPalabraTexto(item.palabraClave);
                                setIsEditingPalabra(true);
                              }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeletePalabra(item.idPublic)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {isEditingPalabra && (
                    <div className="tp-dashboard-new-property-box">
                      <div className="tp-dashboard-new-input">
                        <label>Palabra Clave</label>
                        <input
                          type="text"
                          value={palabraTexto}
                          onChange={(e) => setPalabraTexto(e.target.value)}
                          placeholder="Ej: propiedades, casas, apartamentos"
                          required
                        />
                      </div>
                      <div className="tp-dashboard-new-btn d-flex flex-wrap align-items-center" style={{ gap: "12px", marginTop: "20px" }}>
                        <button type="submit" className="add" disabled={savingPalabra}>
                          {savingPalabra ? "Guardando…" : editingPalabraId ? "Actualizar" : "Crear"}
                        </button>
                        <button
                          type="button"
                          className="add"
                          onClick={() => {
                            setIsEditingPalabra(false);
                            setEditingPalabraId(null);
                            setPalabraTexto("");
                          }}
                          disabled={savingPalabra}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </AdminSectionCard>
      </form>

      {/* Sección Administradores Públicos */}
      <form onSubmit={handleSubmitAdministrador} style={{ marginTop: "30px" }}>
        <AdminSectionCard>
          <SectionHeader
            title="Equipo Empresa"
            showEditButton={!loadingAdministradores}
            isEditing={isEditingAdministrador}
            onEditToggle={() => {
              if (!isEditingAdministrador) {
                setIsEditingAdministrador(true);
                setEditingAdministradorId(null);
                setAdministradorNombre("");
                setAdministradorPuesto("");
                setAdministradorImagenIdRecurso(null);
                setAdministradorImagenUrl(null);
                setAdministradorOrden(0);
                setAdministradorActivo(true);
              } else {
                setIsEditingAdministrador(false);
              }
            }}
          />
          {loadingAdministradores ? (
            <div className="py-5 text-center">Cargando administradores públicos…</div>
          ) : (
            <div className="tp-dashboard-profile-info">
              <div className="row">
                <div className="col-lg-12">
                  {administradoresPublicos.length > 0 && (
                    <div className="mb-4">
                      <h6 className="mb-3">Administradores existentes:</h6>
                      {administradoresPublicos.map((item) => (
                        <div key={item.idPublic} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                          <div>
                            <strong>{item.nombre}</strong> - {item.puesto} - Orden: {item.orden} - {item.activo ? "Activo" : "Inactivo"}
                          </div>
                          <div>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => {
                                setEditingAdministradorId(item.idPublic);
                                setAdministradorNombre(item.nombre);
                                setAdministradorPuesto(item.puesto);
                                setAdministradorImagenIdRecurso(item.imagen?.idPublic || null);
                                setAdministradorImagenUrl(item.imagen?.url || null);
                                setAdministradorOrden(item.orden);
                                setAdministradorActivo(item.activo);
                                setIsEditingAdministrador(true);
                              }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteAdministrador(item.idPublic)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {isEditingAdministrador && (
                    <div className="tp-dashboard-new-property-box">
                      <div className="tp-dashboard-new-input">
                        <label>Nombre del Miembro</label>
                        <input
                          type="text"
                          value={administradorNombre}
                          onChange={(e) => setAdministradorNombre(e.target.value)}
                          placeholder="Ej: María González"
                          required
                        />
                      </div>
                      <div className="tp-dashboard-new-input">
                        <label>Puesto</label>
                        <input
                          type="text"
                          value={administradorPuesto}
                          onChange={(e) => setAdministradorPuesto(e.target.value)}
                          placeholder="Ej: Gerente General"
                          required
                        />
                      </div>
                      <div className="tp-dashboard-new-input">
                        <label>Orden</label>
                        <input
                          type="number"
                          value={administradorOrden}
                          onChange={(e) => setAdministradorOrden(parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="tp-dashboard-new-input">
                        <label>
                          <input
                            type="checkbox"
                            checked={administradorActivo}
                            onChange={(e) => setAdministradorActivo(e.target.checked)}
                            className="me-2"
                          />
                          Activo
                        </label>
                      </div>
                      <div className="tp-dashboard-new-input">
                        <ImageUploader
                          label="Imagen"
                          currentImageUrl={administradorImagenUrl}
                          onUploadComplete={handleAdministradorImagenUpload}
                          folder="administradores-publicos"
                          textoAlternativo="Imagen del administrador"
                          width={280}
                          height={160}
                          placeholderIconOnly
                          disabled={false}
                        />
                      </div>
                      <div className="tp-dashboard-new-btn d-flex flex-wrap align-items-center" style={{ gap: "12px", marginTop: "20px" }}>
                        <button type="submit" className="add" disabled={savingAdministrador}>
                          {savingAdministrador ? "Guardando…" : editingAdministradorId ? "Actualizar Miembro" : "Agregar Miembro"}
                        </button>
                        <button
                          type="button"
                          className="add"
                          onClick={() => {
                            setIsEditingAdministrador(false);
                            setEditingAdministradorId(null);
                            setAdministradorNombre("");
                            setAdministradorPuesto("");
                            setAdministradorImagenIdRecurso(null);
                            setAdministradorImagenUrl(null);
                            setAdministradorOrden(0);
                            setAdministradorActivo(true);
                          }}
                          disabled={savingAdministrador}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </AdminSectionCard>
      </form>

      {/* Sección Logos Asociados */}
      <form onSubmit={handleSubmitLogo} style={{ marginTop: "30px" }}>
        <AdminSectionCard>
          <SectionHeader
            title="Logos Asociados"
            showEditButton={!loadingLogos}
            isEditing={isEditingLogo}
            onEditToggle={() => {
              if (!isEditingLogo) {
                setIsEditingLogo(true);
                setEditingLogoId(null);
                setLogoNombre("");
                setLogoImagenIdRecurso(null);
                setLogoImagenUrl(null);
                setLogoOrden(0);
                setLogoActivo(true);
              } else {
                setIsEditingLogo(false);
              }
            }}
          />
          {loadingLogos ? (
            <div className="py-5 text-center">Cargando logos asociados…</div>
          ) : (
            <div className="tp-dashboard-profile-info">
              <div className="row">
                <div className="col-lg-12">
                  {logosAsociados.length > 0 && (
                    <div className="mb-4">
                      <h6 className="mb-3">Logos existentes:</h6>
                      {logosAsociados.map((item) => (
                        <div key={item.idPublic} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                          <div>
                            <strong>{item.nombreAsociado}</strong> - Orden: {item.orden} - {item.activo ? "Activo" : "Inactivo"}
                          </div>
                          <div>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => {
                                setEditingLogoId(item.idPublic);
                                setLogoNombre(item.nombreAsociado);
                                setLogoImagenIdRecurso(item.imagen?.idPublic || null);
                                setLogoImagenUrl(item.imagen?.url || null);
                                setLogoOrden(item.orden);
                                setLogoActivo(item.activo);
                                setIsEditingLogo(true);
                              }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteLogo(item.idPublic)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {isEditingLogo && (
                    <div className="tp-dashboard-new-property-box">
                      <div className="tp-dashboard-new-input">
                        <label>Nombre del Asociado</label>
                        <input
                          type="text"
                          value={logoNombre}
                          onChange={(e) => setLogoNombre(e.target.value)}
                          placeholder="Ej: Empresa XYZ"
                          required
                        />
                      </div>
                      <div className="tp-dashboard-new-input">
                        <label>Orden</label>
                        <input
                          type="number"
                          value={logoOrden}
                          onChange={(e) => setLogoOrden(parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="tp-dashboard-new-input">
                        <label>
                          <input
                            type="checkbox"
                            checked={logoActivo}
                            onChange={(e) => setLogoActivo(e.target.checked)}
                            className="me-2"
                          />
                          Activo
                        </label>
                      </div>
                      <div className="tp-dashboard-new-input">
                        <ImageUploader
                          label="Imagen del Logo"
                          currentImageUrl={logoImagenUrl}
                          onUploadComplete={handleLogoImagenUpload}
                          folder="logos-asociados"
                          textoAlternativo="Logo del asociado"
                          width={280}
                          height={160}
                          placeholderIconOnly
                          disabled={false}
                        />
                      </div>
                      <div className="tp-dashboard-new-btn d-flex flex-wrap align-items-center" style={{ gap: "12px", marginTop: "20px" }}>
                        <button type="submit" className="add" disabled={savingLogo}>
                          {savingLogo ? "Guardando…" : editingLogoId ? "Actualizar" : "Crear"}
                        </button>
                        <button
                          type="button"
                          className="add"
                          onClick={() => {
                            setIsEditingLogo(false);
                            setEditingLogoId(null);
                            setLogoNombre("");
                            setLogoImagenIdRecurso(null);
                            setLogoImagenUrl(null);
                            setLogoOrden(0);
                            setLogoActivo(true);
                          }}
                          disabled={savingLogo}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </AdminSectionCard>
      </form>
    </>
  );
}





