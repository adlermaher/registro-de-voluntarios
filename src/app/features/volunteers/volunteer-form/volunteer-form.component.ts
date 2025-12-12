import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VolunteerService } from '../services/volunteer.service';
import { Volunteer } from '../../../core/models/volunteer.model';

@Component({
  selector: 'app-volunteer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container fade-in">
      <div class="card form-card">
        <div class="header">
          <h1>{{ isEdit ? 'Editar' : 'Nuevo' }} Voluntario</h1>
          <p>Completa la información requerida</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          
          <div class="grid-2">
            <div class="form-group">
              <label for="fullName">Nombre Completo</label>
              <input type="text" id="fullName" formControlName="fullName" [class.error]="isFieldInvalid('fullName')">
              @if (isFieldInvalid('fullName')) { <small class="error-text">Requerido</small> }
            </div>

            <div class="form-group">
              <label for="email">Correo Electrónico</label>
              <input type="email" id="email" formControlName="email" [class.error]="isFieldInvalid('email')">
              @if (isFieldInvalid('email')) { <small class="error-text">Correo válido requerido</small> }
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input type="tel" id="phone" formControlName="phone" [class.error]="isFieldInvalid('phone')">
              @if (isFieldInvalid('phone')) { <small class="error-text">Requerido</small> }
            </div>

            <div class="form-group">
              <label for="status">Estado</label>
              <select id="status" formControlName="status">
                <option value="Active">Activo</option>
                <option value="Pending">Pendiente</option>
                <option value="Inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="availability">Disponibilidad</label>
            <select id="availability" formControlName="availability">
              <option value="Flexible">Flexible</option>
              <option value="Weekdays">Entre Semana</option>
              <option value="Weekends">Fines de Semana</option>
            </select>
          </div>
          
          <div class="form-actions">
            <a routerLink="/volunteers" class="btn btn-outline">Cancelar</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || isLoading">
              {{ isLoading ? 'Guardando...' : 'Guardar Voluntario' }}
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
  `]
})
export class VolunteerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private volunteerService = inject(VolunteerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    status: ['Active', Validators.required],
    availability: ['Flexible', Validators.required]
  });

  isEdit = false;
  volunteerId: string | null = null;
  isLoading = false;

  async ngOnInit() {
    this.volunteerId = this.route.snapshot.paramMap.get('id');
    if (this.volunteerId) {
      this.isEdit = true;
      // Fetch logic simulated, in real app better getById
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
      const volunteerData: Volunteer = {
        ...this.form.value,
        skills: [],
        startDate: new Date()
      };

      if (this.isEdit && this.volunteerId) {
        await this.volunteerService.updateVolunteer(this.volunteerId, volunteerData);
      } else {
        await this.volunteerService.addVolunteer(volunteerData);
      }
      this.router.navigate(['/volunteers']);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }
}
