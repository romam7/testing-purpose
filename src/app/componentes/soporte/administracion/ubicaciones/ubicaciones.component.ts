import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { PosicionesValidasResponse } from 'src/app/modelos/responses/posiciones.validas.response';
import { AltaPosicionValidaComponent } from '../../modales/alta-posicion-valida/alta-posicion-valida.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;

/**
 * Componente para poder administrar los puntos de interés
 */
@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html'
})
export class UbicacionesComponent implements OnInit {
  /**
   * Setea la configuración que la modal modalAltaPosicion va a recibir (title, idModal)
   */
  configuracionAltaPosicion = {
    title: 'Registra una nueva posición',
    idModal: 'modalAltaPosicion',
    textoBoton: this.comun.RECURSOS.COMUNES.agregar
  };
  /**
   * Setea la configuración que la modal modalAltaPosicion va a recibir (title, idModal)
   */
  configuracionEditaPosicion = {
    title: 'Edita información de la posición',
    idModal: 'modalEditaPosicion',
    textoBoton: this.comun.RECURSOS.COMUNES.editar
  };
  /**
   * Arreglo de posicones
   */
  posicionesFiltro: PosicionesValidasResponse = PosicionesValidasResponse.posiciones();
  /**
   * ViewChild para la modal de alta una posicion
   */
  @ViewChild('altaPosicionModalViewChild', { static: false }) altaPosicionModalViewChild: AltaPosicionValidaComponent;
  /**
   * ViewChild para la modal de editar una posicion
   */
  @ViewChild('editaPosicionModalViewChild', { static: false }) editaPosicionModalViewChild: AltaPosicionValidaComponent;
  /**
   * Almacena el empleado editado para proceder con la detección de cambios
   */
  posicionEditada = '';
  /**
   * Servirá como helper para que almacene el numeroPos del elemento cuando se de clic
   * en desactivar/reactivar y así pasarlo como parámetro al modal.
   */
  posicionSeleccionada: any;
  /**
   * Intervalo de tiempo en el que se ejecutara el timeOut
   */
  intervalo: any;
  /**
   * Elemento usado para buscar a los conductores que coincidan con este filtro
   */
  filtro = '';
  /**
   * Texto que indica la carga de información
   */
  cargandoTexto = this.comun.RECURSOS.COMUNES.textoBuscando;
  /**
   * Toma la subscripción al servicio que se va a consumir
   */
  private suscriptor: Subscription;
  /**
   * ViewChild para la modal del customTemplate de cargando
   */
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;

  constructor(
    private empleadoService: EmpleadoService,
    public comun: DatosComunesService,
    private authService: AuthService) { }

  ngOnInit() {
    $('.contConfig').hide();
    if (this.authService.isAuthenticated()) {
      this.comun.tituloPagina = this.comun.RECURSOS.UBICACIONES.tagTitulo;
      this.detectaCambiosListado();
    } else {
      this.comun.redirigeAPrincipal();
    }
  }

  /**
   * Detecta los cambios que sufre un elemento de la lista y lo actualiza al momento
   */
  private detectaCambiosListado() {
    this.empleadoService.notificarCambio.subscribe(posicion => {
      this.posicionesFiltro.posiciones = this.posicionesFiltro.posiciones.map(posicionOriginal => {
        if (posicion.numeroPosicion === posicionOriginal.numeroPosicion) {
          posicionOriginal.nombrePosicion = posicion.nombrePosicion;
          posicionOriginal.latitud = posicion.latitud;
          posicionOriginal.longitud = posicion.longitud;
          posicionOriginal.rangoAceptado = posicion.rangoAceptado;
        }
        return posicionOriginal;
      });
    });
  }

  /**
   * Detecta el cambio en la página
   * @param event Pagina actual
   */
  pageChanged(event: any) {
    this.posicionEditada = '';
    this.comun.configPaginacion.currentPage = event;
  }

  /**
   * Detecta el empleado que ha sido editado y asigna valor a variable que se usa para asignar estilos a la fila editada
   */
  detectaPosicionEditada(event) {
    this.posicionEditada = event.posicionEditada;
  }

  /**
   * Muestra la modal de acuerdo al su id
   * @param idModal Corresponde al id de la modal que se desea abrir
   * @param posicion Objeto que se usa para la edición de datos, no requerido
   */
  public showModal(idModal: string, posicion?: any) {
    this.posicionEditada = '';
    $('.contConfig').hide();
    switch (idModal) {
      case 'modalEditaPosicion':
        this.posicionSeleccionada = posicion;
        this.editaPosicionModalViewChild.showModal('modalEditaPosicion', posicion);
        break;
      case 'modalAltaPosicion':
        this.altaPosicionModalViewChild.showModal('modalAltaPosicion');
        break;
    }
  }

  /**
   * Método que filtra los empleados por medio de un filtro inicial dado
   * @param event Key presionada (solo se valida si fue Enter)
   */
  buscarPosicion(event: any) {
    $('.contConfig').hide();
    this.posicionEditada = '';
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
    if (event.key === 'Enter') {
      this.posicionesFiltro.posiciones = [];
      if (this.filtro !== '' && this.filtro.length >= 4) {
        this.comun.loading = true;
        this.intervalo = setTimeout(() => {
          this.cargandoTexto = this.comun.RECURSOS.COMUNES.demoraEnCarga;
          this.comun.validaCargando(this.customLoadingTemplate);
        }, 10000);
        this.suscriptor = this.empleadoService.filtrarPosiciones(
          this.comun.asignaValorRequestGenerico(this.comun.removerAcentos(this.filtro.trim()))).subscribe(
            response => {
              if (response.cabResponse !== undefined) {
                if (response.posiciones !== undefined && response.cabResponse.codResponse === 0 && response.posiciones.length > 0) {
                  this.posicionesFiltro = response;
                  this.comun.configPaginacion = {
                    itemsPerPage: 10,
                    currentPage: 1,
                    totalItems: response.posiciones.length
                  };
                }
                if (response.cabResponse.codResponse === -1) {
                  this.comun.creaAlerta(1,
                    this.comun.RECURSOS.UBICACIONES.msjSinUbicaciones, this.comun.RECURSOS.COMUNES.sinCoincidencias);
                  this.cancelarCarga();
                }
                this.comun.validaCertificado(response.cabResponse.codResponse);
              } else {
                this.comun.creaAlerta(1,
                  this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio, this.comun.RECURSOS.COMUNES.headerErrorServicio);
              }
              this.comun.loading = false;
              clearTimeout(this.intervalo);
              this.comun.loadingTemplate = null;
            },
            error => {
              this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio,
                this.comun.RECURSOS.COMUNES.headerErrorServicio);
              this.cancelarCarga();
            }
          );
      }
      this.comun.preventDefault(event);
    }
  }

  /**
   * Limpia los valores de las variables usadas en la carga de empleados
   */
  public cancelarCarga(): void {
    this.posicionEditada = '';
    this.posicionesFiltro.posiciones = [];
    this.comun.cancelarCarga(this.suscriptor);
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
  }

  /**
   * Método adjunto al evento (input) del cuadro de búsqueda que detecta si el input esta vacio limpia todos los valores
   * @param posicion Valor que contiene el input de búsqueda
   */
  limpiarResultados(posicion: any) {
    this.posicionEditada = '';
    $('.contConfig').hide();
    if (posicion === '' || posicion.length === 0) {
      this.cancelarCarga();
    }
  }
}
