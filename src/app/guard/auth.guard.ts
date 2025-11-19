
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}
  canActivate() {
    return new Promise<boolean>(resolve => {
      this.auth.onAuthStateChanged(user => {
        if (user) resolve(true);
        else { this.router.navigate(['/login']); resolve(false); }
      });
    });
  }
}
