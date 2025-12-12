import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="card auth-card fade-in">
        <div class="header">
          <h1>Bienvenido</h1>
          <p>Ingresa para gestionar el voluntariado</p>
        </div>
        
        @if (errorMessage) {
          <div class="error-alert">{{ errorMessage }}</div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              placeholder="ejemplo@correo.com"
              [class.error]="isFieldInvalid('email')"
            >
            @if (isFieldInvalid('email')) {
              <small class="error-text">Se requiere un correo válido</small>
            }
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              placeholder="Tu contraseña"
              [class.error]="isFieldInvalid('password')"
            >
            @if (isFieldInvalid('password')) {
              <small class="error-text">La contraseña es requerida</small>
            }
          </div>

          <button type="submit" class="btn btn-primary full-width" [disabled]="loginForm.invalid || isLoading">
            @if (isLoading) {
              <span class="loader"></span> Ingresando...
            } @else {
              Iniciar Sesión
            }
          </button>
        </form>

        <div class="footer">
          <p>¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: radial-gradient(circle at top right, #f1f5f9 0%, #e2e8f0 100%);
      padding: 1rem;
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 3rem;
      border: 1px solid white;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(20px);
    }

    .header {
      text-align: center;
      margin-bottom: 2.5rem;
      
      h1 { margin-bottom: 0.5rem; font-size: 2rem; }
      p { color: var(--text-muted); font-size: 1rem; }
    }

    .full-width {
      width: 100%;
      margin-top: 1.5rem;
      padding: 1rem;
    }

    .footer {
      text-align: center;
      margin-top: 2rem;
      font-size: 0.95rem;
      color: var(--text-muted);
      
      a {
        color: var(--accent-color);
        text-decoration: none;
        font-weight: 600;
        
        &:hover { text-decoration: underline; }
      }
    }

    .error-alert {
      background: var(--error-bg);
      color: var(--error-color);
      padding: 1rem;
      border-radius: var(--radius-sm);
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }

    .error-text {
      color: var(--error-color);
      font-size: 0.85rem;
      display: block;
      margin-top: 0.4rem;
    }

    input.error {
      border-color: var(--error-color);
      &:focus { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoading = false;
  errorMessage = '';

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error(error);
      this.errorMessage = this.mapFirebaseError(error.code);
    } finally {
      this.isLoading = false;
    }
  }

  mapFirebaseError(code: string): string {
    switch (code) {
      case 'auth/user-not-found': return 'Usuario no encontrado.';
      case 'auth/wrong-password': return 'Contraseña incorrecta.';
      case 'auth/invalid-email': return 'Formato de correo inválido.';
      case 'auth/invalid-credential': return 'Correo o contraseña incorrectos. ¿Te has registrado?';
      default: return 'Error al iniciar sesión. Intenta de nuevo.';
    }
  }
}
