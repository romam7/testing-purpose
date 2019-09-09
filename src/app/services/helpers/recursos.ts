/**
 * Contiene todos los textos que se utilizan en los componentes ya sea .ts o .html
 */
export const RECURSOS: any = {
  LISTAR: {
    /** HTML listar-empleados.component.html */
    buscarEmpleados: 'Buscar empleado',
    instruccionesBuscar: 'Ingresa el nombre o número de empleado en el cuadro de búsqueda y presiona ENTER.',
    titleEditarInformacion: 'Editar información',
    titleDesactivar: 'Desactivar (cambia estatus a 0 - Inactivo)',
    titleActivar: 'Activar (cambia estatus a 1 - Activo)',
    /** PAGINACION */
    paginaAnterior: 'Anterior',
    paginaSiguiente: 'Siguiente',
    /** TS listar-empleados.component.ts */
    tituloListar: 'Administración de empleados',
    /** ALERTAS */
    msjEmpReactivado: 'El empleado ha sido reactivado, su estatus cambio a Activo.',
    headerEmpReactivado: 'Empleado reactivado',
    msjEmpDesactivado: 'El empleado ha sido desactivado, su estatus cambio a Inactivo.',
    headerEmpDesactivado: 'Empleado desactivado',
    msjErrorCambioEstatus: 'Ocurrió un problema al intentar cambiar el estatus del empleado.',
    msjErrorFiltroEmpleados: 'No se han podido filtrar los empleados.'
  },
  EDITAR_EMP: {
    /** HTML editar-usuario.component.html */
    datosEmpleado: 'Datos del empleado',
    tagNoEmpleado: 'No. empleado',
    tagNombre: 'Nombre completo',
    tagTelefono: 'Teléfono',
    tagPuesto: 'Puesto',
    eligeEmpresa: 'Selecciona una unidad de negocio',
    tagUnidadNegocio: 'Unidad de negocio',
    eligePerfil: 'Selecciona una opción',
    tagPerfil: 'Perfil',
    tagCeco: 'Centro de costos',
    tagNoEmpleadoJefe: 'No. empleado jefe',
    /** TS editar-usuario.component.ts */
    msjOcurrioErrorInesperado: 'Ocurrió un error inesperado.',
    headerIntenteDeNuevo: 'Intente nuevamente',
    msjErrorObteniendoEmp: 'Ha ocurrido un error al intentar obtener los datos del empleado.',
    sinJefe: 'Para guardar debes buscar y agregar un jefe.',
    headerBuscaJefe: 'Busca un jefe',
    msjDatosActualizados: 'Los datos se han actualizado correctamente.',
    headerActualizacionOK: 'Actualización exitosa',
    msjErrorIntentoActualizar: 'Ha ocurrido un error al intentar actualizar los datos.',
    msjErrorCatalogoEmpresas: 'Ha ocurrido un error al intentar obtener el catálogo de empresas.',
    msjInstruccionBuscar: 'Presiona enter después de escribir nombre o número de empleado.'
  },
  NOTIFICACION: {
    tagTitulo: 'Título de la alerta',
    mensaje: 'Mensaje',
    buscarEmpleado: 'Buscar no. empleado',
    alertaBuscarEmpleado: `Para buscar un empleado, teclea su número de empleado o nombre y presiona ENTER o carga
    los destinos desde un excel.`,
    titleCargaMasivaDestinos: 'Carga masiva de destinatarios',
    titleEliminaDestinos: 'Elimina todos los destinos',
    tagDestinatarios: 'DESTINATARIO(S)',
    sinDestinos: 'Sin destinatario(s)',
    msjDebeAgregarDestinos: 'Debes agregar uno o más destinatarios',
    headerSinDestinos: 'Sin destinatarios',
    msjNotificacionEnviada: 'La notificación ha sido enviada.',
    msjNotificacionNoEnviada: 'La notificación no pudo ser enviada.',
    msjArchivoNoExcel: 'El archivo no es un libro de excel o sobrepasa el tamaño permitido (5MB)',
    headerFormatoNoValido: 'Formato de documento inválido',
    msjFormatoIncorrecto: 'El archivo no tiene el formato correcto, consulta Preguntas frequentes/Envío de notificaciones',
    instruccion: `Ingresa el título de la alerta, el mensaje a enviar y los destinatarios
    (ingresa el número de empleado y da enter para hacer la búsqueda o
    haz una carga masiva mediante un excel presionando el botón azul)`,
    tituloHeaderNotificacion: 'Datos de la notificación'
  },
  UBICACIONES: {
    tagTitulo: 'Administración de ubicaciones',
    buscarPoi: 'Buscar punto de interés',
    instruccionesBuscar: 'Ingresa el nombre de la posición y presiona enter para poder iniciar la búsqueda.',
    agregarPosicion: 'Agregar posición',
    datosPoi: 'Datos de la posición',
    tagNombrePos: 'Nombre posición',
    tagNumeroPos: 'Número posición',
    tagLatitud: 'Latitud',
    tagLongitud: 'Longitud',
    tagRango: 'Rango aceptado',
    headerCamposInvalidos: 'Valores inválidos',
    msCamposInvalidos: 'Los valores de latitud y longitud no pueden ser 0',
    msjUbicacionCreada: 'La nueva posición ha quedado registrada.',
    msjUbicacionActualizada: 'La posición ha sido actualizada.',
    msjSinUbicaciones: 'No se han encontrado registros'
  },
  TRANSPORTE: {
    tagTitulo: 'Administración de TransporteGS',
    agregarConductor: 'Agregar conductor',
    tagNoLicencia: 'No. licencia',
    tagVigencia: 'Año vigencia',
    tagEstatus: 'Estatus conductor',
    tagSeleccionaEstatus: 'Selecciona una opción',
    datosConductor: 'Datos del conductor',
    msjInstruccionBuscar: 'Presiona enter después de escribir nombre o número de empleado del conductor.',
    msjConductorCreado: 'El conductor ha sido registrado correctamente.',
    msjErrorIntentoRegistro: 'No se ha podido registrar el conductor.',
    sinNumeroEmpleado: 'Para guardar debes buscar y agregar un empleado.',
    headerBuscaEmpleado: 'Para guardar, busca un empleado',
    msErrorConductores: 'Ha occurdo un error al intentar obtener los registros de conductores.'
  },
  MARCAJES: {
    tagTitulo: 'Consulta de marcajes',
    placeholderNoEmpleado: 'Número de empleado',
    instruccionesBuscar: 'Ingresa el número de empleado, elige la fecha de inicio y la fecha fín para iniciar la búsqueda.',
    msjFechaInicialInvalida: 'La fecha inicial no puede ser mayor a la fecha final.',
    headerFechaInvalida: 'Fecha inválida',
    msjErrorMarcajes: 'No se han encontradro coincidencias.',
    visualizarMapaInst: 'Da clic sobre el valor de la celda de Ubicación para desplegar el mapa.',
    headerVerMapa: 'Ver mapa de ubicación'
  },
  EMP_POSICION: {
    tagTitulo: 'Consulta ubicaciones empleado',
    msjErrorPosiciones: 'No se han encontrado registros'
  },
  HEADER: {
    msjErrorDatosSesion: 'Ocurrió un error al obtener los datos de sesión.',
    msjEmpleadoInactivo: 'Verifica tu estatus actual y/o conexión para poder ingresar.',
    headerInactivo: 'La sesión se cerrará',
  },
  COMUNES: {
    textoBuscando: 'Buscando...',
    demoraEnCarga: 'La carga esta demorando mucho...',
    /** BOTONES */
    cancelar: 'Cancelar',
    editar: 'Editar',
    aceptar: 'Aceptar',
    exportar: 'Exportar',
    limpiar: 'Limpiar',
    actualizar: 'Actualizar',
    enviar: 'Enviar',
    agregar: 'Agregar',
    /** ALERTA */
    msjCertificadoInvalido: 'El certificado es inválido o ha caducado.',
    headerCertificadoInvalido: 'Inicie sesión nuevamente.',
    headerErrorServicio: 'Error en el servicio',
    headerSinRegistros: 'Sin registros',
    sinCoincidencias: 'Sin coincidencias.',
    msjOcurrioErrorServicio: 'Ha ocurrido un error en el servicio.',
    headerRegistroOK: 'Registro exitoso',
    headerActualizacionOK: 'Actualización exitosa',
  },
  MENU: {
    portalSocioMAS: 'Portal SocioMAS',
    menuPrincipal: 'Menú Principal'
  }
};
