import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { DoseAvailability } from 'src/app/interfaces/dose-availability';
import { PageContent } from 'src/app/interfaces/page-content';
import { User } from 'src/app/interfaces/user';
import { VaccineInfo } from 'src/app/interfaces/vaccine-info';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-vaccine-info',
  templateUrl: './vaccine-info.component.html',
  styleUrls: ['./vaccine-info.component.css'],
})
export class VaccineInfoComponent implements OnInit {

  govtId: string = "";
  userStatus: Array<User> = [];
  searchBtnClicked: boolean = false;

  minDate = new Date();;
  maxDate = new Date();

  selectedDate: number = 0;
  selectedMonth: number = 0;
  selectedYear: number = 0;

  fullDate: string = "";
  vacciceName: string = "";
  vaccineId: number = 0;
  dose_id:number = 0;

  bsInlineValue = new Date();
  
  pageContent: PageContent = {
    vaccineInfo: [{
      name: 'Vaccine-1',
      selected: true,
      id: 1,
      availability:{
          id: 0,
          day:this.minDate.getDate(),
          total_doses:100,
          available_doses:80
        }
    },
    {
      name: 'Vaccine-2',
      selected: false,
      id: 2,
      availability:{
          id: 0,
          day:this.minDate.getDate(),
          total_doses:100,
          available_doses:75
        }
    }],
  }

  vaccineData_1: Array<DoseAvailability> =[];
  vaccineData_2: Array<DoseAvailability> =[];


  bsCalConfig = {
    isAnimated: true,
    dateInputFormat: 'YYYY-MM-DD',
    containerClass: "theme-default"
  }


  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate() + 9);
    this.initialVaccineData();
  }

  initialVaccineData(){
    let currentdate = this.minDate.getDate();
    let maxDate = this.maxDate.getDate();
    if(this.localStorageService.retrieve('vaccineData_1') 
    && this.localStorageService.retrieve('vaccineData_2')){
      this.vaccineData_1 = [...this.localStorageService.retrieve('vaccineData_1')];
      this.vaccineData_2 = [...this.localStorageService.retrieve('vaccineData_2')];
    } else{
      for(let i = currentdate, j=1; i<= maxDate; i++, j++){
        this.vaccineData_1.push({
          id: j,
          day: i,
          total_doses:100,
          available_doses: 40+ i
        })
        this.vaccineData_2.push({
          id: j,
          day: i,
          total_doses:100,
          available_doses: 30+ i
        })
      }
      this.localStorageService.store('vaccineData_1', this.vaccineData_1);
      this.localStorageService.store('vaccineData_2', this.vaccineData_2);
    }
    this.pageContent.vaccineInfo[0].availability = Object.assign(this.vaccineData_1[0]);
    this.pageContent.vaccineInfo[1].availability = Object.assign(this.vaccineData_2[0]);
    console.log(this.pageContent)
  }

  setData(event:any){
    let tempInfo = [];
    tempInfo = this.pageContent.vaccineInfo.map(item => {
        if(item.id === parseInt(event.target.id)){
          return {
            name: item.name,
            selected: true,
            id: item.id,
            availability:{
                id: item.availability.id,
                day:item.availability.day,
                total_doses:item.availability.total_doses,
                available_doses:item.availability.available_doses
              }
          };
        } else{
          return {
            name: item.name,
            selected: false,
            id: item.id,
            availability:{
                id: item.availability.id,
                day:item.availability.day,
                total_doses:item.availability.total_doses,
                available_doses:item.availability.available_doses
              }
          };
        }
    })
    this.pageContent.vaccineInfo = [...tempInfo]
    this.pageContent.vaccineInfo.map(item =>{
      if(item.selected && item.name === "Vaccine-1"){
        this.getAvailability(0, item);
      }
      if(item.selected && item.name === "Vaccine-2"){
        this.getAvailability(1, item);
      }
    })
  }

  getAvailability(i:number, info: VaccineInfo){
    if(i === 0){
      this.vaccineData_1.map(item =>{
        if(this.selectedDate === item.day){
          this.pageContent.vaccineInfo[i].availability = Object.assign(item);
          this.getDetails(this.pageContent.vaccineInfo[i]);
          return;
        }
      })
    }

    if(i === 1){
      this.vaccineData_2.map(item =>{
        if(this.selectedDate === item.day){
          this.pageContent.vaccineInfo[i].availability = Object.assign(item);
          this.getDetails(this.pageContent.vaccineInfo[i]);
        }
      })
    }

  }

  getDetails(item:VaccineInfo){
    this.vacciceName = item.name;
    this.vaccineId = item.id;
    this.dose_id = item.availability.id;
  }

  onValueChange(value: Date): void {
    this.selectedDate = value.getDate();
    // this.selectedMonth = value.getMonth();
    // this.selectedYear = value.getFullYear();
    // this.fullDate = `${this.selectedDate}-${this.selectedMonth}-${this.selectedYear}`;
    let fulldate = this.datepipe.transform(value, 'dd-MM-yyy') || "";
    this.fullDate = fulldate.toString();

    this.pageContent.vaccineInfo.map(item =>{

      if(item.selected && item.name === "Vaccine-1"){
        this.getAvailability(0, item);
      }
      if(item.selected && item.name === "Vaccine-2"){
        this.getAvailability(1, item);
      }
    })
  }

  proceedToBook(){
      this.router.navigate(['/registration'],
      {queryParams:
        {
          vaccine: this.vacciceName, 
          id: this.vaccineId, 
          booking_date: this.fullDate,
          dose_id: this.dose_id,
        }
      })
  }

  searchStatus(event:Event){
    event.preventDefault();
    if(!this.localStorageService.retrieve('registereduser')){
      this.searchBtnClicked = true;
      this.userStatus = [];
      this.govtId = "";
    } else{
      this.searchBtnClicked = true;
      let tempRegdUsers: Array<User> = [...this.localStorageService.retrieve('registereduser')];
      this.userStatus = tempRegdUsers.filter(item => item.govtId === this.govtId);
      this.govtId = "";
    }
  }

}
