import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" *ngIf="authService.user$ | async">
      <div class="nav-brand">
        <a routerLink="/dashboard">VOLUNTARIOS HUB</a>
      </div>
      
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active">Inicio</a>
        <a routerLink="/volunteers" routerLinkActive="active">Voluntarios</a>
        <a routerLink="/activities" routerLinkActive="active">Actividades</a>
      </div>

      <div class="nav-user">
        <button (click)="logout()" class="btn btn-outline btn-sm">
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 2.5rem;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      transition: all 0.3s ease;
    }

    .nav-brand a {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-color);
      text-decoration: none;
      letter-spacing: -0.03em;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      display: flex;
      gap: 2.5rem;
      
      a {
        text-decoration: none;
        color: var(--text-muted);
        font-weight: 500;
        font-size: 0.95rem;
        transition: all 0.2s;
        position: relative;
        
        &:hover { color: var(--primary-color); }
        
        &.active { 
          color: var(--accent-color); 
          font-weight: 600;
          
          &::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--accent-color);
            border-radius: 2px;
          }
        }
      }
    }

    .btn-sm {
      padding: 0.5rem 1.25rem;
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      .navbar { 
        flex-direction: column; 
        gap: 1.5rem; 
        padding: 1.5rem;
      }
      .nav-links { 
        gap: 1.5rem; 
        font-size: 1rem; 
      }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
