import { Injectable, OnInit } from '@angular/core';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(private API:UswagonCoreService,private auth:UswagonAuthService) { 
  }


  public lastQueueNumber:number = 0;
  public queue:any[]=[];



  // Socket Events
  listenToQueue(division:string){
    this.API.addSocketListener('queue-counter-listener', (message)=>{
      if(message.event =='live-queue-counter' && message.divison ==division){
        this.lastQueueNumber = message.lastQueueNumber as number;
        this.getTodayQueues(division);
      }
    });
    this.API.addSocketListener('queue-attend-listener', (message)=>{
      if(message.event =='live-queue-attend' && message.divison ==division){
        this.getTodayQueues(division);
      }
    });
  }

  private incrementQueueNumber(division:string){
    this.lastQueueNumber += 1;
    this.API.socketSend({
      event: 'live-queue-counter',
      division:division,
      lastQueueNumber: this.lastQueueNumber
    });
  }

  private takeFromQueue(division:string){
    this.API.socketSend({
      event: 'live-queue-attend',
      division:division,
    });
  }

  // Managing queue
  async addToQueue(division:string, info:any){
    const id = this.API.createUniqueID32();
    this.incrementQueueNumber(division);
    const response = await this.API.create({
      tables: 'queue',
      values:{
        id: id,
        division_id: division,
        department_id: info.department.id,
        fullname: info.fullname,
        number: this.lastQueueNumber,
        type: info.type,
        gender: info.gender,
        status:'waiting',
        student_id: info.student.id
      }
    });
    if(!response.success){
      throw new Error('Something went wrong. Please try again.');
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
    this.takeFromQueue(this.queue[0].division_id);
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

  async getTodayQueues(division:string){
    const response = await this.API.read({
      selectors: ['*'],
      tables: 'queue',
      conditions: `WHERE division_id = '${division}' AND timestamp::date = CURRENT_DATE`
    });
    if(response.success){
      this.lastQueueNumber = response.output.length;
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
        AND terminal_sessions.attendant.id = '${user.id}'  AND attended_queue.status = 'ongoing'
      '`
    });
    if(response.success){
      return response.output;
    }else{
      throw new Error('Unable to fetch queue');
    }
  }

}
