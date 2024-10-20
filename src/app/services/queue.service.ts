import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';
import { KioskService } from './kiosk.service';
import { DivisionService } from './division.service';



interface Queue{
  id:string;
  division_id:string;
  number:number;
  status:string;
  timestamp:string;
  type:'regular'|'priority';
  fullname:string;
  department_id?:string;
  kiosk_id:string;
  gender:'male'|'female'|'other';
  student_id?:string;
}

@Injectable({
  providedIn: 'root'
})
export class QueueService  {

  constructor(private API:UswagonCoreService,private auth:UswagonAuthService, 
    private divisionService:DivisionService,
    private kioskService:KioskService) {}


  private lastRegularQueueNumber:number = 0;
  private lastPriorityQueueNumber:number = 0;
  private queue:Queue[]=[];
  private queueSubject = new BehaviorSubject<Queue[]>([]);
  public queue$ = this.queueSubject.asObservable();


  // Socket Events
  listenToQueue(){
    this.API.addSocketListener('live-queue-events-listener', (message)=>{
      if(message.division!= this.divisionService.selectedDivision!.id) return;

      if(message.event =='queue-counter' ){
        this.lastRegularQueueNumber = message.lastRegularQueueNumber as number;
        this.lastPriorityQueueNumber = message.lastPriorityQueueNumber as number;
      }
      if(message.event =='queue-attend'){
        this.getTodayQueues();
      }
      if(message.event =='update-queue'){
        this.getTodayQueues();
      }        
    });
  }

  private incrementQueueNumber(type:'regular'|'priority',division:string){
    if(type == 'regular'){
      this.lastRegularQueueNumber += 1;
    }else{
      this.lastPriorityQueueNumber += 1;
    }
    this.API.socketSend({
      event: 'queue-counter',
      division:division,
      lastRegularQueueNumber: this.lastRegularQueueNumber,
      lastPriorityQueueNumber: this.lastPriorityQueueNumber
    });
  }

  private decrementQueueNumber(type:'regular'|'priority',division:string){
    if(type == 'regular'){
      this.lastRegularQueueNumber -= 1;
    }else{
      this.lastPriorityQueueNumber -= 1;
    }
    this.API.socketSend({
      event: 'queue-counter',
      division:division,
      lastRegularQueueNumber: this.lastRegularQueueNumber,
      lastPriorityQueueNumber: this.lastPriorityQueueNumber
    });
  }

  private updateQueue(division:string){
    this.API.socketSend({
      event: 'update-queue',
      division:division
    });
  }

  private takeFromQueue(queue:any){
    this.API.socketSend({
      event: 'queue-attend',
      division:queue.division,
      id:queue.id,
    });
  }

  // Managing queue
  async addToQueue(
    info:{department_id?:string,
          fullname:string, 
          type:'regular'|'priority', 
          gender:'male'|'female'|'other'
          student_id?:string,
          services:string[],
        })
  {
    const id = this.API.createUniqueID32();
    this.incrementQueueNumber(info.type,this.kioskService.kiosk?.division_id!);
    const response = await this.API.create({
      tables: 'queue',
      values:{
        id: id,
        division_id: this.kioskService.kiosk?.division_id,
        kiosk_id:this.kioskService.kiosk?.id,
        department_id: info.department_id,
        fullname: info.fullname,
        number: info.type == 'regular' ? this.lastRegularQueueNumber: this.lastPriorityQueueNumber,
        type: info.type,
        gender: info.gender,
        status:'waiting',
        student_id: info.student_id
      }
    });
   for(let service_id of info.services){
    const intent_id = this.API.createUniqueID32();
    // Add services
    const servicesResponse = await this.API.create({
      tables: 'client_intents',
      values:{
        id: intent_id,
        queue_id: id,
        service_id: service_id
      }
    });
    if(!servicesResponse.success){
      this.decrementQueueNumber(info.type,this.kioskService.kiosk?.division_id!);
      throw new Error('Something went wrong.')
    }
   }
    

    
    if(!response.success){
      this.decrementQueueNumber(info.type,this.kioskService.kiosk?.division_id!);
      throw new Error('Something went wrong.');
    }else{
      this.updateQueue(this.kioskService.kiosk?.division_id!);
      return info.type == 'regular' ?  this.lastRegularQueueNumber:this.lastPriorityQueueNumber;
    }
  }

  async addQueueToAttended(id:string){
    const user = this.auth.getUser();
    try{
      const sessionResponse = await this.API.read({
        selectors: ['id'],
        tables: 'terminal_sessions',
        conditions: `WHERE attendant_id = '${user.id}'`
      });
  
      if(!sessionResponse.success)throw new Error('Something went wrong. Please try again.');
      if(sessionResponse.output.length == 0) throw new Error('Something went wrong. Please try again.');
      const session = sessionResponse.output[0];
      const updateResponse = await this.API.update({
        tables: 'queue',
        values:{
          status: 'taken',
        },
        conditions:`WHERE id = '${id}'`
      });
      if(!updateResponse.success) throw new Error();
  
      const createResponse = await this.API.create({
        tables:'attended_queue',
        values:{
          queue_id :id,
          session_id : session.id,
          status:'ongoing'
        }
      });
      if(!createResponse.success) throw new Error();
    }catch(e){
      throw new Error('Something went wrong. Please try again');
    }
  }

  async resolveAttendedQueue(attended_queuue_id:string, remark:'finished'|'skipped'){
    const timestamp  = new Date();
    try{
      const updateResponse = await this.API.update({
        tables: 'attended_queue',
        values:{
          finished_on: remark == 'skipped' ? null : timestamp.toISOString(),
          status: remark,
        },
        conditions:`WHERE id = '${attended_queuue_id}'`
      });
      if(!updateResponse.success) throw new Error();
    }catch(e){
      throw new Error('Something went wrong. Please try again');
    }
  }

  async nextQueue(attended_queuue_id?:string, remark?:'finished'|'skipped'){
    if(this.queue.length <= 0) return;
    if(attended_queuue_id && remark){
      await this.resolveAttendedQueue(attended_queuue_id,remark);
    }
    this.takeFromQueue(this.queue[0]);
    await this.addQueueToAttended(this.queue[0].id);
  }

  // Fetching of QUEUES
  async getAllQueues(division:string){
    const response = await this.API.read({
      selectors: ['*'],
      tables: 'queue',
      conditions: `WHERE division_id = '${division}'`
    });
    if(response.success){
      this.queue = response.output;
      return response.output;
    }else{
      throw new Error('Unable to fetch queue');
    }
  }

  async getTodayQueues(){
    const response = await this.API.read({
      selectors: ['*'],
      tables: 'queue',
      conditions: `WHERE division_id = '${this.divisionService.selectedDivision}' AND timestamp::date = CURRENT_DATE`
    });
    if(response.success){
      const queue = response.output as Queue[];
      this.lastPriorityQueueNumber =queue.filter(queue=> queue.type == 'priority').length;
      this.lastRegularQueueNumber =queue.filter(queue=> queue.type == 'regular').length;
      this.queueSubject.next(queue.sort((a,b)=>{ 
        if (a.type === 'priority' && b.type === 'regular') return -1;
        if (a.type === 'regular' && b.type === 'priority') return 1;

        // If types are equal, sort by number
        return a.number - b.number;
      }));
      return response.output;
    }else{
      throw new Error('Unable to fetch queue');
    }
  }
  
  async getOngoingQueues(division:string){
    const response = await this.API.read({
      selectors: ['*'],
      tables: 'queue',
      conditions: `
        WHERE division_id = '${division} AND status = 'waiting'
        ORDER BY timestamp DESC
      '`
    });
    if(response.success){
      return response.output;
    }else{
      throw new Error('Unable to fetch queue');
    }
  }
  
  async getAttendedQueues(division:string){
    const response = await this.API.read({
      selectors: ['*'],
      tables: 'attended_queue, queue',
      conditions: `
        WHERE attended_queue.queue.id = queue.id  AND queue.division_id = '${division}
        ORDER BY timestamp DESC
      '`
    });
    if(response.success){
      return response.output;
    }else{
      throw new Error('Unable to fetch queue');
    }
  }

  async getDisposedQueues(division:string){
    const response = await this.API.read({
      selectors: ['*'],
      tables: 'queue',
      conditions: `
        WHERE division_id = '${division} AND status = 'waiting'
        ORDER BY timestamp DESC
      '`
    });
    if(response.success){
      return response.output;
    }else{
      throw new Error('Unable to fetch queue');
    }
  }

  async getQueueOnDesk(division:string){
    const user = this.auth.getUser();
    const response = await this.API.read({
      selectors: ['*'],
      tables: 'attended_queue, queue, terminal_sessions',
      conditions: `
        WHERE attended_queue.queue.id = queue.id AND queue.division_id = '${division}' 
        AND terminal_sessions.attendant_id = '${user.id}'  AND attended_queue.status = 'ongoing'
      '`
    });
    if(response.success){
      return response.output;
    }else{
      throw new Error('Unable to fetch queue');
    }
  }

  

}
