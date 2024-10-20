export interface Kiosk{
    id?:string;
    number?:number;
    division_id?:string;
    code:string;
    last_online?:string;
    status?:string;
  }
  
export interface Division{
    id:string;
    name:string;
}
  