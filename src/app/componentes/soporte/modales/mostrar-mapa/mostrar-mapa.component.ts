import { Component, Input, HostListener } from '@angular/core';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;

@Component({
  selector: 'app-mostrar-mapa',
  templateUrl: './mostrar-mapa.component.html'
})
export class MostrarMapaComponent {

  /**
   * Contiene la configuración de la modal
   */
  @Input() settings;
  /**
   * Modal actual
   */
  public modal;
  latitud: number;
  longitud: number;
  nombrePosicion: string;

  constructor(public comun: DatosComunesService) { }

  /**
   * Muestra la modal
   * @param idModal Id de la modal que se desea abrir
   * @param latitud Latitud de la ubicacion
   * @param longitud Longitus de la posicion
   */
  public showModal(idModal, latitud, longitud, nombre) {
    this.comun.modalPosicionAbierta = true;
    if (latitud !== undefined && longitud !== null) {
      this.modal = $('#' + idModal).modal();
      this.latitud = latitud;
      this.longitud = longitud;
      this.nombrePosicion = nombre;
    }
  }

  /**
   * Cierra la modal actual y resetea los valores actuales
   */
  public closeModal() {
    this.modal.close();
    this.comun.modalMapaAbierta = false;
  }

  /**
   * Valida si la modal esta abierta cuando se presiona el boton de atras/adelante del navegador, de serlo la cierra
   */
  @HostListener('window:popstate') cerrarModalActiva() {
    if (this.comun.modalMapaAbierta) {
      this.closeModal();
    }
  }
}
