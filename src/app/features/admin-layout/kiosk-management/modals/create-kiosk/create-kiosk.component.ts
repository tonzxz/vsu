import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UswagonCoreService } from 'uswagon-core';
import { KioskService } from '../../../../../services/kiosk.service';
import { Kiosk } from '../../types/kiosks.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-kiosk',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-kiosk.component.html',
  styleUrl: './create-kiosk.component.css'
})
export class CreateKioskComponent implements OnInit, OnDestroy {

  @Input() exisitingkiosk?:Kiosk;
  @Output() onClose = new EventEmitter<boolean>();
  errorMessageTimeout:any;
  errorMessage?:string;
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

  ngOnDestroy(): void {
    if(this.errorMessageTimeout){
      clearTimeout(this.errorMessageTimeout)
    }
  }

  close() {
    this.onClose.emit(false);
  }

  async submitForm(){
    this.submittingForm = true;
    if(this.kiosk.code.trim() == ''){
      this.errorMessage = 'This field is required.';
      if(this.errorMessageTimeout){
        clearTimeout(this.errorMessageTimeout)
      }
      this.errorMessageTimeout = setTimeout(()=>{
        this.errorMessage = undefined;
      },5000)
      return;
    }
    try{
      if(this.kiosk.id){
        await this.kioskService.updateKiosk(this.kiosk.id,this.kiosk.code);
      }else{
        await this.kioskService.addKiosk(
          this.kiosk.code
        )
      }
    }catch(e:any){
      this.API.sendFeedback('error', e.message,5000);
      return;
    }
    this.onClose.emit(true);
  }
}
