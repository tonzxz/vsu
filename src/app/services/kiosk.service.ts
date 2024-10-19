import { Injectable } from '@angular/core';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';


interface Kiosk{
  id:string;
  division_id:string;
  division:string;
  number:number;
  last_online:string;
}

@Injectable({
  providedIn: 'root'
})
export class KioskService {

  constructor(private API:UswagonCoreService, private auth:UswagonAuthService) { }

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
        AND kiosks.code = '${code}'  AND status = 'available'
      `
    });
    if(response.success){
      if(response.output.length > 0){
        this.kiosk = response.output[0];
        localStorage.setItem('kiosk', JSON.stringify(this.kiosk));
        return response.output[0];
      }else{
        throw new Error('Invalid kiosk code.');
      }
    }else{
      throw new Error(response.output);
    }
  }


 async addKiosk(division_id:string){
   const id = this.API.createUniqueID32();
   const response = await this.API.create({
     tables: 'kiosks',
     values:{
       id:id,
       division_id:division_id,
       code:'sometest',
       status:'available'
     }  
   });
 
   if(!response.success){
    alert(response.output);
     throw new Error('Unable to add kiosks');
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
