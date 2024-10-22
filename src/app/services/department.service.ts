import { Injectable } from '@angular/core';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(
    private API:UswagonCoreService, private auth:UswagonAuthService) { }

  public department?:DepartmentService;
  user:any = this.auth.getUser();
  isSuperAdmin:boolean = this.auth.accountLoggedIn() == 'superadmin';



 async addDepartment(name:string){
  const checkResponse = await this.API.read({
    selectors:['*'],
    tables:'departments',
    conditions:`WHERE name = '${name}'`
  })

  if(checkResponse.success){
    if(checkResponse.output.length>0){
      throw new Error('This name is already in use!');
    }
  }else{
    throw new Error('Something went wrong');
  }
   const id = this.API.createUniqueID32();
   const response = await this.API.create({
     tables: 'departments',
     values:{
       id:id,
       name:name,
     }  
   });
 
   if(!response.success){
     throw new Error('Something went wrong');
   }
 }
 

 async updateDepartment(id:string, name:string){
  const checkResponse = await this.API.read({
    selectors:['*'],
    tables:'departments',
    conditions:`WHERE name = '${name}'`
  })

  if(checkResponse.success){
    if(checkResponse.output.length>0){
      throw new Error('This name is already in use!');
    }
  }else{
    throw new Error('Something went wrong');
  }
  

  const response = await this.API.update({
    tables: 'departments',
    values:{
      name:name
    }  ,
    conditions: `WHERE id = '${id}'`
  });

  if(!response.success){
    throw new Error('Something went wrong.');
  }
}
 async deleteDepartment(id:string){
   const response = await this.API.delete({
     tables: 'departments',
     conditions: `WHERE id = '${id}'`
   });
 
   if(!response.success){
     throw new Error('Unable to delete department');
   }
 }
 
  async getAllDepartments(){
   
     const response = await this.API.read({
         selectors: ['departments.*'],
         tables: 'departments',
         conditions: `
           ORDER BY departments.name`
       });
    
     if(response.success){
       return response.output;
     }else{
       throw new Error('Unable to fetch departments');
     }
   }
  async getDepartments( ){

 
     const response = await this.API.read({
       selectors: ['departments.*'],
       tables: 'departments',
       conditions: `
         ORDER BY departments.name ASC`
     });
     
    
     if(response.success){
       return response.output;
     }else{
      
       throw new Error('Unable to fetch departments');
     }
   }
}
