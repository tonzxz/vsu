import { Injectable } from '@angular/core';

export interface User {
  username: string;
  fullName: string;
  department: string;
  type: string;
  status: 'Online' | 'Offline';
  password?: string;
}

@Injectable({
  providedIn: 'root'
})

// for Kiosk
export class UserService {
  private users: User[] = [
    {
      username: 'Carlo',
      fullName: 'Carlo Batumbakal',
      department: 'Cash Division',
      type: 'Desk Attendant',
      status: 'Online',
    },
    {
      username: 'Jhielo',
      fullName: 'Jhielo Gonzales',
      department: 'Accounting Office',
      type: 'Kiosk',
      status: 'Online',
      password: '111111',
    },
    {
      username: 'Orlan',
      fullName: 'Jan Orlan Cardona',
      department: 'Registrar',
      type: 'Kiosk',
      status: 'Offline',
      password: '222222',
    },
    {
      username: 'Sean',
      fullName: 'Sean Palacay',
      department: 'Cash Division',
      type: 'Kiosk',
      status: 'Online',
      password: '333333',
    },
  ];

  getUserByPassword(password: string): User | undefined {
    return this.users.find(user => user.password === password && user.type.toLowerCase() === 'kiosk');
  }
}
