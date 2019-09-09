import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;

/**
 * Componente que pertenece a la modal de reactivación/desactivación del empleado
 */
@Component({
  selector: 'app-reactiva-desactiva-usuario',
  templateUrl: './reactiva-desactiva-usuario.component.html'
})
export class ReactivarDesactivarUsuarioComponent {

  /**
   * Contiene la configuración de la modal
   */
  @Input() settings;
  /**
   * Se desencadena cuando se da ok a la modal
   */
  @Output() okFunction = new EventEmitter();
  /**
   * Se desencadena cuando se da cancel a la modal
   */
  @Output() cancelFunction = new EventEmitter();
  /**
   * Objeto de la modal actual
   */
  public modal;

  /**
   * @param comun Objeto del servicio de datos comunes
   */
  constructor(private comun: DatosComunesService) { }

  /**
   * Cierra la modal actual
   */
  public closeModal() {
    this.modal.close();
    this.comun.modalReactivacionAbierta = false;
  }

  /**
   * Muestra la modal
   * @param idModal Id de la modal a mostrar
   */
  public showModal(idModal) {
    this.comun.modalReactivacionAbierta = true;
    this.modal = $('#' + idModal).modal();
  }

  /**
   * Envia una respuesta a la ventana principal
   */
  public aceptar() {
    this.okFunction.emit();
    this.closeModal();
  }

  /**
   * Cierra la modal actual
   */
  public cancelar() {
    this.cancelFunction.emit();
    this.closeModal();
  }

  /**
   * Valida si la modal esta abierta cuando se presiona el boton de atras/adelante del navegador, de serlo la cierra
   */
  @HostListener('window:popstate') cerrarModalActiva() {
    if (this.comun.modalReactivacionAbierta) {
      this.closeModal();
    }
  }
}
