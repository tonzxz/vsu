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
      'terminals.id',             
      'terminals.number',         
      'desk_attendants.fullname', 
      'desk_attendants.username', 
      'divisions.name AS division',
      'terminals.is_online'
    ],
    tables: 'terminals', 
    conditions: `
      LEFT JOIN desk_attendants ON terminals.desk_attendant_id = desk_attendants.id
      LEFT JOIN divisions ON terminals.division_id = divisions.id
    ` 
  });
  
  if (data.success && data.output.length > 0) {
    for (let user of data.output) {
      console.log('User Data:', user);  
    
    }
  } else {
    console.error('No users found or query failed');
  }
}

  
}






