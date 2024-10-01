import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const currentUser = this.userService.getCurrentUser();
    const requiredRole = route.data['requiredRole'] as string;

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    if (this.checkUserRole(currentUser.role, requiredRole)) {
      return true;
    }

    if (currentUser.role.toLowerCase() === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (currentUser.role.toLowerCase() === 'desk attendant') {
      this.router.navigate(['/desk-attendant/dashboard']);
    }
    return false;
  }

  private checkUserRole(userRole: string, requiredRole: string): boolean {
    if (requiredRole === 'Admin') {
      return userRole.toLowerCase() === 'admin';
    }
    if (requiredRole === 'Desk Attendant') {
      return userRole.toLowerCase() === 'desk attendant';
    }
    return false;
  }
}