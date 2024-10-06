import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { UswagonAuthService } from 'uswagon-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private auth:UswagonAuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const currentUser = this.auth.accountLoggedIn();
    const requiredRole = ['admin', 'desk_attendant'];

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    if (this.checkUserRole(currentUser, requiredRole)) {
      return true;
    }

    if (currentUser.toLowerCase() === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (currentUser.toLowerCase() === 'desk_attendant') {
      this.router.navigate(['/desk-attendant/dashboard']);
    }
    return false;
  }

  private checkUserRole(userRole: string, requiredRole: string[]): boolean {
    return requiredRole.includes(userRole)
  }
}