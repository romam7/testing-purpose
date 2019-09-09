/**
 * Modelo que contiene los atributos de los datos de una posición valida
 */
export class PosicionValida {
    /**
     * Atributos del modelo
     * @param nombrePosicion Número de posición
     * @param nombrePosicion Nombre de la posición
     * @param latitud Latitud de la posición
     * @param longitud Longitud de la posición
     */
    constructor(
        public numeroPosicion: string,
        public nombrePosicion: string,
        public latitud: number,
        public longitud: number,
        public rangoAceptado: number) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static posicion() {
        return new PosicionValida('', '', 0.0, 0.0, 0);
    }
}
