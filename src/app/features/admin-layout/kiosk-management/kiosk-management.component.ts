import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UswagonCoreService } from 'uswagon-core';
import { ContentService } from '../../../services/content.service';
import { UswagonAuthService } from 'uswagon-auth';
import { LottieAnimationComponent } from '../../../shared/components/lottie-animation/lottie-animation.component';
import { ConfirmationComponent } from '../../../shared/modals/confirmation/confirmation.component';
import { KioskService } from '../../../services/kiosk.service';


interface Kiosk{
  id:string;
  division_id:string;
  number:string;
  status:string;  
  last_online?:string;  
  code:string;
}

interface Division{
  id:string;
  name:string;
}

@Component({
  selector: 'app-a-kiosk-management',
  templateUrl: './kiosk-management.component.html',
  styleUrls: ['./kiosk-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, LottieAnimationComponent, ConfirmationComponent]
})
export class KioskManagementComponent implements OnInit {


  divisions:Division[]=[];
  selectedDivision?:string;

  kiosks: Kiosk[]=[];



  isSuperAdmin:boolean = this.auth.accountLoggedIn() == 'superadmin';

  selectedKiosk?:Kiosk;

  // Injecting ChangeDetectorRef to trigger manual change detection
  constructor(private cdr: ChangeDetectorRef, 
    private auth:UswagonAuthService,private API:UswagonCoreService,
    private kioskService:KioskService, private contentService:ContentService) {}
  ngOnInit(): void {
    this.loadContent();
  }

  async loadContent(){
    this.API.setLoading(true);
    this.divisions =(await this.contentService.getDivisions()) as Division[];
    if(this.isSuperAdmin){
      this.selectedDivision = this.divisions[0].id;
    }else{
      this.selectedDivision = this.auth.getUser().division_id;
    }
    this.kiosks = (await this.kioskService.getAllKiosks(this.selectedDivision!));
    this.API.setLoading(false);    
  }

  async selectDivision(id:string){
    this.selectedDivision = id;
    this.API.setLoading(true);
    this.kiosks = (await this.kioskService.getAllKiosks(id));
    this.API.setLoading(false);
  }

  statusMap:any = {
    'available' : 'bg-orange-500',
    'maintenance' : 'bg-red-500',
    'active' : 'bg-green-500',
  }

  capitalizeFirstLetters(input: string): string {
    return input
      .split(' ') // Split the string into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(' '); // Join the words back into a single string
  }
  

  async addKiosk(){
    this.API.setLoading(true);
    await this.kioskService.addKiosk(this.selectedDivision!);
    this.kiosks = (await this.kioskService.getAllKiosks(this.selectedDivision!));
    this.API.setLoading(false);
  }

  async toggleMaintenance(item:Kiosk){
    this.closeDialog();
    this.API.setLoading(true);
    await this.kioskService.updateKioskStatus(item.id,item.status == 'available' ? 'maintenance' : 'available');
    this.kiosks = (await this.kioskService.getAllKiosks(this.selectedDivision!));
    this.API.setLoading(false);
  }
  async deleteKiosk(item:Kiosk){
    this.closeDialog();
    this.API.setLoading(true);
    await this.kioskService.deleteKiosk(item.id);
    this.kiosks = (await this.kioskService.getAllKiosks(this.selectedDivision!));
    this.API.setLoading(false);
  }

  selectKiosk(item:Kiosk){
    this.selectedKiosk = item;
  }

  modalType?:'maintenance'|'delete';

  openDialog(type:'maintenance'|'delete'){
    this.modalType = type;
  }
  closeDialog(){
    this.modalType = undefined;
  }

}
