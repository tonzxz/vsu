import { Component } from '@angular/core';
import { CreateServiceComponent } from './modals/create-service/create-service.component';
import { ConfirmationComponent } from '../../../shared/modals/confirmation/confirmation.component';
import { LottieAnimationComponent } from '../../../shared/components/lottie-animation/lottie-animation.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Division, Service } from './types/service.types';
import { DivisionService } from '../../../services/division.service';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';
import { ServiceService } from '../../../services/service.service';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LottieAnimationComponent, ConfirmationComponent,CreateServiceComponent],
  templateUrl: './service-management.component.html',
  styleUrl: './service-management.component.css'
})
export class ServiceManagementComponent {
  

  divisions:Division[]=[];
  selectedDivision?:string;

  services: Service[]=[];
  isSuperAdmin:boolean = this.auth.accountLoggedIn() == 'superadmin';

  selectedService?:Service;

  modalType?:'maintenance'|'delete';

  openServiceModal:boolean = false;

  // Injecting ChangeDetectorRef to trigger manual change detection
  constructor(
    private divisionService:DivisionService,
    private auth:UswagonAuthService,private API:UswagonCoreService,
    private serviceService:ServiceService) {}
  ngOnInit(): void {
    this.loadContent();
  }

  async loadContent(){
    this.API.setLoading(true);
    this.selectedDivision =(await this.divisionService.getDivision())?.id;
    this.divisions =(this.divisionService.divisions) as Division[];

    this.services = (await this.serviceService.getAllServices(this.selectedDivision!));
    this.API.setLoading(false);    
  }

  async selectDivision(division:Division){
    this.selectedDivision = division.id;
    this.divisionService.setDivision(division)
    this.API.setLoading(true);
    this.services = (await this.serviceService.getAllServices(division.id));
    this.API.setLoading(false);
  }

  statusMap:any = {
    'available' : 'bg-green-500',
    'maintenance' : 'bg-red-500',
    'online' : 'bg-orange-500',
  }

  capitalizeFirstLetters(input: string): string {
    return input
      .split(' ') // Split the string into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(' '); // Join the words back into a single string
  }
  

  addService(){
    this.selectedService = undefined;
    this.openServiceModal = true;
  }

  updateService(service:Service){
    this.selectedService = service;
    this.openServiceModal = true;
  }

  async deleteService(item:Service){
    this.API.setLoading(true);
    try{
      await this.serviceService.deleteService(item.id!);
      await this.closeDialog(true);
      this.API.sendFeedback('success', 'Service has been deleted!',5000);
    }catch(e:any){
      this.API.sendFeedback('success', e.message,5000);
    }
  }

  selectService(item:Service){
    this.selectedService = item;
  }

  

  openDialog(type:'maintenance'|'delete'){
    this.modalType = type;
  }
  async closeDialog(shouldRefresh:boolean){
    const fromService = this.openServiceModal;
    this.openServiceModal = false;
    this.modalType = undefined;
    if(shouldRefresh){
      this.API.setLoading(true);
      this.services = (await this.serviceService.getAllServices(this.selectedDivision!));
      this.API.setLoading(false);
    }
    if(fromService && shouldRefresh){
      if(this.selectedService){
        this.API.sendFeedback('success', 'Service has been updated!',5000);
      }else{
        this.API.sendFeedback('success', 'New service has been added!',5000);
      }
    }
  }
}
