import { CabeceroResponse } from './cabecero.response';
import { UbicacionesEmpleado } from '../modelos/ubicaciones.empleado';
/**
 * Modelo que contiene los datos del response del catálogo de posiciones validad
 */
export class UbicacionesEmpleadoResponse {
    /**
     * Atributos del modelo
     * @param cabResponse Cabecero response
     * @param posiciones Lista de objetos de conductor
     */
    constructor(
        public cabResponse: CabeceroResponse,
        public ubicaciones: UbicacionesEmpleado[]) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static ubicaciones() {
        return new UbicacionesEmpleadoResponse(CabeceroResponse.cabeceroResponse(), []);
    }
}
