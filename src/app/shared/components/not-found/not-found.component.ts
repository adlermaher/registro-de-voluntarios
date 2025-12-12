import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="container">
      <h1>404</h1>
      <p>Page Not Found</p>
      <a routerLink="/dashboard" class="btn btn-primary">Go Home</a>
    </div>
  `,
    styles: [`
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80vh;
      text-align: center;
      
      h1 { font-size: 6rem; margin: 0; color: var(--primary-color); }
      p { font-size: 1.5rem; color: var(--text-muted); margin-bottom: 2rem; }
    }
  `]
})
export class NotFoundComponent { }
