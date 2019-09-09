import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PosicionValidaRequest } from 'src/app/modelos/requests/posicion.valida.request';
import { CabeceroRequest } from 'src/app/modelos/requests/cabecero.request';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { PosicionValida } from 'src/app/modelos/modelos/posicion.valida';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;
@Component({
  selector: 'app-alta-posicion-valida',
  templateUrl: './alta-posicion-valida.component.html'
})
export class AltaPosicionValidaComponent {
  /**
   * Contiene la configuración de la modal
   */
  @Input() settings;
  /**
   * Se desencadena cuando se da ok a la modal
   */
  @Output() okFunction = new EventEmitter();
  /**
   * Modal actual
   */
  public modal;
  /**
   * Empleado elegido para editar
   */
  posicionElegida: PosicionValida = PosicionValida.posicion();
  /**
   * Intervalo que contiene el valor del timeOut
   */
  intervalo: any;
  /**
   * Conforma todos los campos que se encuentran en el formulario
   */
  posicionFormGroup: FormGroup = this.formBuilder.group({
    numeroPosicion: [''],
    nombrePosicion: ['', [Validators.required, this.comun.remueveEspaciosFormGroup]],
    latitud: ['', Validators.required],
    longitud: ['', Validators.required],
    rangoAceptado: ['', Validators.required],
  });

  constructor(
    public comun: DatosComunesService,
    private formBuilder: FormBuilder,
    private empleadoService: EmpleadoService) { }
  /**
   * Muestra la modal
   * @param idModal Id de la modal que se desea abrir
   * @param empleado Objeto que tiene toda la información del empleado a editar
   */
  public showModal(idModal, posicion?) {
    this.comun.modalPosicionAbierta = true;
    this.modal = $('#' + idModal).modal();
    if (posicion !== undefined && posicion !== null) {
      this.posicionElegida = posicion;
      this.cargarFormulario(posicion);
    }
  }

  /**
   * Función que se llama cuando se desea editar un empleado, este llena el formulario con los datos del empleado seleccionado.
   * @param empleado Objeto que contiene la información del empleado
   */
  cargarFormulario(posicion) {
    this.posicionFormGroup.patchValue(
      {
        numeroPosicion: posicion.numeroPosicion,
        nombrePosicion: posicion.nombrePosicion,
        latitud: posicion.latitud,
        longitud: posicion.longitud,
        rangoAceptado: posicion.rangoAceptado,
      }
    );

    if (posicion.numeroPosicion !== '' && posicion.numeroPosicion !== undefined) {
      this.posicionFormGroup.controls.numeroPosicion.disable();
    }
  }

  /**
   * Cierra la modal actual y resetea los valores actuales
   */
  public closeModal() {
    this.modal.close();
    this.posicionFormGroup.reset();
    clearTimeout(this.intervalo);
    this.comun.modalPosicionAbierta = false;
    this.comun.loadingTemplate = null;
  }

  registraActualizaPosicion() {
    this.comun.loading = true;
    const posicionValida: PosicionValidaRequest = Object.assign({}, this.posicionFormGroup.getRawValue());
    posicionValida.cabRequest = CabeceroRequest.cabeceroRequest();
    posicionValida.cabRequest = this.comun.asignaValorRequest(posicionValida.cabRequest);

    if (this.posicionElegida.numeroPosicion !== '' && this.posicionElegida.numeroPosicion !== undefined) {
      this.actualizaPosicion(posicionValida);
    } else {
      this.guardaNuevaPosicion(posicionValida);
    }
  }

  actualizaPosicion(posicionValida) {
    if (posicionValida.latitud === 0 || posicionValida.longitud === 0) {
      this.comun.creaAlerta(1, this.comun.RECURSOS.UBICACIONES.msCamposInvalidos, this.comun.RECURSOS.UBICACIONES.headerCamposInvalidos);
      this.comun.loading = false;
      return;
    } else {
      this.empleadoService.actualizaPosicionValida(posicionValida).subscribe(
        response => {
          if (response && response.codResponse !== undefined) {
            if (response.codResponse === 0) {
              this.posicionFormGroup.reset();
              this.comun.creaAlerta(1, this.comun.RECURSOS.UBICACIONES.msjUbicacionActualizada,
                this.comun.RECURSOS.COMUNES.headerActualizacionOK);
              this.empleadoService.notificarCambio.emit(posicionValida);
              this.okFunction.emit({ posicionEditada: posicionValida.numeroPosicion });
              this.closeModal();
            }
            if (response.codResponse === -1) {
              this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio,
                this.comun.RECURSOS.COMUNES.headerErrorServicio);
            }
            this.comun.validaCertificado(response.codResponse, this.modal);
          } else {
            this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio,
              this.comun.RECURSOS.COMUNES.headerErrorServicio);
          }
          this.comun.loading = false;
        }, error => {
          this.comun.loading = false;
          this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio,
            this.comun.RECURSOS.COMUNES.headerErrorServicio);
        }
      );
    }
  }

  guardaNuevaPosicion(posicionValida: PosicionValidaRequest) {
    if (posicionValida.latitud === 0 || posicionValida.longitud === 0) {
      this.comun.creaAlerta(1, this.comun.RECURSOS.UBICACIONES.msCamposInvalidos, this.comun.RECURSOS.UBICACIONES.headerCamposInvalidos);
      this.comun.loading = false;
      return;
    } else {
      this.empleadoService.registraNuevaPosicionValida(posicionValida).subscribe(
        response => {
          if (response && response.codResponse !== undefined) {
            if (response.codResponse === 0) {
              this.posicionFormGroup.reset();
              this.comun.creaAlerta(1, this.comun.RECURSOS.UBICACIONES.msjUbicacionCreada,
                this.comun.RECURSOS.COMUNES.headerRegistroOK);
              this.empleadoService.notificarCambio.emit(posicionValida);
              this.okFunction.emit({ posicionEditada: posicionValida.numeroPosicion });
              this.closeModal();
            }
            if (response.codResponse === -1) {
              this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio,
                this.comun.RECURSOS.COMUNES.headerErrorServicio);
            }
            this.comun.validaCertificado(response.codResponse, this.modal);
          } else {
            this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio,
              this.comun.RECURSOS.COMUNES.headerErrorServicio);
          }
          this.comun.loading = false;
        }, error => {
          this.comun.loading = false;
          this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio,
            this.comun.RECURSOS.COMUNES.headerErrorServicio);
        }
      );
    }
  }

  /**
   * Valida si la modal esta abierta cuando se presiona el boton de atras/adelante del navegador, de serlo la cierra
   */
  @HostListener('window:popstate') cerrarModalActiva() {
    if (this.comun.modalPosicionAbierta) {
      this.closeModal();
    }
  }
}
