sequenceDiagram
    autonumber

    actor Visitante
    actor UsuarioAutenticado as "Usuario autenticado"
    actor UsuarioEnterprise as "Usuario autenticado con acceso a Enterprise"
    actor Administrador
    actor SuperAdministrador as "Super Administrador"

    participant Marketplace
    participant Enterprise
    participant Propiedad
    participant Favoritos
    participant SolicitudContacto as "SolicitudContacto"
    participant Contenido
    participant Usuarios
    participant Recurso
    participant Mapa as Mapa
    participant Subzona
    participant MarcadorHousingUniverse as "MarcadorHousingUniverse"
    participant CategoriaMarcador as "CategoriaMarcador"
    participant SolucionEmpresarial as "SolucionEmpresarial"
    participant ServicioEmpresarial as "ServicioEmpresarial"
    participant Plan
    participant BeneficioPlan as "BeneficioPlan"
    participant ProyectoLifestyle as "ProyectoLifestyle"
    participant PuntoInteres as "PuntoInteres"
    participant Isochrone as "Isochrone"
    participant ProyectoIsochrone as "ProyectoIsochrone"
    participant IsochronePuntoInteres as "IsochronePuntoInteres"
    participant CapaMapa as "CapaMapa"

    rect rgb(245, 248, 255)
    Note over Visitante,Usuarios: Marketplace
    Visitante ->> Marketplace: Consultar propiedades
    Marketplace ->> Propiedad: Obtener propiedades
    Propiedad -->> Marketplace: propiedades
    Marketplace -->> Visitante: Mostrar propiedades

    Visitante ->> Marketplace: Ver detalle de propiedad
    Marketplace ->> Propiedad: Obtener detalle de propiedad
    Propiedad -->> Marketplace: detalle de propiedad
    Marketplace -->> Visitante: Mostrar detalle de propiedad

    UsuarioAutenticado ->> Marketplace: Administrar favoritos
    Marketplace ->> Favoritos: Registrar favorito
    Favoritos -->> Marketplace: favorito
    Marketplace -->> UsuarioAutenticado: Confirmar favorito

    UsuarioAutenticado ->> Marketplace: Enviar solicitud de contacto
    Marketplace ->> SolicitudContacto: Registrar solicitud de contacto
    SolicitudContacto -->> Marketplace: PENDIENTE
    Marketplace -->> UsuarioAutenticado: Confirmar solicitud

    UsuarioAutenticado ->> Marketplace: Gestionar propiedades
    Marketplace ->> Propiedad: Crear o editar propiedad
    Propiedad -->> Marketplace: propiedad
    Marketplace ->> Recurso: Gestion de imagenes
    Recurso -->> Marketplace: recursos
    Marketplace -->> UsuarioAutenticado: Confirmar cambios

    Administrador ->> Marketplace: Gestionar contenido del home
    Marketplace ->> Contenido: Actualizar contenido
    Contenido -->> Marketplace: contenido
    Marketplace -->> Administrador: Confirmar contenido

    Administrador ->> Marketplace: Gestionar configuracion del sitio
    Marketplace ->> Contenido: Actualizar configuracion del sitio
    Contenido -->> Marketplace: configuracion del sitio
    Marketplace -->> Administrador: Confirmar configuracion

    SuperAdministrador ->> Marketplace: Gestionar los usuarios
    Marketplace ->> Usuarios: Actualizar usuarios
    Usuarios -->> Marketplace: usuarios
    Marketplace -->> SuperAdministrador: Confirmar cambios
    end

    rect rgb(245, 255, 245)
    Note over UsuarioEnterprise,BeneficioPlan: Enterprise - Mapa Dinamico
    UsuarioEnterprise ->> Enterprise: Consultar mapa dinamico
    Enterprise ->> Mapa: Cargar mapa dinamico
    Mapa -->> Enterprise: mapa dinamico
    Enterprise -->> UsuarioEnterprise: Mostrar mapa dinamico

    UsuarioEnterprise ->> Enterprise: Seleccionar zona y subzonas
    Enterprise ->> Subzona: Obtener subzonas
    Subzona -->> Enterprise: subzonas
    Enterprise ->> MarcadorHousingUniverse: Obtener marcadores asociados
    MarcadorHousingUniverse -->> Enterprise: marcadores
    Enterprise -->> UsuarioEnterprise: Mostrar subzonas y marcadores

    UsuarioEnterprise ->> Enterprise: Dibujar poligono
    Enterprise ->> Mapa: Generar GeoJSON
    Mapa -->> Enterprise: geometria dibujada por el usuario
    Enterprise ->> MarcadorHousingUniverse: Filtrar proyectos por area espacial
    MarcadorHousingUniverse -->> Enterprise: marcadores
    Enterprise -->> UsuarioEnterprise: Mostrar proyectos por area espacial

    UsuarioEnterprise ->> Enterprise: Dibujar circulo
    Enterprise ->> Mapa: Generar GeoJSON
    Mapa -->> Enterprise: geometria dibujada por el usuario
    Enterprise ->> MarcadorHousingUniverse: Filtrar proyectos por area espacial
    MarcadorHousingUniverse -->> Enterprise: marcadores
    Enterprise -->> UsuarioEnterprise: Mostrar proyectos por area espacial

    UsuarioEnterprise ->> Enterprise: Filtrar marcadores por categoria
    Enterprise ->> CategoriaMarcador: Obtener categorias disponibles
    CategoriaMarcador -->> Enterprise: categorias de marcador
    Enterprise ->> MarcadorHousingUniverse: Filtrar marcadores por categoria
    MarcadorHousingUniverse -->> Enterprise: marcadores
    Enterprise -->> UsuarioEnterprise: Mostrar marcadores filtrados

    UsuarioEnterprise ->> Enterprise: Cambiar estilo de mapa
    Enterprise ->> Mapa: Cambiar estilo de mapa
    Mapa -->> Enterprise: mapa actualizado
    Enterprise -->> UsuarioEnterprise: Mostrar nuevo estilo de mapa

    Administrador ->> Enterprise: Gestionar contenido enterprise
    Enterprise ->> SolucionEmpresarial: Actualizar soluciones empresariales
    SolucionEmpresarial -->> Enterprise: soluciones empresariales
    Enterprise ->> Recurso: Actualizar recursos
    Recurso -->> Enterprise: recursos
    Enterprise -->> Administrador: Confirmar contenido enterprise

    Administrador ->> Enterprise: Gestionar servicios enterprise
    Enterprise ->> ServicioEmpresarial: Actualizar servicios empresariales
    ServicioEmpresarial -->> Enterprise: servicios empresariales
    Enterprise -->> Administrador: Confirmar servicios enterprise

    Administrador ->> Enterprise: Gestionar planes y beneficios
    Enterprise ->> Plan: Actualizar planes
    Plan -->> Enterprise: planes
    Enterprise ->> BeneficioPlan: Actualizar beneficios del plan
    BeneficioPlan -->> Enterprise: beneficios del plan
    Enterprise -->> Administrador: Confirmar planes y beneficios

    SuperAdministrador ->> Enterprise: Gestionar configuracion enterprise
    Enterprise ->> SolucionEmpresarial: Actualizar configuracion enterprise
    SolucionEmpresarial -->> Enterprise: configuracion enterprise
    Enterprise ->> Recurso: Actualizar recursos
    Recurso -->> Enterprise: recursos
    Enterprise -->> SuperAdministrador: Confirmar configuracion enterprise
    end

    rect rgb(255, 245, 230)
    Note over UsuarioEnterprise,CapaMapa: Enterprise - Lifestyle Matcher

    UsuarioEnterprise ->> Enterprise: Crear proyecto Lifestyle Matcher
    Enterprise ->> ProyectoLifestyle: Crear proyecto
    ProyectoLifestyle -->> Enterprise: proyecto creado
    Enterprise -->> UsuarioEnterprise: Confirmar proyecto creado

    UsuarioEnterprise ->> Enterprise: Seleccionar puntos de interes y asignar prioridad
    Enterprise ->> PuntoInteres: Obtener categorias de puntos de interes
    PuntoInteres -->> Enterprise: categorias de puntos de interes
    Enterprise ->> PuntoInteres: Guardar puntos de interes con prioridad
    PuntoInteres -->> Enterprise: puntos de interes guardados con prioridad
    Enterprise -->> UsuarioEnterprise: Confirmar puntos de interes y prioridad

    UsuarioEnterprise ->> Enterprise: Configurar parametros del isochrone (tiempo, distancia, velocidad)
    Enterprise ->> Isochrone: Guardar parametros del isochrone
    Isochrone -->> Enterprise: parametros guardados
    Enterprise -->> UsuarioEnterprise: Confirmar parametros del isochrone

    UsuarioEnterprise ->> Enterprise: Seleccionar ubicacion de cada punto de interes
    Enterprise ->> PuntoInteres: Guardar ubicacion de cada punto de interes
    PuntoInteres -->> Enterprise: ubicaciones guardadas
    Enterprise -->> UsuarioEnterprise: Confirmar ubicaciones guardadas

    UsuarioEnterprise ->> Enterprise: Cargar mapa Lifestyle Matcher
    Enterprise ->> Mapa: Cargar mapa dinamico
    Mapa -->> Enterprise: mapa cargado
    Enterprise ->> PuntoInteres: Obtener puntos de interes con ubicacion y prioridad
    PuntoInteres -->> Enterprise: puntos de interes con ubicacion y prioridad
    Enterprise ->> Mapa: Renderizar puntos de interes en el mapa
    Mapa -->> Enterprise: puntos renderizados
    Enterprise -->> UsuarioEnterprise: Mostrar mapa con puntos de interes

    Enterprise ->> Isochrone: Generar hash de combinacion puntos+prioridad+parametros
    Isochrone -->> Enterprise: hash generado
    Enterprise ->> Isochrone: Buscar isochrone por hash en DB
    alt Isochrone existe en DB
        Isochrone -->> Enterprise: isochrone encontrado con area de cobertura
        Enterprise ->> ProyectoIsochrone: Asociar isochrone existente al proyecto
        ProyectoIsochrone -->> Enterprise: asociacion creada
    else Isochrone no existe en DB
        Isochrone -->> Enterprise: isochrone no encontrado
        Enterprise ->> Isochrone: Llamar API y crear isochrone con parametros y puntos
        Isochrone -->> Enterprise: isochrone generado con area de cobertura
        Enterprise ->> IsochronePuntoInteres: Guardar snapshot de puntos y prioridades
        IsochronePuntoInteres -->> Enterprise: snapshot guardado
        Enterprise ->> ProyectoIsochrone: Asociar nuevo isochrone al proyecto
        ProyectoIsochrone -->> Enterprise: asociacion creada
    end
    Enterprise ->> Mapa: Renderizar isochrone en el mapa
    Mapa -->> Enterprise: isochrone renderizado
    Enterprise -->> UsuarioEnterprise: Mostrar isochrone en el mapa

    Enterprise ->> MarcadorHousingUniverse: Obtener proyectos dentro del isochrone
    MarcadorHousingUniverse -->> Enterprise: proyectos disponibles
    Enterprise ->> Mapa: Cargar proyectos en el mapa
    Mapa -->> Enterprise: proyectos cargados
    Enterprise -->> UsuarioEnterprise: Mostrar proyectos disponibles dentro del isochrone

    UsuarioEnterprise ->> Enterprise: Filtrar proyectos por tipo (apartamentos, viviendas, terrenos)
    Enterprise ->> MarcadorHousingUniverse: Filtrar proyectos por tipo de propiedad
    MarcadorHousingUniverse -->> Enterprise: proyectos filtrados
    Enterprise ->> Mapa: Actualizar proyectos visibles en el mapa
    Mapa -->> Enterprise: mapa actualizado
    Enterprise -->> UsuarioEnterprise: Mostrar proyectos filtrados en el mapa

    UsuarioEnterprise ->> Enterprise: Activar capa de puntos de interes (hospitales, parques, etc.)
    Enterprise ->> CapaMapa: Obtener capas disponibles
    CapaMapa -->> Enterprise: capas disponibles
    Enterprise ->> Mapa: Mostrar capa seleccionada
    Mapa -->> Enterprise: capa renderizada
    Enterprise -->> UsuarioEnterprise: Mostrar puntos de interes activados en el mapa

    UsuarioEnterprise ->> Enterprise: Modificar parametros del isochrone (tiempo, velocidad, distancia)
    Enterprise ->> Isochrone: Generar hash con nuevos parametros
    Isochrone -->> Enterprise: hash generado
    Enterprise ->> Isochrone: Buscar isochrone por hash en DB
    alt Isochrone existe en DB
        Isochrone -->> Enterprise: isochrone encontrado
        Enterprise ->> ProyectoIsochrone: Actualizar version actual del proyecto
        ProyectoIsochrone -->> Enterprise: version actualizada
    else Isochrone no existe en DB
        Isochrone -->> Enterprise: isochrone no encontrado
        Enterprise ->> Isochrone: Llamar API y crear nuevo isochrone
        Isochrone -->> Enterprise: nuevo isochrone generado
        Enterprise ->> IsochronePuntoInteres: Guardar snapshot de puntos y prioridades
        IsochronePuntoInteres -->> Enterprise: snapshot guardado
        Enterprise ->> ProyectoIsochrone: Asociar nuevo isochrone al proyecto
        ProyectoIsochrone -->> Enterprise: asociacion creada
    end
    Enterprise ->> Mapa: Re-renderizar isochrone en el mapa
    Mapa -->> Enterprise: isochrone re-renderizado
    Enterprise ->> MarcadorHousingUniverse: Obtener proyectos actualizados segun nuevo isochrone
    MarcadorHousingUniverse -->> Enterprise: proyectos actualizados
    Enterprise -->> UsuarioEnterprise: Mostrar mapa actualizado con nuevos proyectos

    UsuarioEnterprise ->> Enterprise: Cambiar estilo de mapa
    Enterprise ->> Mapa: Cambiar estilo de mapa
    Mapa -->> Enterprise: mapa actualizado
    Enterprise -->> UsuarioEnterprise: Mostrar nuevo estilo de mapa

    end