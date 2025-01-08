import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [MatIcon, NgIf, CommonModule],
  animations: [
    // Animación para el título
    trigger('fadeInTitle', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('2s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('1s ease-in-out', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
    // Animación para el nombre de usuario
    trigger('fadeInUsername', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('2s 2s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('1s ease-in-out', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
    // Animación para el botón
    trigger('fadeInButton', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('2s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('1s ease-in-out', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ]),
    // Animación para desaparecer el contenedor
    trigger('fadeOutContainer', [
      transition(':leave', [
        animate('1s ease-in-out', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  username: string = 'Guest'; // Valor predeterminado
  showContent = true;
  showButton = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.username = user.firstName + ' ' + user.lastName || 'Guest'; // Obtén el nombre de usuario o usa "Guest"
      } catch (error) {
        console.error('Error al leer el usuario desde localStorage:', error);
      }
    }

    // Mostrar el botón después de 4 segundos (tiempo de animación del nombre + retraso)
    setTimeout(() => {
      this.showButton = true;
    }, 4000);
  }

  navigateToToDo() {
    this.showContent = false; // Desaparece el contenedor
    setTimeout(() => {
      this.router.navigate(['/to-do']); // Navega al componente To-Do después de la animación
    }, 1000);
  }
}
