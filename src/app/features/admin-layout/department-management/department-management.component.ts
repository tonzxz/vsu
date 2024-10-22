import { Component } from '@angular/core';
import { Department } from './types/department.types';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';
import { DepartmentService } from '../../../services/department.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LottieAnimationComponent } from '../../../shared/components/lottie-animation/lottie-animation.component';
import { ConfirmationComponent } from '../../../shared/modals/confirmation/confirmation.component';
import { CreateDepartmentComponent } from './modals/create-department/create-department.component';

@Component({
  selector: 'app-department-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LottieAnimationComponent, ConfirmationComponent,CreateDepartmentComponent],
  templateUrl: './department-management.component.html',
  styleUrl: './department-management.component.css'
})
export class DepartmentManagementComponent {
  

  departments: Department[]=[];
  isSuperAdmin:boolean = this.auth.accountLoggedIn() == 'superadmin';

  selectedDepartment?:Department;

  modalType?:'maintenance'|'delete';

  openDepartmentModal:boolean = false;

  // Injecting ChangeDetectorRef to trigger manual change detection
  constructor(
    private auth:UswagonAuthService,private API:UswagonCoreService,
    private departmentService:DepartmentService) {}
  ngOnInit(): void {
    this.loadContent();
  }

  async loadContent(){
    this.API.setLoading(true);

    this.departments = (await this.departmentService.getAllDepartments());
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
  

  addDepartment(){
    this.selectedDepartment = undefined;
    this.openDepartmentModal = true;
  }

  updateDepartment(department:Department){
    this.selectedDepartment = department;
    this.openDepartmentModal = true;
  }

  async deleteDepartment(item:Department){
    this.API.setLoading(true);
    try{
      await this.departmentService.deleteDepartment(item.id!);
      await this.closeDialog(true);
      this.API.sendFeedback('success', 'Service has been deleted!',5000);
    }catch(e:any){
      this.API.sendFeedback('success', e.message,5000);
    }
  }

  selectDepartment(item:Department){
    this.selectedDepartment = item;
  }

  

  openDialog(type:'maintenance'|'delete'){
    this.modalType = type;
  }
  async closeDialog(shouldRefresh:boolean){
    const fromService = this.openDepartmentModal;
    this.openDepartmentModal = false;
    this.modalType = undefined;
    if(shouldRefresh){
      this.API.setLoading(true);
      this.departments = (await this.departmentService.getAllDepartments());
      this.API.setLoading(false);
    }
    if(fromService && shouldRefresh){
      if(this.selectedDepartment){
        this.API.sendFeedback('success', 'Service has been updated!',5000);
      }else{
        this.API.sendFeedback('success', 'New service has been added!',5000);
      }
    }
  }
}
