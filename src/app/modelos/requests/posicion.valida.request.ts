import { CabeceroRequest } from './cabecero.request';
import { PosicionValida } from '../modelos/posicion.valida';
/**
 * Modelo que contiene los datos dwel request de una posicion valida
 */
export class PosicionValidaRequest extends PosicionValida {
    /**
     * Atributos del modelo
     * @param cabRequest Cabecero request
     * @param numeroPos Número de posición
     * @param nombrePos Nombre de la posición
     * @param latitud Latitud de la posición
     * @param longitud Longitud de la posición
     * @param rangoAceptado Rango en el cual la posición es valida
     */
    constructor(
        public cabRequest: CabeceroRequest,
        public numeroPosicion: string,
        public nombrePosicion: string,
        public latitud: number,
        public longitud: number,
        public rangoAceptado: number) {
            super('', '', 0.0, 0.0, 0);
        }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static posicion() {
        return new PosicionValidaRequest(CabeceroRequest.cabeceroRequest(), '', '', 0.0, 0.0, 0);
    }
}
