import { Injectable } from '@angular/core';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';
import { environment } from '../../environment/environment';

interface Division{
  id:string;
  name:string;
}

@Injectable({
  providedIn: 'root'
})
export class DivisionService {

  constructor(private auth:UswagonAuthService, private API:UswagonCoreService) {}

  private isSuperAdmin:boolean = this.auth.accountLoggedIn()=='superadmin';
  private adminID:string = environment.administrators;
  public selectedDivision?:Division;
  public divisions:Division[] = [];

  async setDivision(division:Division){
    this.selectedDivision = division;
  }

  async getDivisions():Promise<Division[]>{
    try{
      const response = await this.API.read({
        selectors: ['*'],
        tables: 'divisions',
        conditions: `WHERE id != '${this.adminID}'`,
      });
  
      if(response.success){
        this.divisions = response.output as Division[];
        if(this.divisions.length>0){
          this.selectedDivision = this.divisions[0];
        }
        return this.divisions;
      }else{
        throw new Error('Error getting divisions.');
      }
    }catch(e:any){
      throw new Error('Something went wrong.');
    }
  }

  async getDivision(id?:string):Promise<Division|undefined>{
    if(this.isSuperAdmin){
      if(this.selectedDivision){
        return this.selectedDivision;
      }else{
        this.divisions =  await  this.getDivisions();
        if(this.divisions.length<=0) throw new Error('Error fetching divisions');
        this.selectedDivision = this.divisions[0];
        return this.selectedDivision;
      }
    }
    try{
      const response = await this.API.read({
        selectors: ['*'],
        tables: 'divisions',
        conditions: `WHERE id = '${ id ? id: this.auth.getUser().division_id}' `,
      });
      if(response.success){
        if(response.output.length <= 0) return undefined;
        return response.output[0];
      }else{
        throw new Error();
      }
    }catch(e:any){
      throw new Error('Something went wrong');
    }

   
  }
}
