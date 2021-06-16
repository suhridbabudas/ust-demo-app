import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/common-components/header/header.component';
import { FooterComponent } from './components/common-components/footer/footer.component';
import { UserRegistrationComponent } from './components/vaccination-components/user-registration/user-registration.component';
import { VaccineInfoComponent } from './components/vaccination-components/vaccine-info/vaccine-info.component';
import { MainComponent } from './components/main/main.component';
import { CommonCardComponent } from './components/common-components/common-card/common-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UserRegistrationComponent,
    VaccineInfoComponent,
    MainComponent,
    CommonCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    NgxWebstorageModule.forRoot(),
    FormsModule,
    ToastrModule.forRoot(),
    
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
