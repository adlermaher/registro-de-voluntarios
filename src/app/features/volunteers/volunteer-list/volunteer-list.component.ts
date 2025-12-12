import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { VolunteerService } from '../services/volunteer.service';
import { Volunteer } from '../../../core/models/volunteer.model';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-volunteer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="page-container fade-in">
      <div class="header-actions">
        <div>
          <h1>Voluntarios</h1>
          <p class="subtitle">Gestiona tu equipo de colaboradores</p>
        </div>
        <a routerLink="/volunteers/new" class="btn btn-primary">
          + Nuevo Voluntario
        </a>
      </div>

      <div class="filters card">
        <div class="search-box">
          <input 
            type="text" 
            [formControl]="searchControl" 
            placeholder="Buscar por nombre o correo..."
          >
          <span class="icon">🔍</span>
        </div>
      </div>

      <div class="grid-container">
        @if (filteredVolunteers$ | async; as volunteers) {
          @if (volunteers.length === 0) {
            <div class="empty-state">
              <p>No se encontraron voluntarios.</p>
            </div>
          } @else {
            @for (vol of volunteers; track vol.id) {
              <div class="card volunteer-card">
                <div class="card-header">
                  <h3>{{ vol.fullName }}</h3>
                  <span class="badge" [class]="vol.status.toLowerCase()">{{ mapStatus(vol.status) }}</span>
                </div>
                <div class="card-body">
                  <p><strong>Correo:</strong> {{ vol.email }}</p>
                  <p><strong>Teléfono:</strong> {{ vol.phone }}</p>
                  <p><strong>Disponibilidad:</strong> {{ mapAvailability(vol.availability) }}</p>
                </div>
                <div class="card-actions">
                  <a [routerLink]="['/volunteers/edit', vol.id]" class="btn btn-outline btn-sm">Editar</a>
                  <button (click)="deleteVolunteer(vol.id!)" class="btn btn-danger btn-sm">Eliminar</button>
                </div>
              </div>
            }
          }
        } @else {
          <div class="loading">Cargando voluntarios...</div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* Using new Design System globals automatically */
    .filters {
      padding: 1.5rem;
      margin-bottom: 2rem;
      background: white;
    }

    .search-box {
      position: relative;
      max-width: 500px;
      
      input {
        padding-left: 3rem; 
      }
      
      .icon {
        position: absolute;
        left: 1.2rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-muted);
        font-size: 1.1rem;
      }
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .volunteer-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      
      &:hover { border-color: var(--accent-color); }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      
      h3 { font-size: 1.3rem; margin: 0; font-weight: 700; color: var(--primary-color); }
    }

    .card-body {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      flex: 1;
      
      p { margin-bottom: 0.75rem; word-break: break-all; }
      strong { color: var(--text-main); font-weight: 600; }
    }

    .card-actions {
      display: flex;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid #f1f5f9;
    }
    
    .empty-state, .loading { padding: 3rem; text-align: center; color: var(--text-muted); font-size: 1.1rem; }
  `]
})
export class VolunteerListComponent implements OnInit {
  private volunteerService = inject(VolunteerService);

  searchControl = new FormControl('');

  volunteers$ = this.volunteerService.getVolunteers();

  filteredVolunteers$: Observable<Volunteer[]> = combineLatest([
    this.volunteers$,
    this.searchControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([volunteers, searchTerm]) => {
      const term = (searchTerm || '').toLowerCase();
      return volunteers.filter(v =>
        v.fullName.toLowerCase().includes(term) ||
        v.email.toLowerCase().includes(term)
      );
    })
  );

  ngOnInit() { }

  async deleteVolunteer(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este voluntario?')) {
      await this.volunteerService.deleteVolunteer(id);
    }
  }

  mapStatus(status: string): string {
    const map: any = { 'Active': 'Activo', 'Inactive': 'Inactivo', 'Pending': 'Pendiente' };
    return map[status] || status;
  }

  mapAvailability(val: string): string {
    const map: any = { 'Weekdays': 'Entre Semana', 'Weekends': 'Fines de Semana', 'Flexible': 'Flexible' };
    return map[val] || val;
  }
}
