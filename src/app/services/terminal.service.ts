import { Injectable } from '@angular/core';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

 constructor(private API:UswagonCoreService,private auth:UswagonAuthService) { }

 user:any = this.auth.getUser();
 isSuperAdmin:boolean = this.auth.accountLoggedIn() == 'superadmin';


async addTerminal(division_id:string){
  const id = this.API.createUniqueID32();
  const response = await this.API.create({
    tables: 'terminals',
    values:{
      id:id,
      division_id:division_id,
      status:'available'
    }  
  });

  if(!response.success){
    throw new Error('Unable to add terminal');
  }
}

async updateTerminalStatus(id:string, status: 'available'|'maintenance'){
  const response = await this.API.update({
    tables: 'terminals',
    values:{
      status:status
    }  ,
    conditions: `WHERE id = '${id}'`
  });

  if(!response.success){
    throw new Error('Unable to add terminal');
  }
}
async deleteTerminal(id:string){
  const response = await this.API.delete({
    tables: 'terminals',
    conditions: `WHERE id = '${id}'`
  });

  if(!response.success){
    throw new Error('Unable to add terminal');
  }
}

 async getAllTerminals(division_id:string){
  
    const response = await this.API.read({
        selectors: ['divisions.name as division, terminal_sessions.*,desk_attendants.fullname as attendant,terminals.*'],
        tables: 'terminals,divisions',
        conditions: `
          LEFT JOIN terminal_sessions ON terminal_sessions.terminal_id = terminal_id
          LEFT JOIN desk_attendants ON terminal_sessions.attendant_id = desk_attendants.id
          WHERE terminals.division_id = '${division_id}'  AND divisions.id = terminals.division_id
          ORDER BY number ASC`
      });
   
    if(response.success){
      return response.output;
    }else{
      throw new Error('Unable to fetch terminals');
    }
  }
 async getTerminals( status:'available'|'maintenance',division?:string,){
    let division_id;
  
    if(!division){
      division_id =  this.user.division_id;
    }else{
      division_id = division;
    }


    const response = await this.API.read({
      selectors: ['divisions.name as division, terminal_sessions.*,desk_attendants.fullname as attendant,terminals.*'],
      tables: 'terminals,divisions',
      conditions: `
        LEFT JOIN terminal_sessions ON terminal_sessions.terminal_id = terminal_id
        LEFT JOIN desk_attendants ON terminal_sessions.attendant_id = desk_attendants.id
        WHERE terminals.division_id = '${division_id}'  AND divisions.id = terminals.division_id AND status == '${status}'
        ORDER BY number ASC`
    });
    
   
    if(response.success){
      return response.output;
    }else{
     
      throw new Error('Unable to fetch terminals');
    }
  }
}
