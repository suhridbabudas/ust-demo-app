import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { Subscription } from 'rxjs';
import { DoseAvailability } from 'src/app/interfaces/dose-availability';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;

  private subscriptions: Array<Subscription> = [];

  registeredUser: Array<User> =[];
  user: User = {
    name : "",
    govtId : "",
    gender : "",
    dob : new Date(),
    bookingInfo : {
      dose_id: 0,
      booking_date : "",
      vaccine : "",
      id : 0
    }

  }
  bookingDate: string ="";
  vaccine: string = "";
  id: string = "";
  dose_id: string = "";
  vaccineData_1: Array<DoseAvailability> =[];
  vaccineData_2: Array<DoseAvailability> =[];
  
  bsCalConfig = {
    isAnimated: true,
    dateInputFormat: 'YYYY-MM-DD',
    containerClass: "theme-default"
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.queryParamMap.subscribe(param =>{
        let qp = param;
        this.bookingDate = qp.get('booking_date') || "";
        this.vaccine = qp.get('vaccine') || "";
        this.id = qp.get('id') || "";
        this.dose_id = qp.get('dose_id') || "";
      })
    )
    if(this.localStorageService.retrieve("registereduser")){
      this.registeredUser = [...this.localStorageService.retrieve("registereduser")]
    }

    if(this.localStorageService.retrieve('vaccineData_1') 
    && this.localStorageService.retrieve('vaccineData_2')){
      this.vaccineData_1 = [...this.localStorageService.retrieve('vaccineData_1')];
      this.vaccineData_2 = [...this.localStorageService.retrieve('vaccineData_2')];
    }
  }

  ngOnDestroy(){
    while(this.subscriptions.length){
      this.subscriptions?.pop()?.unsubscribe()
    }
  }

  @HostListener('window:scroll')
  onScrollEvent() {
    this.datepicker.hide();
  }

  userObject(data:any){
    this.user.name = data.name;
    this.user.govtId = data.govtid;
    this.user.gender = data.gender;
    this.user.dob = data.dob;
    this.user.bookingInfo.booking_date = this.bookingDate;
    this.user.bookingInfo.vaccine = this.vaccine;
    this.user.bookingInfo.id = parseInt(this.id);
    this.user.bookingInfo.dose_id = parseInt(this.dose_id);
  }

  updateVaccineCount(id:number, doseId:number){
    let tempVaccineData: Array<DoseAvailability> = [];
    if(id === 1 && this.vaccineData_1.length){
      tempVaccineData = this.vaccineData_1.map(item => this.getUpdatedValue(item, doseId))
      this.vaccineData_1 = [...tempVaccineData];
    }else if(id ===2 && this.vaccineData_2.length){
      tempVaccineData = this.vaccineData_2.map(item => this.getUpdatedValue(item, doseId))
      this.vaccineData_1 = [...tempVaccineData];
    }
  }

  getUpdatedValue(item:DoseAvailability, doseId:number){
    if(doseId === item.id){
      return{
        available_doses: item.available_doses - 1,
        day: item.day,
        id: item.id,
        total_doses: item.total_doses
      }
    } else{
      return item;
    }
  }

  onSubmit(event:Event, data: {name:string, govtid:string, gender?: string, dob: Date}){
    let user = [];
    event.preventDefault();
    if(this.registeredUser.length){
      user = this.registeredUser.filter(item => item.govtId === data.govtid);
    }
    if(user.length){
      this.toaster.error("User Exist", "Error")
      return;
    } else{
      this.userObject(data);
      this.updateVaccineCount(parseInt(this.id),parseInt(this.dose_id))
      this.registeredUser.push(this.user);
      this.localStorageService.store('registereduser', this.registeredUser);
      this.localStorageService.store('vaccineData_1', this.vaccineData_1);
      this.localStorageService.store('vaccineData_2', this.vaccineData_2);
      this.toaster.success("Registration Successfull", "Success")
      setTimeout(()=>{
        this.router.navigate(['']);
      }, 1000);
    }
    
  }

}
