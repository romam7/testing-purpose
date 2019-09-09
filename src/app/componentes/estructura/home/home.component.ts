import { Component, OnInit } from '@angular/core';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
import { HeaderComponent } from '../header/header.component';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;
/**
 * Componente para la página de home
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../../../assets/css/bootstrap.min.css'],
  providers: [HeaderComponent]
})
export class HomeComponent implements OnInit {
  paramAccessToken = 'access_token=';

  /**
   * Crea el objeto de la clase común a usar
   * @param comun Objeto de la clase de datos comunes
   */
  constructor(public comun: DatosComunesService, private header: HeaderComponent) {
    /**
     * Temporal mientras se establece el proceso para obtener el certificado de ApiGee, si este codigo se deja, la sesión
     * nunca se va a cerrar ya que al redirigir al home se detectará la ruta '' y se le agregará el parámetro por lo que será un ciclo
     */
    /*this.router.navigate([''], {
      queryParams: {
        access_token: 'Z07RJQ2kVPcmILW4p9xbfpyQKAsM'
      }
    });*/
  }

  /**
   * Usa el objeto creado de la clase común para asignar título a la página actual
   */
  ngOnInit() {
    $('.contConfig').hide();
    this.comun.tituloPagina = 'Aprende a usar Socio MAS';

    // window.location.hash.substr(1).split(this.paramAccessToken)[1].split('&')[0]
    const url = location.href.split('#')[1];
    if (url !== undefined) {
      const params = url.split('&')[0];
      const token = params.split(this.paramAccessToken)[1];
      if (token) {
        this.header.login();
      }
    }
  }
}
