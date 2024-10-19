import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

 constructor(
  // private datePipe:DatePipe,
  private API:UswagonCoreService,private auth:UswagonAuthService) { }

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
    throw new Error('Unable to delete terminal');
  }
}

 async getAllTerminals(division_id:string){
  
      const response = await this.API.read({
        selectors: ['divisions.name as division, terminal_sessions.*, desk_attendants.fullname as attendant, terminals.*'],
        tables: 'terminals',
        conditions: `
          LEFT JOIN divisions ON divisions.id = terminals.division_id
          LEFT JOIN terminal_sessions ON terminal_sessions.terminal_id = terminals.id
          LEFT JOIN desk_attendants ON terminal_sessions.attendant_id = desk_attendants.id
          WHERE terminals.division_id = '${division_id}' 
          GROUP BY terminals.id, divisions.id, terminal_sessions.id,desk_attendants.id
          ORDER BY terminals.number ASC , terminal_sessions.last_active DESC
          `});
   
    if(response.success){
      return response.output;
    }else{
      alert(response.output);
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

  async startTerminalSession(terminal_id:string){
    const lastSession = await this.getActiveSession();
    if(lastSession){
      const closeResponse = await this.API.update({
        tables: 'terminals',
        values:{
          status: 'closed'
        }  ,
        conditions: `WHERE id = '${terminal_id}'`
      });
    
      if(!closeResponse.success){
        throw new Error('Unable to update terminal session');
      }
    }
    const id = this.API.createUniqueID32();
    const now = new Date();
    const response = await this.API.create({
      tables: 'terminal_sessions',
      values:{
        id:id,
        terminal_id: terminal_id,
        attendant_id:this.auth.getUser().id,
        start_time: new DatePipe('en-US').transform(now, 'yyyy-MM-dd HH:mm:ss.SSSSSS'),
        last_active: new DatePipe('en-US').transform(now, 'yyyy-MM-dd HH:mm:ss.SSSSSS')
      }  
    });
  
    if(!response.success){
      throw new Error('Unable to start terminal session');
    }
  }
  
  async getActiveSession(){
    
    const response = await this.API.read({
      selectors: ['*'],
      tables: 'terminal_sessions',
      conditions: `WHERE attendant_id = '${this.auth.getUser().id}' AND status != 'closed'
        ORDER BY last_active DESC
      `
    });

    if(!response.success){
      throw new Error('Unable to gets terminal session');
    }


    if(response.output.length <= 0){
      return null;
    }else{
      const lastSession = response.output[0];
      const now = new Date(); 
      const lastActive = new Date(lastSession.last_active);
 
      const diffInMinutes = (now.getTime() - lastActive.getTime()) / 60000; 
      if (diffInMinutes <= 1.5) {
        return lastSession; 
      }else{
        return null;
      }
    }
    
  }

  async updateTerminalSession(terminal_id:string){
    const now = new Date();
    const response = await this.API.update({
      tables: 'terminals',
      values:{
        last_active: new DatePipe('en-US').transform(now, 'yyyy-MM-dd HH:mm:ss.SSSSSS')
      }  ,
      conditions: `WHERE id = '${terminal_id}'`
    });
  
    if(!response.success){
      throw new Error('Unable to update terminal session');
    }
  }
}
