/**
 * Modelo que contiene los atributos de ubicaciones del empleado
 */
export class UbicacionesEmpleado {
    /**
     * Atributos de las ubicaciones del empleado
     * @param nombrePosicion Nombre de la posición
     * @param latitud Latitud
     * @param longitud Longitud
     */
    constructor(
        public nombrePosicion: string,
        public latitud: number,
        public longitud: number) { }

    /**
     * Retorna un objeto del modelo con valores inicializados
     */
    public static ubicacion() {
        return new UbicacionesEmpleado('', 0.0, 0.0);
    }
}
