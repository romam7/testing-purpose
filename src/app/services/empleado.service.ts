import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CambiaEstatusEmpleadoRequest } from '../modelos/requests/estatus.empleado.request';
import { EmpleadoRequest } from '../modelos/requests/empleado.request';
import { EmpleadoResponse } from '../modelos/responses/empleado.response';
import { GenericoRequest } from '../modelos/requests/generico';
import { EmpleadosResponse } from '../modelos/responses/empleados.response';
import { CabeceroResponse } from '../modelos/responses/cabecero.response';
import { CatalogoEmpresasResponse } from '../modelos/responses/catalogo.empresas.response';
import { NotificacionRequest } from '../modelos/requests/notificacion.request';
import { FotoRequest } from '../modelos/requests/foto.request';
import { FotoResponse } from '../modelos/responses/foto.response';
import { environment } from '../../environments/environment';
import { CertificadoRequest } from '../modelos/requests/certificado.request';
import { CertificadoResponse } from '../modelos/responses/certificado.response';
import { retry } from 'rxjs/operators';
import { ConductoresResponse } from '../modelos/responses/conductores.response';
import { ConductorRequest } from '../modelos/requests/conductor.request';
import { PosicionValidaRequest } from '../modelos/requests/posicion.valida.request';
import { PosicionesValidasResponse } from '../modelos/responses/posiciones.validas.response';
import { MarcajeRequest } from '../modelos/requests/marcaje.request';
import { MarcajesResponse } from '../modelos/responses/marcajes.response';
import { UbicacionesEmpleadoResponse } from '../modelos/responses/ubicaciones.empleado.response';

/**
 * Servicio que contiene todas las llamadas/consumo de los servicios del back
 */
@Injectable({
  providedIn: 'root'
})

export class EmpleadoService {
  /**
   * Emmitter que detecta los cambios en un elemento
   */
  private notificaCambio = new EventEmitter<any>();

  /**
   * Crea los objetos para que los servicios funciones
   * @param http Objeto para poder realizar las peticiones http a los servicios
   */
  constructor(private http: HttpClient) { }

  /**
   * Método que consume un servicio que obtiene información de un empleado
   * @param numEmpleado Número de empleado
   */
  obtenerEmpleado(numEmpleado: GenericoRequest): Observable<EmpleadoResponse> {
    return this.http.post<EmpleadoResponse>(`${environment.urlServicio}/JWT_ObtenerEmpleado`, numEmpleado);
  }

  /**
   * Método que consume un servicio para la actualización de información
   * @param empleado Objeto que contiene toda la información del empleado
   */
  actualizarEmpleado(empleado: EmpleadoRequest): Observable<CabeceroResponse> {
    return this.http.put<CabeceroResponse>(`${environment.urlServicio}/JWT_ActualizarEmpleado`, empleado);
  }

  /**
   * Método que consume un servicio para la activación o desactivación de un empleado
   * @param empleado Objeto que contiene la operación y el empleado a modificar
   */
  activarDesactivarEmpleado(empleado: CambiaEstatusEmpleadoRequest): Observable<CabeceroResponse> {
    return this.http.put<CabeceroResponse>(
      `${environment.urlServicio}/JWT_CambiarEstatusEmpleado`, empleado
    );
  }

  /**
   * Método que consume un servicio para filtrar los empleados de acuerdo a un criterio dado
   * @param filtro Objeto que contiene el criterio por el cual filtrar
   */
  filtrarEmpleados(filtro: GenericoRequest): Observable<EmpleadosResponse> {
    return this.http.post<EmpleadosResponse>(
      `${environment.urlServicio}/JWT_ObtenerEmpleadosPorFiltro`, filtro
    );
  }

  /**
   * Método que consume un servicio para obtener el catálogo de empresas
   * @param request Request que contiene el cabecero de la petición
   */
  obtenerEmpresasPadre(request: GenericoRequest): Observable<CatalogoEmpresasResponse> {
    return this.http.post<CatalogoEmpresasResponse>(`${environment.urlServicio}/JWT_ObtenerEmpresasPadre`, request);
  }

  /**
   * Método que consume un servicio para obtener la foto del empleado
   * @param foto Objeto que contiene información para la consulta de la foto
   */
  obtenerFotoEmpleado(foto: FotoRequest): Observable<FotoResponse> {
    return this.http.post<FotoResponse>(`${environment.urlServicio}/JWT_ObtenerFotoEmpleado`, foto);
  }

  /**
   * Método que consume un servicio para enviar notificaciones
   * @param notificacion Objeto que contiene información para el envío de la notificacion
   */
  enviarNotificacion(notificacion: NotificacionRequest): Observable<any> {
    return this.http.post<any>(environment.urlServicioNotificaciones, notificacion);
  }

  /**
   * Método que consume un servicio para obtener un certificado para la capa de servicios
   * @param certificado Objeto que contiene la información para la obtención de certificado
   */
  obtenerCertificado(certificado: CertificadoRequest): Observable<CertificadoResponse> {
    return this.http.post<CertificadoResponse>(environment.urlLoginCertificado, certificado).pipe(
      retry(3)
    );
  }

  /**
   * Método que consume un servicio para filtrar los conductores de acuerdo a un criterio dado
   * @param filtro Objeto que contiene el criterio por el cual filtrar
   */
  obtenerTodosConductores(request: GenericoRequest): Observable<ConductoresResponse> {
    return this.http.post<ConductoresResponse>(
      `${environment.urlServicio}/JWT_ObtenerConductores`, request
    );
  }

  /**
   * Método que consume un servicio para dar de alta un nuevo conductor
   * @param conductor Objeto que contiene la información del condutor a registrar
   */
  guardarNuevoConductor(conductor: ConductorRequest): Observable<CabeceroResponse> {
    return this.http.post<CabeceroResponse>(
      `${environment.urlServicio}/JWT_GuardarConductor`, conductor
    );
  }

  /**
   * Método que consume un servicio para dar de alta una nueva posicón valida
   * @param posicion Objeto que contiene la información de la posicion a guardar
   */
  registraNuevaPosicionValida(posicion: PosicionValidaRequest): Observable<CabeceroResponse> {
    return this.http.post<CabeceroResponse>(
      `${environment.urlServicio}/JWT_RegistrarPosicionValida`, posicion
    );
  }

  /**
   * Método que consume un servicio para dar de alta una nueva posicón valida
   * @param posicion Objeto que contiene la información de la posicion a guardar
   */
  actualizaPosicionValida(posicion: PosicionValidaRequest): Observable<CabeceroResponse> {
    return this.http.post<CabeceroResponse>(
      `${environment.urlServicio}/JWT_ActualizarPosicionValida`, posicion
    );
  }
  /**
   * Método que consume un servicio para filtrar las posiciones validas de acuerdo a un criterio dado
   * @param filtro Objeto que contiene el criterio por el cual filtrar
   */
  filtrarPosiciones(filtro: GenericoRequest): Observable<PosicionesValidasResponse> {
    return this.http.post<PosicionesValidasResponse>(
      `${environment.urlServicio}/JWT_ObtenerPosicionesPorFiltro`, filtro
    );
  }

  /**
   * Método que consume un servicio para consultar las posiciones de un empleado filtrado por una fecha
   * @param marcaje Objeto que contiene la información del marcaje a buscar
   */
  consultaMarcajes(marcaje: MarcajeRequest): Observable<MarcajesResponse> {
    return this.http.post<MarcajesResponse>(
      `${environment.urlServicio}/JWT_ConsultarMarcajes`, marcaje
    );
  }

  /**
   * Método que consume un servicio par obtener las ubicaciones de un empleado en particular
   * @param filtro Objeto que contiene el empleado del cual se desea obtener la información
   */
  consultaUbicacionesEmpleado(filtro: GenericoRequest): Observable<UbicacionesEmpleadoResponse> {
    return this.http.post<UbicacionesEmpleadoResponse>(
      `${environment.urlServicio}/JWT_ConsultarUbicacionesEmpleado`, filtro
    );
  }

  /**
   * Método que detecta los cambios que sufre un elemento
   */
  get notificarCambio(): EventEmitter<any> {
    return this.notificaCambio;
  }
}
