// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * Ambiente
 */
export const environment = {
  production: false,
  urlServicio: 'http://localhost:51743/ServicioSoporteEmpleados.svc',
  urlServicioNotificaciones: 'https://dev.aws.sociomas.com:9008/ServicioNotificaciones.svc/JWT_EnviarNotificaciones',
  urlLoginCertificado: 'https://dev.aws.sociomas.com:9000/ServicioAutenticacionPortal.svc/JWT_LogOn',
  urlLogin: 'https://authns.desadsi.gs/nidp/jsp/main.jsp?id=doblefactoridm&sid=1',
  urlLogout: 'https://authns.desadsi.gs/nidp/app/logout'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
