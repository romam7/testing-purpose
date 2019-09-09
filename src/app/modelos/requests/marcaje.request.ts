import { CabeceroRequest } from './cabecero.request';
/**
 * Modelo que contiene los datos del request de la consulta de los marcajes
 */
export class MarcajeRequest {
    /**
     * Atributos del request
     * @param cabRequest Cabecero request
     * @param idEmpleado Número de empleado
     * @param fechaInicio Fecha de inicio
     * @param fechaFin Fecha de fin
     */
    constructor(
        public cabRequest: CabeceroRequest,
        public idEmpleado: string,
        public fechaInicio: string,
        public fechaFin: string) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static marcaje() {
        return new MarcajeRequest(CabeceroRequest.cabeceroRequest(), '', '', '');
    }
}
