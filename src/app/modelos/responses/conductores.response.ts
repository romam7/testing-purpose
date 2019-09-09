import { CabeceroResponse } from './cabecero.response';
import { Conductor } from '../modelos/conductor';
/**
 * Modelo que contiene los datos del response del catálogo de conductores
 */
export class ConductoresResponse {
    /**
     * Atributos del modelo
     * @param cabResponse Cabecero response
     * @param conductores Lista de objetos de conductor
     */
    constructor(
        public cabResponse: CabeceroResponse,
        public conductores: Conductor[]) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static conductores() {
        return new ConductoresResponse(CabeceroResponse.cabeceroResponse(), []);
    }
}
