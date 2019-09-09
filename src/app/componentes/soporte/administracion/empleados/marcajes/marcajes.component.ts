import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl } from 'ng-pick-datetime';
import { NativeDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/native-date-time-adapter.class';
import { Platform } from '@angular/cdk/platform';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
import { Subscription } from 'rxjs';
import { MarcajesResponse } from 'src/app/modelos/responses/marcajes.response';
import { MarcajeRequest } from 'src/app/modelos/requests/marcaje.request';
import { MostrarMapaComponent } from '../../../modales/mostrar-mapa/mostrar-mapa.component';
import { AuthService } from 'src/app/services/auth.service';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;

/**
 * Establece los valores por default para los componentes del datePicker owl-date-picker
 */
export class SpanishInt1 extends OwlDateTimeIntl {
  /** A label for the cancel button */
  cancelBtnLabel = 'Cancelar';
  /** A label for the set button */
  setBtnLabel = 'Confirmar';
  /** A label for the range 'from' in picker info */
  rangeFromLabel = 'Desde';
  /** A label for the range 'to' in picker info */
  rangeToLabel = 'A';
  /** A label for the hour12 button (AM) */
  hour12AMLabel = 'AM';
  /** A label for the hour12 button (PM) */
  hour12PMLabel = 'PM';
}

/**
 * Crea los formatos nativos a ocupar por el datePicker
 */
export const MY_NATIVE_FORMATS = {
  fullPickerInput: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' },
  datePickerInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
  timePickerInput: { hour: 'numeric', minute: 'numeric' },
  monthYearLabel: { year: 'numeric', month: 'short' },
  dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
  monthYearA11yLabel: { year: 'numeric', month: 'long' },
};

@Component({
  selector: 'app-marcajes',
  templateUrl: './marcajes.component.html',
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: MY_NATIVE_FORMATS },
    { provide: DateTimeAdapter, useClass: NativeDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE, Platform] },
    { provide: OwlDateTimeIntl, useClass: SpanishInt1 }
  ]
})
export class MarcajesComponent implements OnInit {
  /**
   * Arreglo de posicones
   */
  listaMarcajes: MarcajesResponse = MarcajesResponse.marcajes();
  /**
   * Intervalo de tiempo en el que se ejecutara el timeOut
   */
  intervalo: any;
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
  /**
   * NgModel que corresponde al input de la fecha de inicio
   */
  fechaInicio = '';
  /**
   * NgModel que corresponde al input de la fecha de fin
   */
  fechaFin = '';
  /**
   * Número de empleado
   */
  numeroEmpleado = '';
  /**
   * Almacena la fecha máxima que se puede elegir de los datePickers
   */
  public today = new Date().toISOString().split('T')[0];
  /**
   * Determina si una columna se va a mostrar o no
   */
  mostrarColumna = false;
  /**
   * Setea la configuración que la modal modalMostrarMapa va a recibir
   */
  public configuracionMapa = {
    title: 'Mapa de la ubicación',
    idModal: 'modalMostrarMapa'
  };
  /**
   * ViewChild para la modal de reactivar al empleado
   */
  @ViewChild('mostrarMapaModalViewChild', { static: false }) mostrarMapaModalViewChild: MostrarMapaComponent;

  constructor(
    private empleadoService: EmpleadoService,
    public comun: DatosComunesService,
    private authService: AuthService) { }

  ngOnInit() {
    $('.contConfig').hide();
    if (this.authService.isAuthenticated()) {
      this.comun.tituloPagina = this.comun.RECURSOS.MARCAJES.tagTitulo;
    } else {
      this.comun.redirigeAPrincipal();
    }
  }

  /**
   * Detecta el cambio en la página
   * @param event Pagina actual
   */
  pageChanged(event: any) {
    this.comun.configPaginacion.currentPage = event;
  }

  /**
   * Limpia los valores de las variables usadas en la carga de empleados
   */
  public cancelarCarga(): void {
    this.listaMarcajes.marcajes = [];
    this.comun.cancelarCarga(this.suscriptor);
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
  }

  /**
   * Valida la fechas obtenidas
   * @param fechaInicio Fecha de la cual se quiere empezar a consultar las asistencias
   * @param fechaFin Fecha hasta la cual se quiere consultar las asistencias
   * @param empleado Numero de empleado
   */
  public aceptar(fechaInicio: string, fechaFin: string, empleado: string) {
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
    if (fechaInicio === '' || fechaInicio === undefined ||  empleado === '' || empleado === undefined ||
    fechaFin === '' || fechaFin === undefined) {
      return;
    } else if (fechaInicio > fechaFin || fechaFin < fechaInicio) {
      this.comun.creaAlerta(1, this.comun.RECURSOS.MARCAJES.msjFechaInicialInvalida, this.comun.RECURSOS.MARCAJES.headerFechaInvalida);
    } else {
      this.comun.loading = true;
      this.listaMarcajes.marcajes = [];
      let marcajeRequest: MarcajeRequest = MarcajeRequest.marcaje();
      marcajeRequest = {
        cabRequest: this.comun.asignaValorRequest(marcajeRequest.cabRequest),
        fechaInicio: this.comun.formatDate(fechaInicio),
        fechaFin: this.comun.formatDate(fechaFin),
        idEmpleado: this.numeroEmpleado
      };

      this.intervalo = setTimeout(() => {
        this.cargandoTexto = this.comun.RECURSOS.COMUNES.demoraEnCarga;
        this.comun.validaCargando(this.customLoadingTemplate);
      }, 10000);

      this.suscriptor = this.empleadoService.consultaMarcajes(marcajeRequest).subscribe(
        response => {
          if (response.cabResponse !== undefined) {
            if (response.cabResponse.codResponse === 0 && response.marcajes !== undefined) {
              this.listaMarcajes = response;
              this.comun.configPaginacion = {
                itemsPerPage: 15,
                currentPage: 1,
                totalItems: response.marcajes.length
              };
              for (const m of this.listaMarcajes.marcajes) {
                if (m.zonaHorario !== null) {
                  this.mostrarColumna = true;
                  break;
                }
              }
            }
            if (response.cabResponse.codResponse === -1) {
              this.comun.creaAlerta(1, this.comun.RECURSOS.MARCAJES.msjErrorMarcajes, this.comun.RECURSOS.COMUNES.sinCoincidencias);
            }
            this.comun.validaCertificado(response.cabResponse.codResponse);
          } else {
            this.comun.creaAlerta(1, this.comun.RECURSOS.MARCAJES.msjErrorMarcajes, this.comun.RECURSOS.COMUNES.sinCoincidencias);
          }

          if (this.listaMarcajes.marcajes.length !== 0) {
            this.comun.creaAlerta(1, this.comun.RECURSOS.MARCAJES.visualizarMapaInst, this.comun.RECURSOS.MARCAJES.headerVerMapa);
          }
          this.comun.loading = false;
        },
        error => {
          this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio, this.comun.RECURSOS.COMUNES.headerErrorServicio);
          this.comun.loading = false;
        }
      );
    }
  }

  mostrarMapa(latitud, longitud, nombre) {
    this.mostrarMapaModalViewChild.showModal('modalMostrarMapa', latitud, longitud, nombre);
  }
}
