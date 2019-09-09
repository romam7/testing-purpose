import { CabeceroResponse } from './cabecero.response';
import { PosicionValida } from '../modelos/posicion.valida';
/**
 * Modelo que contiene los datos del response del catálogo de posiciones validad
 */
export class PosicionesValidasResponse {
    /**
     * Atributos del modelo
     * @param cabResponse Cabecero response
     * @param posiciones Lista de objetos de conductor
     */
    constructor(
        public cabResponse: CabeceroResponse,
        public posiciones: PosicionValida[]) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static posiciones() {
        return new PosicionesValidasResponse(CabeceroResponse.cabeceroResponse(), []);
    }
}
