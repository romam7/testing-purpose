import { Component, OnInit } from '@angular/core';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;
/**
 * Componente de la página de preguntas frequentes
 */
@Component({
  selector: 'app-preguntas-frequentes',
  templateUrl: './preguntas-frequentes.component.html',
  styleUrls: ['./preguntas-frequentes.component.css']
})
export class PreguntasFrequentesComponent implements OnInit {

  /**
   * Crea el objeto de la clase común a usar
   * @param comun Objeto de la clase de datos comunes
   */
  constructor(private comun: DatosComunesService) { }

  /**
   * Usa el objeto creado de la clase común para asignar título a la página actual
   */
  ngOnInit() {
    $('.contConfig').hide();
    this.comun.tituloPagina = 'Preguntas frequentes';
  }
}
