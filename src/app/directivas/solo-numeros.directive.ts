import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * Directiva que solo permite números en las cajas de texto
 */
@Directive({
  selector: '[appSoloNumeros]'
})
export class SoloNumerosDirective {

  /**
   * Expresion regular a evaluar
   */
  private regex: RegExp = new RegExp(/^\d+$/);
  /**
   * Keys speciales que no permiten
   */
  private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home' ];
  /**
   * Crea el objeto del elemento a referir
   * @param el ElementRef
   */
  constructor(private el: ElementRef) { }

  /**
   * Valor de entrada
   */
  @Input() soloNumeros: number;

  /**
   * Evento a escuchar que es cuando se presiona una tecla
   * @param event Evento a escuchar
   */
  @HostListener('keydown', [ '$event' ])
  /**
   * Cuando se presiona la techa se evalua contra la expresión regular
   */
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const current: string = this.el.nativeElement.value;

    const next: string = current.concat(event.key);

    this.soloNumeros === undefined ? 0 : this.soloNumeros;

    if (next.length > this.soloNumeros) {
      event.preventDefault();
    }

    if (next && !String(next).match(this.regex)) {
        event.preventDefault();
    }
  }
}
