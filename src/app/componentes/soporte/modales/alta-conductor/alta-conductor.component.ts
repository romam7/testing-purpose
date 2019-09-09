import { Component, Input, Output, EventEmitter, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
import { Subscription } from 'rxjs';
import { ConductorRequest } from 'src/app/modelos/requests/conductor.request';
import { CabeceroRequest } from 'src/app/modelos/requests/cabecero.request';
import { EmpleadosResponse } from 'src/app/modelos/responses/empleados.response';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;

@Component({
  selector: 'app-alta-conductor',
  templateUrl: './alta-conductor.component.html'
})
export class AltaConductorComponent {
  /**
   * Contiene la configuración de la modal
   */
  @Input() settings;
  /**
   * Se desencadena cuando se da ok a la modal
   */
  @Output() okFunction = new EventEmitter();
  /**
   * Objeto de la modal actual
   */
  public modal;

  /**
   * Catalogo de empleados obtenidos de la búsqueda
   */
  empleadosBuscar: EmpleadosResponse = EmpleadosResponse.empleado();
  /**
   * Mensaje que se muestra cuando no se encuentra el empleado
   */
  mensajeNoEncontrado = '';
  /**
   * Indica si se presionó la tecla enter para buscar
   */
  buscoEmpleado = false;
  /**
   * Intervalo que contiene el valor del timeOut
   */
  intervalo: any;
  /**
   * Texto que indica la carga de información
   */
  cargandoTexto = this.comun.RECURSOS.COMUNES.textoBuscando;
  /**
   * ViewChild que corresponde a la modal de carga
   */
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  /**
   * Toma la subscripción al servicio que se va a consumir
   */
  suscriptor: Subscription;
  /**
   * Control del formulario
   */
  numeroEmpleadoControl = 'idEmpleado';

  /**
   * Conforma todos los campos que se encuentran en el formulario
   */
  conductorFormGroup: FormGroup = this.formBuilder.group({
    idEmpleado: ['', Validators.required],
    noLicencia: ['', [Validators.required, this.comun.remueveEspaciosFormGroup]],
    vigencia: ['', Validators.required],
    estatusConductor: ['', Validators.required]
  });
  /**
   * Arreglo con los estatus de los conductores
   */
  estatusConductores = [
    {
      idEstatus: 1,
      descripcion: 'Activo'
    },
    {
      idEstatus: 3,
      descripcion: 'Inactivo'
    }
  ];

  constructor(
    private empleadoService: EmpleadoService,
    private formBuilder: FormBuilder,
    public comun: DatosComunesService) { }

  onSelectConductor(conductor) {
    if (conductor !== '' || conductor !== undefined) {
      const datos = this.empleadosBuscar.empleados.filter(x => x.numeroEmpleado === conductor)[0];
      if (datos !== undefined && datos !== null) {
        this.conductorFormGroup.controls[this.numeroEmpleadoControl].setValue(datos.numeroEmpleado);
      }
      this.mensajeNoEncontrado = '';
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
      this.buscarEmpleado();
      this.comun.preventDefault(event);
    }
  }

  /**
   * Busca al empleado jefe
   */
  public buscarEmpleado() {
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
    let empleadoABuscar = this.conductorFormGroup.controls[this.numeroEmpleadoControl].value;
    if (empleadoABuscar !== undefined && empleadoABuscar !== '' && empleadoABuscar !== null) {
      if (empleadoABuscar.trim() !== '') {
        this.comun.loading = true;
        this.conductorFormGroup.get(this.numeroEmpleadoControl).disable();
        this.intervalo = setTimeout(() => {
          this.cargandoTexto = this.comun.RECURSOS.COMUNES.demoraEnCarga;
          this.comun.validaCargando(this.customLoadingTemplate);
        }, 5000);

        this.suscriptor = this.empleadoService.filtrarEmpleados(this.comun.asignaValorRequestGenerico(empleadoABuscar)).subscribe(
          response => {
            if (response.cabResponse !== undefined && response.empleados !== undefined) {
              if (response.cabResponse.codResponse === 0 && response.empleados.length > 0) {
                for (const empleado of response.empleados) {
                  if (empleado.estatus === 1) {
                    this.empleadosBuscar.empleados.push(empleado);
                  }
                }
                this.conductorFormGroup.controls[this.numeroEmpleadoControl].setValue(empleadoABuscar);
              }
              if (response.cabResponse.codResponse === -1) {
                this.mensajeNoEncontrado = this.comun.RECURSOS.COMUNES.sinCoincidencias;
              }
              this.comun.validaCertificado(response.cabResponse.codResponse, this.modal);
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
      this.conductorFormGroup.get(this.numeroEmpleadoControl).enable();
    }
  }

  /**
   * Cierra la modal actual
   */
  public closeModal() {
    this.modal.close();
    this.comun.loading = false;
    this.comun.modalAltaConductorAbierta = false;
    this.conductorFormGroup.reset();
    this.empleadosBuscar = EmpleadosResponse.empleado();
    this.buscoEmpleado = false;
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
  }

  /**
   * Muestra la modal
   * @param idModal Id de la modal a mostrar
   */
  public showModal(idModal) {
    this.comun.modalAltaConductorAbierta = true;
    this.modal = $('#' + idModal).modal();
  }

  registrarConductor() {
    this.comun.loading = true;
    const conductor: ConductorRequest = Object.assign({}, this.conductorFormGroup.value);
    conductor.cabRequest = CabeceroRequest.cabeceroRequest();
    conductor.cabRequest = this.comun.asignaValorRequest(conductor.cabRequest);

    if ((conductor.idEmpleado === '' || conductor.idEmpleado === undefined) ||
      (!this.buscoEmpleado && this.empleadosBuscar.empleados.length === 0) || this.empleadosBuscar.empleados.length === 0) {
      this.comun.creaAlerta(1, this.comun.RECURSOS.TRANSPORTE.sinNumeroEmpleado, this.comun.RECURSOS.TRANSPORTE.headerBuscaEmpleado);
      conductor.idEmpleado = '';
      this.comun.loading = false;
      return;
    } else {
      this.empleadoService.guardarNuevoConductor(conductor).subscribe(
        response => {
          if (response && response.codResponse !== undefined) {
            if (response.codResponse === 0) {
              this.conductorFormGroup.reset();
              this.comun.creaAlerta(1, this.comun.RECURSOS.TRANSPORTE.msjConductorCreado,
                this.comun.RECURSOS.COMUNES.headerRegistroOK);
              this.empleadoService.notificarCambio.emit(conductor);
              this.okFunction.emit({ conductorEditado: conductor.idEmpleado });
              this.closeModal();
              this.empleadosBuscar = EmpleadosResponse.empleado();
            }
            if (response.codResponse === -1) {
              this.comun.creaAlerta(3, this.comun.RECURSOS.TRANSPORTE.msjErrorIntentoRegistro,
                this.comun.RECURSOS.COMUNES.headerErrorServicio);
            }
            this.comun.validaCertificado(response.codResponse, this.modal);
          } else {
            this.comun.creaAlerta(3, this.comun.RECURSOS.TRANSPORTE.msjErrorIntentoRegistro,
              this.comun.RECURSOS.COMUNES.headerErrorServicio);
          }
          this.comun.loading = false;
        }, error => {
          this.comun.loading = false;
          this.comun.creaAlerta(3, this.comun.RECURSOS.TRANSPORTE.msjErrorIntentoRegistro,
            this.comun.RECURSOS.COMUNES.headerErrorServicio);
        }
      );
    }
  }

  /**
   * Valida si la modal esta abierta cuando se presiona el boton de atras/adelante del navegador, de serlo la cierra
   */
  @HostListener('window:popstate') cerrarModalActiva() {
    if (this.comun.modalAltaConductorAbierta) {
      this.closeModal();
    }
  }

}
