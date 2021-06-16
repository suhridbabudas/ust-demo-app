import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccineInfoComponent } from './components/vaccination-components/vaccine-info/vaccine-info.component';
import { URLS } from '../environments/url'
import { UserRegistrationComponent } from './components/vaccination-components/user-registration/user-registration.component';

const routes: Routes = [
  {
    path: URLS.home,
    component: VaccineInfoComponent
  },
  {
    path: URLS.signup,
    component: UserRegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
