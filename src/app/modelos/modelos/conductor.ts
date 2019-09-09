/**
 * Modelo que contiene los atributos de los datos de un empleado
 */
export class Conductor {
    /**
     * Atributos del modelo
     * @param numeroEmpleado Número de empleado
     * @param noLicencia Número de licencia de conducir
     * @param vigencia Año de vigencia de la licencia
     * @param estatusConductor Estatus actual del conductor
     * @param fechaRegistro Fecha en la que el conductor fue dado de alta
     * @param fechaActualizacion Fecha en la que el conductor fue actualizado
     */
    constructor(
        public numeroEmpleado: string,
        public noLicencia: string,
        public vigencia: number,
        public estatusConductor: number,
        public fechaRegistro: string
        ) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static conductor() {
        return new Conductor('', '', 0, 0, '');
    }
}
