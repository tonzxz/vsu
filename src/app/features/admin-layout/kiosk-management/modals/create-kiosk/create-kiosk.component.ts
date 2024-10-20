import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UswagonCoreService } from 'uswagon-core';
import { KioskService } from '../../../../../services/kiosk.service';
import { Kiosk } from '../../types/kiosks.types';

@Component({
  selector: 'app-create-kiosk',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-kiosk.component.html',
  styleUrl: './create-kiosk.component.css'
})
export class CreateKioskComponent implements OnInit {

  @Input() exisitingkiosk?:Kiosk;
  @Output() onClose = new EventEmitter<boolean>();

  submittingForm:boolean = false;

  constructor(private API:UswagonCoreService, private kioskService:KioskService){}

  kiosk:Kiosk =  {
    code:'',
  } 

  ngOnInit(): void {
    if(this.exisitingkiosk){
      this.kiosk = {...this.exisitingkiosk}
    }
  }

  close() {
    this.onClose.emit(false);
  }

  async submitForm(){
    this.submittingForm = true;
    if(this.kiosk.id){
      await this.kioskService.updateKiosk(this.kiosk.id,this.kiosk.code);
    }else{
      await this.kioskService.addKiosk(
        this.kiosk.code
      )
    }
    this.onClose.emit(true);
  }
}
