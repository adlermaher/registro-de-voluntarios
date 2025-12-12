import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { VolunteerService } from '../volunteers/services/volunteer.service';
import { ActivityService } from '../activities/services/activity.service';
import { map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, InitialsPipe],
  template: `
    <div class="page-container fade-in">
      <div class="welcome-section">
        <h1>¡Hola de nuevo!</h1>
        <p class="subtitle">Resumen de la actividad de hoy</p>
      </div>

      <div class="stats-grid">
        <div class="card stat-card blue">
          <div class="stat-content">
            <h3>Total Voluntarios</h3>
            <p class="number">{{ (stats$ | async)?.volunteersCount || 0 }}</p>
          </div>
          <div class="icon">👥</div>
        </div>

        <div class="card stat-card green">
          <div class="stat-content">
            <h3>Actividades Activas</h3>
            <p class="number">{{ (stats$ | async)?.activeActivitiesCount || 0 }}</p>
          </div>
          <div class="icon">🚀</div>
        </div>

        <div class="card stat-card purple">
          <div class="stat-content">
            <h3>Pendientes</h3>
            <p class="number">{{ (stats$ | async)?.pendingVolunteersCount || 0 }}</p>
          </div>
          <div class="icon">⏳</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card recent-section">
          <div class="section-header">
            <h2>Voluntarios Recientes</h2>
            <a routerLink="/volunteers" class="link">Ver Todo</a>
          </div>
          
          <div class="list">
            @for (vol of (recentVolunteers$ | async); track vol.id) {
              <div class="list-item">
                <div class="avatar">{{ vol.fullName | initials }}</div>
                <div class="info">
                  <h4>{{ vol.fullName }}</h4>
                  <p>{{ vol.email }}</p>
                </div>
                <span class="status" [class]="getStatClass(vol.status)">{{ mapStatus(vol.status) }}</span>
              </div>
            }
            @if ((recentVolunteers$ | async)?.length === 0) {
              <p class="empty">No hay voluntarios recientes.</p>
            }
          </div>
        </div>

        <div class="quick-actions card">
          <h2>Acciones Rápidas</h2>
          <div class="action-buttons">
            <a routerLink="/volunteers/new" class="btn btn-primary full-width">
              + Registrar Voluntario
            </a>
            <a routerLink="/activities/new" class="btn btn-accent full-width">
              + Crear Actividad
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Same styles as before, just translated content */
    .page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    
    .welcome-section { margin-bottom: 3rem; }
    .subtitle { color: var(--text-muted); font-size: 1.1rem; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem;
      border-left: 5px solid transparent;
      
      &.blue { border-left-color: #3b82f6; .icon { color: #3b82f6; background: #eff6ff; } }
      &.green { border-left-color: #10b981; .icon { color: #10b981; background: #ecfdf5; } }
      &.purple { border-left-color: #8b5cf6; .icon { color: #8b5cf6; background: #f5f3ff; } }

      .stat-content {
        h3 { font-size: 0.95rem; color: var(--text-muted); margin: 0; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
        .number { font-size: 2.5rem; font-weight: 800; color: var(--primary-color); margin: 0.5rem 0 0; }
      }

      .icon {
        width: 60px;
        height: 60px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
      }
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f1f5f9;
      
      h2 { font-size: 1.5rem; margin: 0; }
      .link { color: var(--accent-color); text-decoration: none; font-weight: 600; }
    }

    .list-item {
      display: flex;
      align-items: center;
      padding: 1.25rem 0;
      border-bottom: 1px solid #f8fafc;
      transition: background 0.2s;
      
      &:hover { background: #f8fafc; padding-left: 0.5rem; padding-right: 0.5rem; border-radius: 8px; }
      &:last-child { border-bottom: none; }
    }

    .avatar {
      width: 48px;
      height: 48px;
      background: var(--primary-light);
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1.25rem;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .info {
      flex: 1;
      h4 { margin: 0; font-size: 1rem; font-weight: 600; }
      p { margin: 0; font-size: 0.9rem; color: var(--text-muted); }
    }

    .status {
      font-size: 0.75rem;
      padding: 0.35rem 0.85rem;
      border-radius: 99px;
      font-weight: 700;
      
      &.active { color: #166534; background: #dcfce7; }
      &.pending { color: #92400e; background: #fef3c7; }
      &.inactive { color: #991b1b; background: #fee2e2; }
    }

    .quick-actions {
      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
      }
      .full-width { width: 100%; text-align: center; }
    }
    
    .empty { color: var(--text-muted); text-align: center; padding: 2rem; font-style: italic; }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
  private volunteerService = inject(VolunteerService);
  private activityService = inject(ActivityService);

  // Stats Logic
  stats$ = combineLatest([
    this.volunteerService.getVolunteers(),
    this.activityService.getActivities()
  ]).pipe(
    map(([volunteers, activities]) => ({
      volunteersCount: volunteers.length,
      pendingVolunteersCount: volunteers.filter(v => v.status === 'Pending').length,
      activeActivitiesCount: activities.filter(a => a.status === 'Open').length
    }))
  );

  recentVolunteers$ = this.volunteerService.getVolunteers().pipe(
    map(volunteers => volunteers.slice(0, 5))
  );

  mapStatus(status: string): string {
    const map: any = { 'Active': 'Activo', 'Inactive': 'Inactivo', 'Pending': 'Pendiente' };
    return map[status] || status;
  }

  getStatClass(status: string): string {
    return status.toLowerCase();
  }
}
