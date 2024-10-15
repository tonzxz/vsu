import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UswagonCoreService } from 'uswagon-core';
import { UswagonAuthService } from 'uswagon-auth';

interface PartialUser {
  id: string;
  division_id:string;
  username: string;
  fullname: string;
  profile?: string;
  password?: string;
}

interface Divisions {
  id: string;
  name:string;
}
@Component({
  selector: 'app-create-account-modal',
  templateUrl: './create-account-modal.component.html',
  styleUrls: ['./create-account-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CreateAccountModalComponent {
  @Input() editingUser: boolean = false;
  @Input() user: PartialUser | null = null;
  @Input() divisions:Divisions[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() accountCreated = new EventEmitter<Omit<PartialUser, 'password'>>();

  newUser: PartialUser = {
    id: '',
    division_id:'',
    username: '',
    fullname: '',
    profile: '',
    password: ''
  };

  passwordVisible: boolean = false;
  showError: boolean = false;
  errorMessage: string = '';
  showPasswordField: boolean = false;

  isSuperAdmin:boolean = this.auth.accountLoggedIn() =='superadmin';

  constructor(public API: UswagonCoreService, private auth:UswagonAuthService) {}

  ngOnInit() {
    if (this.editingUser && this.user) {
      this.newUser = { ...this.user, password: '' };
    }
    if(!this.isSuperAdmin){
      this.newUser.division_id = this.auth.getUser().division_id;
    }
  }


  
  async submitForm() {
    try {
      if (this.editingUser) {
        await this.updateUser();
      } else {
        await this.createUser();
      }
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      this.showError = true;
      this.errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
    }
  }

  async createUser() {
    this.newUser.id = await this.API.createUniqueID32();
    if (this.newUser.password) {
      this.newUser.password = await this.API.hash(this.newUser.password);
    }

    const data = await this.API.create({
      tables: 'desk_attendants',
      values: this.newUser,
    });

    if (data.success) {
      console.log('User created:', data.output);
      const { password, ...userWithoutPassword } = this.newUser;
      this.accountCreated.emit(userWithoutPassword);
      this.close();
    } else {
      throw new Error(data.output || 'Failed to create user');
    }
  }

  async updateUser() {
    try {
      const changeDeets: any = {
        username: this.newUser.username,
        fullname: this.newUser.fullname,
        profile: this.newUser.profile || '' 
      };
  
      if (this.showPasswordField && this.newUser.password) {
        changeDeets.password = await this.API.hash(this.newUser.password);
      }
  
      const data = await this.API.update({
        tables: 'desk_attendants',
        values: changeDeets, 
        conditions: `WHERE id = '${this.newUser.id}'` 
      });
  
      if (data.success) {
        const { password, ...userWithoutPassword } = this.newUser; 
        this.accountCreated.emit(userWithoutPassword); 
        this.close(); 
      } else {
        throw new Error(data.output || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      this.showError = true;
      this.errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
    }
  }
  

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop();
      const newFileName = `${this.newUser.fullname.replace(/\s+/g, '_')}-${Date.now()}.${fileExtension}`;
      const location = `userProfiles/${newFileName}`;

      this.API.uploadFile(file, location)
        .then(() => {
          console.log('File uploaded successfully');
          this.newUser.profile = location;
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  togglePasswordField() {
    this.showPasswordField = !this.showPasswordField;
    if (!this.showPasswordField) {
      this.newUser.password = '';
    }
  }

  close() {
    this.closeModal.emit();
  }
}