import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { NotificacionRequest } from 'src/app/modelos/requests/notificacion.request';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
import * as XLSX from 'xlsx';
import { EmpleadosResponse } from 'src/app/modelos/responses/empleados.response';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;
/**
 * Componente que pertenece a la modal de envío de notificaciones
 */
@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  /**
   * Determina si un empleado se agregará a la lista de destinatarios
   */
  private agregar = false;
  /**
   * Request para el envío de notificaciones
   */
  public notificacion: NotificacionRequest = new NotificacionRequest();
  /**
   * Catalogo de empleados encontrados por el filtro
   */
  empleadosBuscar: EmpleadosResponse = EmpleadosResponse.empleado();
  /**
   * NgModel de empleado a buscar
   */
  empleado = '';
  /**
   * Desactiva botón de envíar
   */
  desactivarControl = false;
  /**
   * ViewChild para el loading template
   */
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  /**
   * ViewChild para el formulario de la notificación
   */
  @ViewChild('notificacionForm', { static: false }) notificacionForm;
  /**
   * Hace referencia el template de carga de información
   */
  public loadingTemplate: TemplateRef<any>;
  /**
   * Texto que indica carga de datos
   */
  cargandoTexto = this.comun.RECURSOS.COMUNES.textoBuscando;
  /**
   * Archivo elegido
   */
  private file: File;
  /**
   * Datos del excel
   */
  private arrayBuffer: any;
  /**
   * Toma la subscripción al servicio que se va a consumir
   */
  suscriptor: Subscription;
  /**
   * Intervalo que contiene el valor del timeOut
   */
  intervalo: any;
  /**
   * Intervalo que contiene el valor del timeOut
   */
  intervaloBuscar: any;
  /**
   * Determina si despues de escribir un valor se ha presionado enter
   */
  private enterPresionadoBuscar = false;
  /**
   * Determina si la carga de destinos se ha hecho por medio de archivo
   */
  private cargaDestinosArchivo = false;
  /**
   * Tamaño máximo del mensaje
   */
  minLengthRequerido = 5;

  /**
   * Crea los objetos para que el componente funcione
   * @param empleadoService Objeto del servicio de empleados
   * @param comun Objeto del servicio de datos comunes
   * @param app Objeto del componente AppComponent, el cuál se usará para estar continuamente validando la inactividad
   */
  constructor(private empleadoService: EmpleadoService, public comun: DatosComunesService, private authService: AuthService) { }

  /**
   * Cuando se inicia la página
   */
  ngOnInit(): void {
    $('.contConfig').hide();
    if (this.authService.isAuthenticated()) {
      this.comun.tituloPagina = 'Enviar notificación';
    } else {
      this.comun.redirigeAPrincipal();
    }
  }

  /**
   * Consume el servio de envío de notificaciones para hacer el envío de la misma
   */
  enviarNotificacion() {
    clearTimeout(this.intervaloBuscar);
    this.comun.loadingTemplate = null;
    this.desactivarControl = true;
    this.empleadosBuscar = EmpleadosResponse.empleado();
    this.comun.loading = true;
    this.notificacion.cabRequest = this.comun.asignaValorRequest(this.notificacion.cabRequest);
    if (this.notificacion.lstEmpleados.length === 0) {
      this.comun.creaAlerta(1, this.comun.RECURSOS.NOTIFICACION.msjDebeAgregarDestinos, this.comun.RECURSOS.NOTIFICACION.headerSinDestinos);
      this.desactivarControl = false;
      this.comun.loading = false;
    } else {
      this.intervalo = setTimeout(() => {
        this.cargandoTexto = this.comun.RECURSOS.COMUNES.demoraEnCarga;
        this.comun.validaCargando(this.customLoadingTemplate);
      }, 5000);
      this.suscriptor = this.empleadoService.enviarNotificacion(this.notificacion).subscribe(
        response => {
          if (response && response.cabResponse !== undefined) {
            if (response.cabResponse.codResponse === 0 && response.cabResponse.mensReponse !== null) {
              this.comun.creaAlerta(4, this.comun.RECURSOS.NOTIFICACION.msjNotificacionEnviada, '');
              this.resetearFormulario();
              this.desactivarControl = false;
            } else {
              this.asignarRespuestaError();
            }
            if (response.cabResponse.codResponse === -1) {
              this.asignarRespuestaError();
            }
            this.comun.validaCertificado(response.cabResponse.codResponse);
          } else {
            this.asignarRespuestaError();
          }
          this.comun.loading = false;
        },
        error => {
          this.asignarRespuestaError();
        }
      );
      clearTimeout(this.intervaloBuscar);
      this.comun.loadingTemplate = null;
    }
  }

  /**
   * Asigna una respuesta de error al envio de notificacion
   */
  asignarRespuestaError() {
    this.comun.creaAlerta(3, this.comun.RECURSOS.NOTIFICACION.msjNotificacionNoEnviada, this.comun.RECURSOS.COMUNES.headerErrorServicio);
    this.desactivarControl = false;
    this.comun.loading = false;
  }

  /**
   * Busca al empleado
   */
  public buscar() {
    clearTimeout(this.intervaloBuscar);
    this.comun.loadingTemplate = null;
    if (this.empleado !== '') {
      this.intervalo = setTimeout(() => {
        this.cargandoTexto = this.comun.RECURSOS.COMUNES.demoraEnCarga;
        this.comun.validaCargando(this.customLoadingTemplate);
      }, 5000);

      if (this.notificacion.lstEmpleados.length > 0) {
        this.agregar = this.existeEnDestinos(this.empleado);
        if (!this.agregar) {
          this.empleado = '';
          this.comun.loading = false;
          return;
        }
        this.llamarAServicioBuscar();
      } else {
        this.llamarAServicioBuscar();
      }
    }
    clearTimeout(this.intervaloBuscar);
    this.comun.loadingTemplate = null;
  }

  validaCampo() {
    if (this.notificacion.cuerpoMensaje.trim().length < this.minLengthRequerido) {
      this.comun.creaAlerta(1, `El mensaje debe tener al menos ${this.minLengthRequerido} caracteres.`, 'Longitud de campo inválida');
    }
  }

  /**
   * Consume el servicio de busqueda para buscar a un empleado como destinatario
   */
  llamarAServicioBuscar() {
    this.comun.loading = true;
    this.suscriptor = this.empleadoService.filtrarEmpleados(this.comun.asignaValorRequestGenerico(this.empleado)).subscribe(
      response => {
        if (response.empleados !== undefined && response.cabResponse !== undefined) {
          if (response.cabResponse.codResponse === 0 && response.empleados.length > 0) {
            for (const empleado of response.empleados) {
              if (empleado.estatus === 1) {
                this.empleadosBuscar.empleados.push(empleado);
              }
            }
            this.empleado = '';
          }
          if (response.cabResponse.codResponse === -1 && response.empleados.length === 0) {
            this.comun.creaAlerta(1, this.comun.RECURSOS.LISTAR.msjErrorFiltroEmpleados, this.comun.RECURSOS.COMUNES.sinCoincidencias);
            this.empleado = '';
            this.comun.loading = false;
            return;
          }
          if (response.cabResponse.codResponse === -1) {
            this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio, '');
            this.empleado = '';
          }
          this.comun.validaCertificado(response.cabResponse.codResponse);
          this.comun.loading = false;
        } else {
          this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio, '');
          this.comun.loading = false;
        }
      },
      error => {
        this.comun.loading = false;
      }
    );
  }

  /**
   * Detecta si la key presionada es enter entonces busca al empleado
   * @param event Key presionada
   */
  onKeydown(event) {
    if (this.empleado !== '' && event.key === 'Enter') {
      this.empleadosBuscar = EmpleadosResponse.empleado();
      this.comun.loading = true;
      this.enterPresionadoBuscar = true;
      this.buscar();
      this.comun.preventDefault(event);
    }
  }

  /**
   * Elimina el empleado seleccionado de la lista de destinatarios
   * @param seleccionado Número de empleado seleccionado
   */
  eliminarSeleccionado(seleccionado) {
    for (let i = 0; i < this.notificacion.lstEmpleados.length; i++) {
      if (this.notificacion.lstEmpleados[i] === seleccionado) {
        this.notificacion.lstEmpleados.splice(i, 1);
      }
    }
  }

  /**
   * Previene el envio de formulario
   * @param event Key presionada
   */
  prevenirDefault(event) {
    if (event.key === 'Enter') {
      this.comun.preventDefault(event);
    }
  }

  /**
   * Limpia la lista de destinatarios
   */
  limpiaDestinos(): void {
    this.notificacion.lstEmpleados = [];
  }

  /**
   * Función adjunto al evento (change) que detecta el archivo elegido para poder realizar operaciones conn el
   * @param event Archivo eledigo
   */
  archivoSeleccionado(event) {
    if (event.target.files.length > 0) {
      this.limpiaDestinos();
      this.file = event.target.files[0];
      if (this.file !== undefined && this.file.name !== undefined) {
        if (!this.validaFormatoArchivo(this.file)) {
          this.comun.creaAlerta(1, this.comun.RECURSOS.NOTIFICACION.msjArchivoNoExcel,
            this.comun.RECURSOS.NOTIFICACION.headerFormatoNoValido);
          return;
        }
      }
      this.comun.loading = true;
      this.upload();
    }
  }

  /**
   * Sube el archivo y realiza las validaciones y operaciones necesarias para poder obtener la información que contiene
   */
  upload() {
    this.cargaDestinosArchivo = true;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const info: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      info.forEach(empleado => {
        if (empleado.numero !== undefined) {
          const agregar = this.existeEnDestinos(empleado.numero.toString());
          if (agregar) {
            this.agregarDestinatario(empleado.numero);
          }
        } else {
          this.comun.creaAlerta(3, this.comun.RECURSOS.NOTIFICACION.msjFormatoIncorrecto,
            this.comun.RECURSOS.NOTIFICACION.headerFormatoNoValido);
          this.comun.cancelarCarga();
        }
      });
      this.comun.loading = false;
    };
    fileReader.readAsArrayBuffer(this.file);
    this.file = new File([], '');
  }

  /**
   * Agrega el elemento en la lista
   * @param numeroEmpleado Valor a agregar
   */
  agregarDestinatario(numeroEmpleado) {
    if (numeroEmpleado !== undefined && numeroEmpleado !== null && numeroEmpleado.toString().trim() !== '') {
      this.agregar = this.existeEnDestinos(numeroEmpleado);
      if (this.agregar) {
        if (this.empleado.length > 0 && (this.enterPresionadoBuscar || this.cargaDestinosArchivo) &&
          this.empleadosBuscar.empleados.length > 0) {
          this.notificacion.lstEmpleados.push(numeroEmpleado.toString().trim());
          this.empleado = '';
        }
      } else {
        this.empleado = '';
        this.comun.loading = false;
        this.empleadosBuscar.empleados = [];
        return;
      }
    }
  }

  /**
   * Valida si em valor a agregar ya esta agregado en la lista
   * @param valorBuscar Valor a buscar en la lista
   * @returns Retorna un booleano
   */
  existeEnDestinos(valorBuscar): boolean {
    if (this.notificacion.lstEmpleados.includes(valorBuscar)) {
      return false;
    }
    return true;
  }

  /**
   * Valida si la extensión del archivo es correcta
   * @param archivo Archivo que se ha elegido para ser leído
   * @returns Retorna un booleano
   */
  validaFormatoArchivo(archivo: File): boolean {
    const ext = archivo.name.substring(archivo.name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() === 'xlsx' && archivo.size <= 5000000) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Limpia los valores del formulario y los valores usados en el proceso de envío
   */
  resetearFormulario() {
    this.notificacionForm.resetForm();
    this.notificacion = new NotificacionRequest();
    this.empleadosBuscar = EmpleadosResponse.empleado();
  }
}
