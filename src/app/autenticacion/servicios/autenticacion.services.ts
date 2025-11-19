import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  usuarioActual$: Observable<any>;

  constructor(private auth: Auth) {
    this.usuarioActual$ = new Observable(observer => {
      onAuthStateChanged(this.auth, user => observer.next(user));
    });
  }

  iniciarSesion(correo: string, clave: string) {
    return signInWithEmailAndPassword(this.auth, correo, clave);
  }

  registrarUsuario(correo: string, clave: string) {
    return createUserWithEmailAndPassword(this.auth, correo, clave);
  }

  cerrarSesion() {
    return signOut(this.auth);
  }
}
