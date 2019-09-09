import { Injectable, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { GenericoRequest } from '../../modelos/requests/generico';
import { DatosSesion } from '../../modelos/modelos/datos.sesion';
import { CabeceroRequest } from '../../modelos/requests/cabecero.request';
import { FotoRequest } from '../../modelos/requests/foto.request';
import { AbstractControl } from '@angular/forms';
import { CatalogoEmpresasResponse } from '../../modelos/responses/catalogo.empresas.response';
import { RECURSOS } from './recursos';
import { EmpleadoService } from '../empleado.service';
import { CertificadoRequest } from '../../modelos/requests/certificado.request';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;
/**
 * Servicio que provee de información comun a todos los componentes
 */
@Injectable()
export class DatosComunesService {
    /**
     * Funciona como helper para desplegar la modal de cargando información, igual funciona para deshabilitar el cuadro de búsqueda
     */
    loading = false;
    /**
     * Hace referencia al customTemplate del loading
     */
    public loadingTemplate: TemplateRef<any>;
    /**
     * Objeto de tipo GenericoRequest
     */
    genericoRequest: GenericoRequest;
    /**
     * Nombre de la vairbale local que tiene los datos de ip, host, cer y empleado
     */
    datosSesionKeyLocal = 'sessionDataPS';
    /**
     * Nombre de la vairbale local que contiene el certificado
     */
    certificadoKeyLocal = 'cer';
    /**
     * Nombre de la variable en local storage
     */
    empleadoKeyLocal = 'empleado';
    /**
     * Nombre del key de la variable local storage
     */
    fotoKeyLocal = 'foto';
    /**
     * Titulo de la página que se mostrará de acuerdo a cada componente
     */
    tituloPagina = '';
    /**
     * Objeto al que se le asignarán los datos codificados de la variable local
     */
    sesion: DatosSesion = DatosSesion.sesion();
    /**
     * Catalogo de empresas
     */
    empresasPadre: CatalogoEmpresasResponse = CatalogoEmpresasResponse.empresaResponse();
    /**
     * Textos de cada componente
     */
    RECURSOS = RECURSOS;
    /**
     * Indica si la modal ha sido abierta
     */
    modalEditarAbierta = false;
    /**
     * Indica si la modal ha sido abierta
     */
    modalReactivacionAbierta = false;
    /**
     * Indica si la modal ha sido abierta
     */
    modalAltaConductorAbierta = false;
    /**
     * Indica si la modal ha sido abierta
     */
    modalPosicionAbierta = false;
    /**
     * Indica si la modal ha sido abierta
     */
    modalMapaAbierta = false;
    /**
     * Indica que se está cargando la página principal
     */
    cargandoPrincipal = false;
    /**
     * Key con el nombre del tag de la IP
     */
    ipKey = 'IP';
    /**
     * Key con el nombre del tag del número de empleado
     */
    empleadoKey = 'NumeroEmpleado';
    /**
     * Key con el nombre del tag del host
     */
    hostKey = 'HostName';
    /**
     * Key con el nombre del tag del certificado
     */
    tokenKey = 'TokenAcceso';
    /**
     * Objeto que contiene la configuración para la paginación (paginaActual, elementos por página, elementos totales)
     */
    configPaginacion = {
        itemsPerPage: 0,
        currentPage: 0,
        totalItems: 0
    };
    /**
     * Crea los objetos a ocupar en el servicio
     * @param toastr Objeto del paquete de alertas
     * @param router Objeto para redireciconar a un componente
     */
    constructor(
        private toastr: ToastrService,
        private router: Router,
        private empleadoService: EmpleadoService) {
        this.genericoRequest = GenericoRequest.generico();
    }
    /**
     * Obtiene el empleado en sesión
     * @returns Número de empleado
     */
    obtenerValorEmpleadoSesion() {
        return this.sesion.empleado;
    }

    /**
     * Cierra la sesión actual y elimina todo lo referente a la misma
     */
    cerrarSesionEmpleado() {
        this.sesion = DatosSesion.sesion();
        localStorage.clear();
        this.loading = false;
        this.cargandoPrincipal = false;
        $('#effect').toggle(false);
        this.redirigeAPrincipal();
        this.cierraModalesAbiertas();
    }

    /**
     * Cierra todas las modales que se encuentren abiertas
     */
    cierraModalesAbiertas() {
        if (this.modalEditarAbierta) {
            $('#modalEditarEmpleado').css('display', 'none');
            $('#simplemodal-overlay').css('background-color', '');
            document.getElementById('simplemodal-overlay').remove();
            this.modalEditarAbierta = false;
        }
        if (this.modalReactivacionAbierta) {
            $('#modalReactivarEmpleado').css('display', 'none');
            $('#modalDesactivarEmpleado').css('display', 'none');
            $('#simplemodal-overlay').css('background-color', '');
            document.getElementById('simplemodal-overlay').remove();
            this.modalReactivacionAbierta = false;
        }
        if (this.modalAltaConductorAbierta) {
            $('#modalAltaConductor').css('display', 'none');
            $('#simplemodal-overlay').css('background-color', '');
            document.getElementById('simplemodal-overlay').remove();
            this.modalAltaConductorAbierta = false;
        }
        if (this.modalPosicionAbierta) {
            $('#modalEditaPosicion').css('display', 'none');
            $('#modalAltaPosicion').css('display', 'none');
            $('#simplemodal-overlay').css('background-color', '');
            if (document.getElementById('simplemodal-overlay')) {
                document.getElementById('simplemodal-overlay').remove();
            }
            this.modalPosicionAbierta = false;
        }
        if (this.modalMapaAbierta) {
            $('#modalMostrarMapa').css('display', 'none');
            $('#simplemodal-overlay').css('background-color', '');
            document.getElementById('simplemodal-overlay').remove();
            this.modalMapaAbierta = false;
        }
    }

    /**
     * Valida si existe una sesión activa
     */
    validaSesionExistente() {
        if (this.sesion.empleado !== '' || localStorage.getItem(this.datosSesionKeyLocal)) {
            if (this.obtenerValorEmpleadoSesion()) {
                return true;
            }
        }
    }

    /**
     * Helper para hacer un trim a los inputs
     * @param control Control del cual se quieren quitar los espacios
     */
    remueveEspaciosFormGroup(control: AbstractControl) {
        if (control && control.value && !control.value.replace(/\s/g, '').length) {
            control.setValue('');
        }
        return null;
    }

    /**
     * Crea una alerta que será mostrada en un componente
     * @param tipo Número que indica de que tipo se desea crear la alerta
     * @param mensaje Mensaje que se mostrará en la alerta
     * @param cabecero Título que tendra la alerta
     * @param easer Tiempo de expiración de la alerta (no requerido)
     */
    creaAlerta(tipo: number, mensaje: string, cabecero: string, easer?: number) {
        switch (tipo) {
            case 1: // info
                (easer !== 0) ? this.toastr.info(mensaje, cabecero) : this.toastr.info(mensaje, cabecero, { timeOut: easer });
                break;
            case 2: // warning
                this.toastr.warning(mensaje, cabecero);
                break;
            case 3: // error
                this.toastr.error(mensaje, cabecero);
                break;
            case 4: // success
                this.toastr.success(mensaje, cabecero);
                break;
            default:
                break;
        }
    }

    /**
     * Crea una alerta de tipo info agregando un tiempo de expiración
     * @param mensaje Mensaje a mostrar
     */
    creaAlertaInfo(mensaje: string) {
        this.creaAlerta(1, mensaje, '', 5000);
    }

    /**
     * Muestra un template de la modal para poder cancelar la carga de datos
     */
    toggleTemplate(customLoadingTemplate): void {
        if (this.loadingTemplate) {
            this.loadingTemplate = null;
        } else {
            this.loadingTemplate = customLoadingTemplate;
        }
    }

    /**
     * Valida si actualmente se cuenta con la ventana de 'cargando' desplegada para mostrar opciones de cancelación
     */
    validaCargando(customLoadingTemplate) {
        if (this.loading) {
            this.toggleTemplate(customLoadingTemplate);
        }
    }

    /**
     * Cancela la carga de información
     */
    public cancelarCarga(subscriber?): void {
        this.loading = false;
        if (subscriber !== undefined) {
            subscriber.unsubscribe();
        }
    }

    /**
     * Redirige a la página de home
     */
    redirigeAPrincipal() {
        this.router.navigate(['']);
    }

    /**
     * Redigire al componente de ListaEmpleados
     */
    redirigeAListado() {
        this.router.navigate(['empleados']);
    }

    /**
     * Asigna valores al objeto del request generico
     * @param valor Valor a asignar
     */
    asignaValorRequestGenerico(valor: any) {
        this.genericoRequest.valor = valor;
        this.asignaValorRequest(this.genericoRequest.cabRequest);
        return this.genericoRequest;
    }

    /**
     * Asigna valores al objeto del cabecero que será enviado a los servicios
     * @param request Objeto de tipo CabeceroRequest
     * @returns Retorna un objeto de tipo CabeceroRequest
     */
    asignaValorRequest(request: CabeceroRequest): CabeceroRequest {
        if (this.sesion.certificado || localStorage.getItem(this.certificadoKeyLocal)) {
            request.cer = this.sesion.certificado || localStorage.getItem(this.certificadoKeyLocal);
        } else {
            this.obtieneCertificadoNuevo(request);
        }
        request.ip = this.sesion.ip || '0.0.0.0';
        request.nombrePC = this.sesion.hostname || 'BAZPS';
        return request;
    }

    /**
     * Obtiene un nuevo certificado en cado de que la vairble local de cer haya sido eliminada
     * @param request Parámetro de tipo CabeceroRequest
     */
    obtieneCertificadoNuevo(request: CabeceroRequest) {
        if (localStorage.getItem(this.datosSesionKeyLocal) && !localStorage.getItem(this.certificadoKeyLocal)) {
            const datos = JSON.parse(atob(localStorage.getItem(this.datosSesionKeyLocal)));
            if (datos !== null) {
                const requestCert: CertificadoRequest = {
                    cabRequest: {
                        cer: '',
                        ip: this.sesion.ip,
                        nombrePC: this.sesion.hostname
                    },
                    tokenDeAcceso: datos[this.tokenKey]
                };

                this.empleadoService.obtenerCertificado(requestCert).subscribe(
                    response => {
                        if (response.cabResponse.codResponse !== undefined && response.cabResponse.codResponse === 0) {
                            request.cer = response.cer;
                            localStorage.setItem(this.certificadoKeyLocal, response.cer);
                            this.sesion.certificado = localStorage.getItem(this.certificadoKeyLocal);
                        } else {
                            this.creaAlerta(3, 'No se pudo generar una sesión correctamente',
                                this.RECURSOS.COMUNES.headerCertificadoInvalido);
                        }
                    }
                );
            }
        }
        return request;
    }

    /**
     * Asigna cabecero para el request al servico de obtencio de foto
     * @param fotoRequest Objeto de tipo FotoRequest
     * @param empleado empleado del cual se desea obtener la foto
     * @returns Retorna un objeto de tipo FotoRequest
     */
    asignaCabeceroFoto(fotoRequest: FotoRequest, empleado) {
        fotoRequest.cabRequest = this.asignaValorRequest(fotoRequest.cabRequest);
        fotoRequest.numeroEmpleado = empleado.numeroEmpleado;
        fotoRequest.idEmpresa = empleado.idEmpresa;
        return fotoRequest;
    }

    /**
     * Valida si el certificado enviado a un servio es válido
     * @param codResponse Código de respuesta del servicio
     * @param modal Modal que debe cerrarse (no requerida)
     */
    validaCertificado(codResponse: number, modal?: any) {
        if (codResponse === -2) {
            if (modal !== undefined) {
                modal.close();
            }
            this.cerrarSesionEmpleado();
            this.creaAlerta(3, this.RECURSOS.COMUNES.msjCertificadoInvalido, this.RECURSOS.COMUNES.headerCertificadoInvalido);
        }
    }

    /**
     * Obtiene la foto guardada en sesión
     * @returns Retorna el valor que contiene la variable en sesión
     */
    obtieneFotoLocal() {
        return localStorage.getItem(this.fotoKeyLocal);
    }

    /**
     * Crea una variable en sesión de tipo local que guarda la foto en base64 del empleado logeado
     * @param valor Foto en base64
     */
    creaFotoLocal(valor: string) {
        localStorage.setItem(this.fotoKeyLocal, valor);
    }

    /**
     * Evita que se envien requests en una modal o input
     * @param event Evento que se detendrá
     * @returns Retorna un false
     */
    preventDefault(event: any) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    /**
     * Evalua si existe una variable en local storage y si es así retorna su valor
     * @returns Retorna el valor de la variable en el local storage
     */
    obtenerDatosSesion() {
        if (localStorage.getItem(this.empleadoKeyLocal)) {
            return atob(localStorage.getItem(this.empleadoKeyLocal));
        } else {
            this.loading = false;
            this.cargandoPrincipal = false;
        }
    }

    /**
     * Reemplaza los carácteres que contengan algún tipo de tilde
     * @param texto Cadena a evaluar
     */
    removerAcentos(texto: string) {
        texto = texto.replace(new RegExp(/[àáâãäå]/g), 'a');
        texto = texto.replace(new RegExp(/[èéêë]/g), 'e');
        texto = texto.replace(new RegExp(/[ìíîï]/g), 'i');
        texto = texto.replace(new RegExp(/[òóôõö]/g), 'o');
        texto = texto.replace(new RegExp(/[ùúûü]/g), 'u');
        texto = texto.replace(new RegExp(/[ÀÁÂÃÄÅ]/g), 'A');
        texto = texto.replace(new RegExp(/[ÈÉÊË]/g), 'E');
        texto = texto.replace(new RegExp(/[ÌÍÎÏ]/g), 'I');
        texto = texto.replace(new RegExp(/[ÒÓÔÕÖ]/g), 'O');
        texto = texto.replace(new RegExp(/[ÙÚÛÜ]/g), 'U');
        return texto;
    }

    /**
     * Formatea la fecha a un formato en específico
     * @param date Fecha a formatear
     * @return Fecha en el formato establecido
     */
    formatDate(date) {
        if (!date) {
            return '';
        }
        try {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const dateString = year + '-' + ((month < 10 ? '0' : '') + month) + '-' + (day < 10 ? '0' : '') + day;
            return dateString;
        } catch (e) {
            return date;
        }
    }

    /**
     * Método que realiza el traqueo de una lista
     * @param index Indice del elemento
     * @param elemento Objeto que se traquea
     */
    trackPorEmpleado(index, elemento) {
        return elemento.numeroEmpleado;
    }
}
