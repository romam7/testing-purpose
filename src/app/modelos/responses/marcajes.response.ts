import { CabeceroResponse } from './cabecero.response';
import { Marcaje } from '../modelos/marcaje';
/**
 * Modelo que contiene los datos de la respuesta de la asistencia
 */
export class MarcajesResponse {
    /**
     * Atributos del modelo
     * @param cabResponse Cabecero response
     * @param marcajes Listado de marcajes
     */
    constructor(
        public cabResponse: CabeceroResponse,
        public marcajes: Marcaje[]) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static marcajes() {
        return new MarcajesResponse(CabeceroResponse.cabeceroResponse(), []);
    }
}
