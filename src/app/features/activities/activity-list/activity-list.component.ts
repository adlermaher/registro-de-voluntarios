import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivityService } from '../services/activity.service';
import { Observable } from 'rxjs';
import { Activity } from '../../../core/models/activity.model';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="page-container fade-in">
      <div class="header-actions">
        <div>
          <h1>Actividades</h1>
          <p class="subtitle">Gestiona eventos y proyectos</p>
        </div>
        <a routerLink="/activities/new" class="btn btn-primary">
          + Nueva Actividad
        </a>
      </div>

      <div class="grid-container">
        @if (activities$ | async; as activities) {
          @if (activities.length === 0) {
            <div class="empty-state">
              <p>No se encontraron actividades.</p>
            </div>
          } @else {
            @for (activity of activities; track activity.id) {
              <div class="card activity-card">
                <div class="card-image-placeholder">
                  <span>{{ activity.title | slice:0:1 }}</span>
                </div>
                <div class="card-content">
                  <div class="card-header">
                    <h3>{{ activity.title }}</h3>
                    <span class="badge" [class]="activity.status.toLowerCase()">{{ mapStatus(activity.status) }}</span>
                  </div>
                  
                  <div class="details">
                    <p>📅 {{ activity.date?.toDate ? (activity.date.toDate() | date:'dd/MM/yyyy') : activity.date }}</p>
                    <p>📍 {{ activity.location }}</p>
                    <p>👥 {{ activity.maxVolunteers }} Voluntarios Max</p>
                  </div>
                  
                  <div class="actions">
                    <a [routerLink]="['/activities/edit', activity.id]" class="btn btn-outline btn-sm">Editar</a>
                    <button (click)="deleteActivity(activity.id!)" class="btn btn-danger btn-sm">Eliminar</button>
                  </div>
                </div>
              </div>
            }
          }
        } @else {
          <div class="loading">Cargando actividades...</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .activity-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: none;
    }

    .card-image-placeholder {
      height: 140px;
      background: var(--accent-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 3.5rem;
      font-weight: 800;
      opacity: 1;
    }

    .card-content { padding: 2rem; flex: 1; display: flex; flex-direction: column; }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      
      h3 { font-size: 1.35rem; margin: 0; color: var(--primary-color); }
    }

    .details p {
      margin: 0.75rem 0;
      color: var(--text-muted);
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .actions {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 1.5rem;
      border-top: 1px solid #f1f5f9;
    }
    
    .badge {
        &.open { background: #dcfce7; color: #166534; }
        &.closed { background: #fee2e2; color: #991b1b; }
        &.completed { background: #e2e8f0; color: #475569; }
    }
  `]
})
export class ActivityListComponent {
  private activityService = inject(ActivityService);
  activities$: Observable<Activity[]> = this.activityService.getActivities();

  async deleteActivity(id: string) {
    if (confirm('¿Eliminar esta actividad?')) {
      await this.activityService.deleteActivity(id);
    }
  }

  mapStatus(status: string): string {
    const map: any = { 'Open': 'Abierta', 'Closed': 'Cerrada', 'Completed': 'Completada' };
    return map[status] || status;
  }
}
