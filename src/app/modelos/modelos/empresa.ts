/**
 * Modelo que contiene los datos de la empresa
 */
export class Empresa {
    /**
     * Atributos del modelo
     * @param idEmpresa Id de la empresa
     * @param nombre Nombre de la empresa
     * @param clave Clave de la empresa
     */
    constructor(
        public idEmpresa: number,
        public nombre: string,
        public clave: string
    ) {}
    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static empresa() {
        return new Empresa(0, '', '');
    }
}
