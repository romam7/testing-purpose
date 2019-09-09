import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea la fecha
 */
@Pipe({
  name: 'formatoFecha'
})
export class FormatoFechaPipe implements PipeTransform {

  /**
   * Tranforma la fecha en un formato en especifico
   */
  transform(fecha: string): string {
    if (fecha === undefined) {
      return '';
    }
    if (fecha.length <= 1) {
      return '';
    }
    const fechaSeparada = fecha.split(' de ');
    const mes = fechaSeparada[1].charAt(0).toUpperCase() + fechaSeparada[1].slice(1);
    return fechaSeparada[0] + '/' + mes + '/' + fechaSeparada[2];
  }
}
