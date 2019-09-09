import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './componentes/estructura/home/home.component';
import { ListarEmpleadosComponent } from './componentes/soporte/administracion/empleados/listar-empleados.component';
import { PreguntasFrequentesComponent } from './componentes/soporte/preguntas-frequentes/preguntas-frequentes.component';
import { AutenticacionGuard } from './guard/autenticacion.guard';
import { NotificacionesComponent } from './componentes/soporte/notificaciones/notificaciones.component';
import { UbicacionesComponent } from './componentes/soporte/administracion/ubicaciones/ubicaciones.component';
import { TransporteGsComponent } from './componentes/soporte/administracion/transporte-gs/transporte-gs.component';
import { MarcajesComponent } from './componentes/soporte/administracion/empleados/marcajes/marcajes.component';
import { PosicionesComponent } from './componentes/soporte/administracion/empleados/posiciones/posiciones.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  {
    path: 'empleados',
    component: ListarEmpleadosComponent,
    canActivate: [AutenticacionGuard]
  },
  { path: 'empleados/marcajes', component: MarcajesComponent, canActivate: [AutenticacionGuard] },
  { path: 'empleados/posiciones', component: PosicionesComponent, canActivate: [AutenticacionGuard] },
  { path: 'notificacion', component: NotificacionesComponent, canActivate: [AutenticacionGuard] },
  { path: 'faq', component: PreguntasFrequentesComponent },
  { path: 'ubicaciones', component: UbicacionesComponent, canActivate: [AutenticacionGuard] },
  { path: 'transporte', component: TransporteGsComponent, canActivate: [AutenticacionGuard] },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
