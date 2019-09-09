import { CabeceroResponse } from './cabecero.response';
import { Empleado } from '../modelos/empleado';
/**
 * Modelo que contiene los datos del response del catálogo de empleados
 */
export class EmpleadosResponse {
    /**
     * Atributos del modelo
     * @param cabResponse Cabecero response
     * @param empleados Lista de objetos de empleado
     */
    constructor(
        public cabResponse: CabeceroResponse,
        public empleados: Empleado[]) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static empleado() {
        return new EmpleadosResponse(CabeceroResponse.cabeceroResponse(), []);
    }
}
