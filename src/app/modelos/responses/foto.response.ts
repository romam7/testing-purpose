import { CabeceroResponse } from './cabecero.response';
/**
 * Modelo que contiene los datos de la respuesta de la foto
 */
export class FotoResponse {
    /**
     * Atributos del modelo
     * @param cabResponse Cabecero response
     * @param foto Foto en base64
     */
    constructor(
        public cabResponse: CabeceroResponse,
        public foto: string) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static empleado() {
        return new FotoResponse(CabeceroResponse.cabeceroResponse(), '');
    }
}
