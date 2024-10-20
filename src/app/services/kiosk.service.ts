import { Injectable } from '@angular/core';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';
import { DivisionService } from './division.service';


interface Kiosk{
  id:string;
  division_id:string;
  division:string;
  number:number;
  status:string;
  last_online:string;
}

@Injectable({
  providedIn: 'root'
})
export class KioskService {

  constructor(
    private divisionService: DivisionService,
    private API:UswagonCoreService, private auth:UswagonAuthService) { }

  // KIOSK specific

  public kiosk?:Kiosk;
  user:any = this.auth.getUser();
  isSuperAdmin:boolean = this.auth.accountLoggedIn() == 'superadmin';

  async kioskLogin(code:string){
    const response = await this.API.read({
      selectors: ['divisions.name as division,kiosks.*'],
      tables: 'kiosks, divisions',
      conditions: `
        WHERE kiosks.division_id = divisions.id 
        AND kiosks.code = '${code}'  
      `
    });
    if(response.success){
      if(response.output.length > 0){
        this.kiosk = response.output[0];
        if(this.kiosk!.status == 'maintenance'){
          throw new Error('Kiosk is in maintenance.');
        }
        localStorage.setItem('kiosk', JSON.stringify(this.kiosk));
        return response.output[0];
      }else{
        throw new Error('Invalid kiosk code.');
      }
    }else{
      throw new Error('Something went wrong.');
    }
  }


 async addKiosk(code:string){
  const checkResponse = await this.API.read({
    selectors:['*'],
    tables:'kiosks',
    conditions:`WHERE code = '${code}'`
  })

  if(checkResponse.success){
    if(checkResponse.output.length>0){
      throw new Error('Code is already in use');
    }
  }else{
    throw new Error('Something went wrong');
  }
   const id = this.API.createUniqueID32();
   const currentDivision = await this.divisionService.getDivision();
   const response = await this.API.create({
     tables: 'kiosks',
     values:{
       id:id,
       division_id: currentDivision!.id,
       code:code,
       status:'available'
     }  
   });
 
   if(!response.success){
     throw new Error('Something went wrong');
   }
 }
 
 async updateKioskStatus(id:string, status: 'available'|'maintenance'){
   const response = await this.API.update({
     tables: 'kiosks',
     values:{
       status:status
     }  ,
     conditions: `WHERE id = '${id}'`
   });
 
   if(!response.success){
     throw new Error('Unable to add terminal');
   }
 }

 async updateKiosk(id:string, code:string){
  const checkResponse = await this.API.read({
    selectors:['*'],
    tables:'kiosks',
    conditions:`WHERE code = '${code}'`
  })

  if(checkResponse.success){
    if(checkResponse.output.length>0){
      throw new Error('Code is already in use');
    }
  }else{
    throw new Error('Something went wrong');
  }
  

  const response = await this.API.update({
    tables: 'kiosks',
    values:{
      code:code
    }  ,
    conditions: `WHERE id = '${id}'`
  });

  if(!response.success){
    throw new Error('Something went wrong.');
  }
}
 async deleteKiosk(id:string){
   const response = await this.API.delete({
     tables: 'kiosks',
     conditions: `WHERE id = '${id}'`
   });
 
   if(!response.success){
     throw new Error('Unable to delete kiosk');
   }
 }
 
  async getAllKiosks(division_id:string){
   
     const response = await this.API.read({
         selectors: ['divisions.name as division, kiosks.*'],
         tables: 'kiosks,divisions',
         conditions: `
           WHERE kiosks.division_id = '${division_id}'  AND divisions.id = kiosks.division_id
           ORDER BY number ASC`
       });
    
     if(response.success){
       return response.output;
     }else{
       throw new Error('Unable to fetch kiosks');
     }
   }
  async getKiosks( status:'available'|'maintenance',division?:string,){
     let division_id;
   
     if(!division){
       division_id =  this.user.division_id;
     }else{
       division_id = division;
     }
 
 
     const response = await this.API.read({
       selectors: ['divisions.name as division, kiosks.*'],
       tables: 'kiosks,divisions',
       conditions: `
         WHERE kiosks.division_id = '${division_id}'  AND divisions.id = kiosks.division_id AND status == '${status}'
         ORDER BY number ASC`
     });
     
    
     if(response.success){
       return response.output;
     }else{
      
       throw new Error('Unable to fetch kiosks');
     }
   }
}
