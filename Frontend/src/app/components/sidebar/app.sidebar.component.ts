import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router } from '@angular/router'; // Router importado correctamente
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
    styleUrls: ['./app.sidebar.component.scss'],
    standalone: true,
    imports: [
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        RouterModule,
        CommonModule
    ],
})
export class AppSidebarComponent {
    @ViewChild('sidenav') sidenav!: MatSidenav;
    isSidebarOpen = false;

    // Inyección de Router en el constructor
    constructor(private router: Router) {}

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout() {
        // Limpia el localStorage
        localStorage.clear();

        // Redirige al componente de login
        this.router.navigate(['/login']);
    }
}
