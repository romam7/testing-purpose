import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { EmpleadoResponse } from 'src/app/modelos/responses/empleado.response';
import { EmpleadoRequest } from 'src/app/modelos/requests/empleado.request';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
import { CatalogoEmpresasResponse } from 'src/app/modelos/responses/catalogo.empresas.response';
import { EmpleadosResponse } from 'src/app/modelos/responses/empleados.response';
import { FotoRequest } from 'src/app/modelos/requests/foto.request';
import { DomSanitizer } from '@angular/platform-browser';
import { HeaderComponent } from '../../../estructura/header/header.component';
import { Subscription } from 'rxjs';
import { CabeceroRequest } from 'src/app/modelos/requests/cabecero.request';
import { Empleado } from 'src/app/modelos/modelos/empleado';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;

/**
 * Componente que pertenece a la modal de edición de información
 */
@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  providers: [HeaderComponent]
})
export class EditarUsuarioComponent {

  /**
   * Configuiración de la modal actual
   */
  @Input() settings;
  /**
   * Output que enviará información de regreso cuando el empleado sea editado
   */
  @Output() okFunction = new EventEmitter();

  /**
   * Conforma todos los campos que se encuentran en el formulario
   */
  empleadoFormGroup: FormGroup = this.formBuilder.group({
    idEmpleado: ['', Validators.required],
    nombre: ['', [Validators.required, this.comun.remueveEspaciosFormGroup]],
    numeroTelefono: ['', Validators.required],
    puesto: ['', [Validators.required, this.comun.remueveEspaciosFormGroup]],
    idEmpresa: ['', Validators.required],
    ceco: ['', Validators.required],
    idSupervisor: ['', [Validators.required, this.comun.remueveEspaciosFormGroup]],
    perfil: ['', Validators.required]
  });

  /**
   * Almacena el catalogo de empresas
   */
  empresasPadre: CatalogoEmpresasResponse = CatalogoEmpresasResponse.empresaResponse();
  /**
   * Nombre del control (input)
   */
  controlSupervisor = 'idSupervisor';
  /**
   * Texto que indica la carga de información
   */
  cargandoTexto = this.comun.RECURSOS.COMUNES.textoBuscando;
  /**
   * Modal actual
   */
  public modalUser;
  /**
   * Empleado elegido para editar
   */
  empleadoElegido: any;
  /**
   * Request para la foto del empleado
   */
  fotoRequest: FotoRequest = FotoRequest.fotoRequest();
  /**
   * Foto obtenida del servicio
   */
  fotoEmpleado: any;
  /**
   * Detecta si se busco empleado
   */
  buscoEmpleado = false;
  /**
   * Mensaje que se muestra cuando no se encuentra el empleado
   */
  mensajeNoEncontrado = '';
  /**
   * Catalogo de empleados obtenidos de la búsqueda
   */
  empleadosBuscar: EmpleadosResponse = EmpleadosResponse.empleado();
  /**
   * ViewChild que corresponde a la modal de carga
   */
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  /**
   * Toma la subscripción al servicio que se va a consumir
   */
  suscriptor: Subscription;
  /**
   * Intervalo que contiene el valor del timeOut
   */
  intervalo: any;
  /**
   * Arreglo con los 2 perfiles posibles
   */
  perfiles = [
    { id: 0, nombre: 'Corporativo' },
    { id: 1, nombre: 'Geografía' }
  ];
  /**
   * Permite saber si de la lista desplega se ha elegido un elemento
   */
  seleccionoJefe = false;

  /**
   * Crea los objetos para el funcionamimiento del componente
   * @param empleadoService Servicio que contiene todas las funciones para obtener información del back
   * @param formBuilder Objeto que contruye los inputs del formulario
   * @param comun Clase que contiene informcación compartida en todo el proyecto
   * @param sanitizer Crea una forma segura de objeter la foto del empleado
   * @param header Componente del header que será utilizado para cerrar el toggle despleglado
   * @param app Objeto del componente AppComponent, el cuál se usará para estar continuamente validando la inactividad
   */
  constructor(
    private empleadoService: EmpleadoService,
    private formBuilder: FormBuilder,
    public comun: DatosComunesService,
    private sanitizer: DomSanitizer,
    private header: HeaderComponent) { }

  /**
   * Cierra la modal actual y resetea los valores actuales
   */
  public closeModal() {
    this.modalUser.close();
    this.empleadoFormGroup.reset();
    this.empleadosBuscar = EmpleadosResponse.empleado();
    this.fotoEmpleado = null;
    this.buscoEmpleado = false;
    this.comun.modalEditarAbierta = false;
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
  }

  /**
   * Muestra la modal
   * @param idModal Id de la modal que se desea abrir
   * @param empleado Objeto que tiene toda la información del empleado a editar
   */
  public showModal(idModal, empleado) {
    this.modalUser = $('#' + idModal).modal();
    this.empleadoElegido = empleado;
    this.inicializarValores();
  }

  /**
   * Inicializa los valores para el componente
   */
  inicializarValores() {
    this.comun.modalEditarAbierta = true;
    this.obtenerEmpresas();
    this.validaOperacion();
  }

  /**
   * Si el empleado elegido existe entonces configura la modal con los valores
   */
  private validaOperacion() {
    this.comun.loading = true;
    if (this.empleadoElegido) {
      if (this.comun.obtenerDatosSesion()) {
        const EMPLEADO = JSON.parse(this.comun.obtenerDatosSesion());
        if (this.empleadoElegido.numeroEmpleado === EMPLEADO.numeroEmpleado && this.comun.obtieneFotoLocal() !== null) {
          this.fotoEmpleado = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.comun.obtieneFotoLocal());
        } else {
          this.comun.asignaCabeceroFoto(this.fotoRequest, this.empleadoElegido);
          this.empleadoService.obtenerFotoEmpleado(this.fotoRequest).subscribe(
            fotoResponse => {
              if (fotoResponse.cabResponse !== undefined) {
                if (fotoResponse.cabResponse.codResponse === 0) {
                  this.fotoEmpleado = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + fotoResponse.foto);
                }
                this.comun.validaCertificado(fotoResponse.cabResponse.codResponse, this.modalUser);
              }
            }
          );
        }
      }
      this.mensajeNoEncontrado = '';
      this.cargarFormulario(this.empleadoElegido);
      this.comun.loading = false;
      // Se deshabilita el input con formControlName=idEmpleado para que el valor no se pueda editar.
      this.empleadoFormGroup.get('idEmpleado').disable();
    }
  }
  /**
   * Crea un objeto con todos los valores actuales para la actualización
   */
  actualizaDatosEmpleado() {
    const valores: EmpleadoRequest = Object.assign({}, this.empleadoFormGroup.getRawValue());
    valores.cabRequest = CabeceroRequest.cabeceroRequest();
    this.comun.asignaValorRequest(valores.cabRequest);
    this.comun.loading = true;
    this.actualizaEmpleado(valores);
  }

  /**
   * Actualiza los datos del empleado haciendo uso del servicio
   * @param valores Objeto formado con todos los datos del empleado
   */
  private actualizaEmpleado(valores: EmpleadoRequest) {
    /**
     * Cuando la lista solo carga un resultado y se da clic en actualizar pero no se ha seleccionado jefe entonces toma
     * el numeroEmpleado de ese unico elemento y lo asigna como jefe
     */
    if (this.empleadosBuscar.empleados.length === 1) {
      valores.idSupervisor = this.empleadosBuscar.empleados[0].numeroEmpleado;
      this.seleccionoJefe = true;
    } else if (this.empleadosBuscar.empleados.length > 1 && !this.seleccionoJefe) {
      /**
       * Cuando la lista tiene mas de un elemento y se da clic en actualizar pero sin elegir jefe entonces se manda la alerta
       */
      this.comun.creaAlerta(1, this.comun.RECURSOS.EDITAR_EMP.sinJefe, this.comun.RECURSOS.EDITAR_EMP.headerBuscaJefe);
      this.comun.loading = false;
      return;
    }

    // Esta asignación se realiza para que si el empleado elegido ya tiene un jefe no le pida seleccionar uno y lo deje guardar
    if (this.empleadoElegido.idSupervisor) {
      this.buscoEmpleado = true;
      this.seleccionoJefe = true;
      this.empleadosBuscar.empleados.push(Empleado.empleado());
    }

    if (!valores.idSupervisor || !this.buscoEmpleado || !this.seleccionoJefe || this.empleadosBuscar.empleados.length === 0) {
      this.comun.creaAlerta(1, this.comun.RECURSOS.EDITAR_EMP.sinJefe, this.comun.RECURSOS.EDITAR_EMP.headerBuscaJefe);
      this.comun.loading = false;
      return;
    } else {
      this.empleadoService.actualizarEmpleado(valores).subscribe(
        empleado => {
          if (empleado && empleado.codResponse !== undefined) {
            if (empleado.codResponse === 0) {
              this.empleadoFormGroup.reset();
              this.comun.creaAlerta(1, this.comun.RECURSOS.EDITAR_EMP.msjDatosActualizados,
                this.comun.RECURSOS.EDITAR_EMP.headerActualizacionOK);
              this.empleadoService.notificarCambio.emit(valores);
              this.okFunction.emit({ empleadoEditado: valores.idEmpleado });
              this.closeModal();
              this.empleadosBuscar = EmpleadosResponse.empleado();
            }
            if (empleado.codResponse === -1) {
              this.comun.creaAlerta(3, this.comun.RECURSOS.EDITAR_EMP.msjErrorIntentoActualizar,
                this.comun.RECURSOS.COMUNES.headerErrorServicio);
            }
            this.comun.validaCertificado(empleado.codResponse, this.modalUser);
          } else {
            this.comun.creaAlerta(3, this.comun.RECURSOS.EDITAR_EMP.msjErrorIntentoActualizar,
              this.comun.RECURSOS.COMUNES.headerErrorServicio);
          }
        }, error => {
          this.comun.creaAlerta(3, this.comun.RECURSOS.EDITAR_EMP.msjErrorIntentoActualizar,
            this.comun.RECURSOS.COMUNES.headerErrorServicio);
        }
      );
      this.comun.loading = false;
    }
  }

  /**
   * Función que se llama cuando se desea editar un empleado, este llena el formulario con los datos del empleado seleccionado.
   * @param empleado Objeto que contiene la información del empleado
   */
  cargarFormulario(empleado: EmpleadoResponse) {
    this.empleadoFormGroup.patchValue(
      {
        idEmpleado: (empleado.numeroEmpleado !== null) ? empleado.numeroEmpleado.trim() : '',
        nombre: (empleado.nombre !== null) ? empleado.nombre.trim() : '',
        numeroTelefono: (empleado.numeroTelefono !== null) ? empleado.numeroTelefono : '',
        puesto: (empleado.puesto !== null) ? empleado.puesto.trim() : '',
        idEmpresa: empleado.idEmpresa,
        ceco: empleado.ceco,
        idSupervisor: empleado.idSupervisor,
        perfil: empleado.idPerfil
      }
    );
  }

  /**
   * Obtiene las empresas validando si ya existen en el objeto global de lo contrario las obtiene usando el servicio.
   */
  obtenerEmpresas() {
    if (this.comun.empresasPadre.empresas.length > 0) {
      this.empresasPadre.empresas = this.comun.empresasPadre.empresas;
    } else {
      this.empresasPadre = this.header.obtenerEmpresas();
    }
  }

  /**
   * Busca al empleado jefe
   */
  public buscar() {
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
    let empleadoABuscar = this.empleadoFormGroup.controls[this.controlSupervisor].value;
    if (empleadoABuscar !== undefined && empleadoABuscar !== '' && empleadoABuscar !== null) {
      if (empleadoABuscar.trim() !== '') {
        this.comun.loading = true;
        this.empleadoFormGroup.get(this.controlSupervisor).disable();
        this.intervalo = setTimeout(() => {
          this.cargandoTexto = this.comun.RECURSOS.COMUNES.demoraEnCarga;
          this.comun.validaCargando(this.customLoadingTemplate);
        }, 5000);

        this.suscriptor = this.empleadoService.filtrarEmpleados(this.comun.asignaValorRequestGenerico(empleadoABuscar.trim())).subscribe(
          response => {
            if (response.cabResponse !== undefined && response.empleados !== undefined) {
              if (response.cabResponse.codResponse === 0 && response.empleados.length > 0) {
                for (const empleado of response.empleados) {
                  if (empleado.estatus === 1) {
                    this.empleadosBuscar.empleados.push(empleado);
                  }
                }
                this.empleadoFormGroup.controls[this.controlSupervisor].setValue(empleadoABuscar.trim());
              }
              if (response.cabResponse.codResponse === -1) {
                this.mensajeNoEncontrado = this.comun.RECURSOS.COMUNES.sinCoincidencias;
              }
              this.comun.validaCertificado(response.cabResponse.codResponse, this.modalUser);
            } else {
              this.mensajeNoEncontrado = this.comun.RECURSOS.COMUNES.sinCoincidencias;
              empleadoABuscar = '';
              this.empleadosBuscar.empleados = [];
            }
            this.comun.loading = false;
            clearTimeout(this.intervalo);
            this.comun.loadingTemplate = null;
          },
          error => {
            this.mensajeNoEncontrado = this.comun.RECURSOS.COMUNES.sinCoincidencias;
            this.comun.loading = false;
            clearTimeout(this.intervalo);
            this.comun.loadingTemplate = null;
          }
        );
      }
      this.empleadoFormGroup.get(this.controlSupervisor).enable();
    }
  }

  /**
   * Detecta la key presionada, si fue enter se comienza la búsqueda del empleado
   * @param event  Key presionada
   */
  onKeydown(event) {
    if (event.key === 'Enter') {
      this.buscoEmpleado = true;
      this.mensajeNoEncontrado = '';
      this.empleadosBuscar = EmpleadosResponse.empleado();
      this.buscar();
      this.comun.preventDefault(event);
    }
  }

  /**
   * Asigna el empleado elegido como jefe del empleado a editar
   * @param empleado Objeto del empleado listado en el combo
   */
  onSelectEmpleado(empleado) {
    if (empleado !== '' || empleado !== undefined) {
      const datos = this.empleadosBuscar.empleados.filter(x => x.nombre === empleado)[0] ?
      this.empleadosBuscar.empleados.filter(x => x.nombre === empleado)[0] :
      this.empleadosBuscar.empleados.filter(x => x.numeroEmpleado === empleado)[0];
      if (datos !== undefined && datos !== null) {
        this.empleadoFormGroup.controls[this.controlSupervisor].setValue(datos.numeroEmpleado);
        this.seleccionoJefe = true;
      }
      this.mensajeNoEncontrado = '';
    }
  }

  /**
   * Valida si la modal esta abierta cuando se presiona el boton de atras/adelante del navegador, de serlo la cierra
   */
  @HostListener('window:popstate') cerrarModalActiva() {
    if (this.comun.modalEditarAbierta) {
      this.closeModal();
    }
  }
}
