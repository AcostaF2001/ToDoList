import { Component } from '@angular/core';
import { AppSidebarComponent } from '../sidebar/app.sidebar.component';
import { AppContentComponent } from '../content/content.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-layout',
  templateUrl: './app.layout.component.html',
  styleUrls: ['./app.layout.component.scss'],
  imports: [AppSidebarComponent, AppContentComponent,RouterOutlet,MatIcon,CommonModule,MatToolbar,MatMenuModule],
})
export class AppLayoutComponent {
  sidebarVisible = true;
  profilePicture = 'assets/default-profile.png';

  /**
   * Inicializa la componente y actualiza la imagen de perfil
   * con la información almacenada en el localStorage.
   * Si no hay información, se muestra la imagen predeterminada.
   * */
  ngOnInit() {
    // Obtener la información del usuario desde el localStorage
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        // Parsear el JSON y extraer la imagen de perfil
        const user = JSON.parse(userData);
        if (user.profileImage) {
          this.profilePicture = user.profileImage; // Actualizar la foto de perfil si existe
        }
      } catch (error) {
        console.error('Error al parsear los datos del usuario:', error);
      }
    }
  }

  /**
   * Alterna el estado de visibilidad del sidebar
   */
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  /**
   * Abre un diálogo para subir una nueva foto de perfil
   */
  changeProfilePicture() {
    console.log('Cambiar foto de perfil');
    // Aquí puedes abrir un diálogo para subir una nueva foto
  }

  /**
   * Abre la página de ajustes de perfil del usuario.
   * Todavía no está implementado, pero puedes redirigir a la página
   * correspondiente desde aquí.
   */
  profileSettings() {
    console.log('Ajuste de perfil');
    // Aquí puedes redirigir a la página de ajustes de perfil
  }
  
}
