import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * Directiva que solo permite texto en los inputs
 */
@Directive({
  selector: '[appSoloTexto]'
})
export class SoloTextoDirective {

  /**
   * Expresion regular a evaluar
   */
  private regex: RegExp = new RegExp(/^[A-Za-zÁ-ÿ0-9 ñ]*$/);

  /**
   * Keys speciales que no permiten
   */
  private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home'];

  /**
   * Crea el objeto del elemento a referir
   * @param el ElementRef
   */
  constructor(private el: ElementRef) { }

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
    const next: string = this.el.nativeElement.value.concat(event.key);
    if (next && !String(next).match(this.regex)) {
        event.preventDefault();
    }
  }
}
