import { CabeceroRequest } from './cabecero.request';
/**
 * Modelo que contiene los datos del request generico
 */
export class GenericoRequest {
    /**
     * Atributos del modelo
     * @param cabRequest Cabecero request
     * @param valor Valor a enviar
     */
    constructor(
        public cabRequest: CabeceroRequest,
        public valor: string) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static generico() {
        return new GenericoRequest(CabeceroRequest.cabeceroRequest(), '');
    }
}
