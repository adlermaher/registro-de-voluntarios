import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActivityService } from '../services/activity.service';
import { Activity } from '../../../core/models/activity.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container fade-in">
      <div class="card form-card">
        <div class="header">
          <h1>{{ isEdit ? 'Editar' : 'Crear' }} Actividad</h1>
          <p>Configura una nueva oportunidad de voluntariado</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <label for="title">Título</label>
            <input type="text" id="title" formControlName="title" [class.error]="isFieldInvalid('title')">
            @if (isFieldInvalid('title')) { <small class="error-text">Requerido</small> }
          </div>

          <div class="form-group">
            <label for="description">Descripción</label>
            <textarea id="description" formControlName="description" rows="4" [class.error]="isFieldInvalid('description')"></textarea>
            @if (isFieldInvalid('description')) { <small class="error-text">Requerido</small> }
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label for="date">Fecha</label>
              <input type="date" id="date" formControlName="date" [class.error]="isFieldInvalid('date')">
              @if (isFieldInvalid('date')) { <small class="error-text">Requerido</small> }
            </div>

            <div class="form-group">
              <label for="location">Ubicación</label>
              <input type="text" id="location" formControlName="location" [class.error]="isFieldInvalid('location')">
              @if (isFieldInvalid('location')) { <small class="error-text">Requerido</small> }
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label for="organizer">Organizador</label>
              <input type="text" id="organizer" formControlName="organizer" [class.error]="isFieldInvalid('organizer')">
              @if (isFieldInvalid('organizer')) { <small class="error-text">Requerido</small> }
            </div>

            <div class="form-group">
              <label for="maxVolunteers">Max Voluntarios</label>
              <input type="number" id="maxVolunteers" formControlName="maxVolunteers" [class.error]="isFieldInvalid('maxVolunteers')">
              @if (isFieldInvalid('maxVolunteers')) { <small class="error-text">Requerido</small> }
            </div>
          </div>

          <div class="form-group">
            <label for="status">Estado</label>
            <select id="status" formControlName="status">
              <option value="Open">Abierta</option>
              <option value="Closed">Cerrada</option>
              <option value="Completed">Completada</option>
            </select>
          </div>

          <div class="form-actions">
            <a routerLink="/activities" class="btn btn-outline">Cancelar</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || isLoading">
              {{ isLoading ? 'Guardando...' : 'Guardar Actividad' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      justify-content: center;
      padding: 3rem 1.5rem;
    }
    
    .form-card {
      width: 100%;
      max-width: 900px;
    }

    .header { margin-bottom: 2.5rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 1.5rem; }
    
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      @media (max-width: 768px) { grid-template-columns: 1fr; gap: 1rem; }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid #f1f5f9;
    }

    .error-text { color: var(--error-color); font-size: 0.8rem; margin-top: 6px; display: block; font-weight: 500; }
    textarea { width: 100%; padding: 1rem; border-radius: var(--radius-md); border: 2px solid #f1f5f9; font-family: inherit; transition: all 0.2s; }
    textarea:focus { outline: none; border-color: var(--accent-color); }
  `]
})
export class ActivityFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private activityService = inject(ActivityService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required],
    location: ['', Validators.required],
    organizer: ['', Validators.required],
    maxVolunteers: [10, [Validators.required, Validators.min(1)]],
    status: ['Open', Validators.required]
  });

  isEdit = false;
  activityId: string | null = null;
  isLoading = false;

  ngOnInit() {
    this.activityId = this.route.snapshot.paramMap.get('id');
    if (this.activityId) {
      this.isEdit = true;
    }
  }

  isFieldInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && (control.dirty || control.touched);
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = true;

    try {
      const data = this.form.value;
      const activityData: Activity = {
        ...data,
        date: Timestamp.fromDate(new Date(data.date))
      };

      if (this.isEdit && this.activityId) {
        await this.activityService.updateActivity(this.activityId, activityData);
      } else {
        await this.activityService.addActivity(activityData);
      }
      this.router.navigate(['/activities']);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }
}
