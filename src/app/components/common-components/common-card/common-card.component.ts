import { Component, Input, OnInit } from '@angular/core';
import { VaccineInfo } from 'src/app/interfaces/vaccine-info';

@Component({
  selector: 'app-common-card',
  templateUrl: './common-card.component.html',
  styleUrls: ['./common-card.component.css']
})
export class CommonCardComponent implements OnInit {

  @Input('vaccineInfo') vaccineInfo: VaccineInfo = {
    name:"",
    selected: false,
    id: 0,
    availability:{
      id:0,
      day:0,
      total_doses:0,
      available_doses:0
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
