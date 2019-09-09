/**
 * Modelo que contiene los datos del cabecero response
 */
export class CabeceroResponse {
    /**
     * Atributos del modelo
     * @param codResponse Código de respuesta
     * @param mensReponse Mensaje de respuesta
     */
    constructor(
        public codResponse: number,
        public mensReponse: string,
    ) { }
    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static cabeceroResponse() {
        return new CabeceroResponse(0, '');
    }
}
