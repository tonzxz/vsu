import { Injectable } from '@angular/core';

// Defines the Admin interface
export interface Admin {
  username: string;
  department: string;
  type: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // Initialize the users array with Admin type
  private users: Admin[] = [
    
    // Account for Kiosk
    {
      username: 'AC1',
      department: 'Accounting Office',
      type: 'Admin',
      password: 'password',
    },
    {
      username: 'AC2',
      department: 'Registrar',
      type: 'Admin',
      password: 'password',
    },
    {
      username: 'AC3',
      department: 'Cash Division',
      type: 'Admin',
      password: 'password',
    },
    {
      // Account for Desk attendant
      username: 'DA1',
      department: 'Accounting Office',
      type: 'Desk attendant',
      password: 'password',
    },
    {
      username: 'DA2',
      department: 'Registrar',
      type: 'Desk attendant',
      password: 'password',
    },
    {
      username: 'DA3',
      department: 'Cash Division',
      type: 'Desk attendant',
      password: 'password',
    },
  ];

  // Add any additional methods to manage users here
  getUsers(): Admin[] {
    return this.users;
  }
}
