import { Injectable } from '@angular/core';
import { UswagonCoreService } from 'uswagon-core';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

constructor(private API: UswagonCoreService) {

}


async fetchUsers() {
  const data = await this.API.read({
    selectors: [
      '*'
    ],
    tables: 'terminals',
    conditions: ``
  });
  
  if(data.success && data.output.length > 0){
   console.log(data.output[0]);
   for(let users of data.output){
     console.log(users);
   }
  }
}


  
}






