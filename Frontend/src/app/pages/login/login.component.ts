import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, CommonModule, MatFormFieldModule,
        MatInputModule,
        MatButtonModule,MatIconModule,MatError], // IMPORTAR ReactiveFormsModule AQUÍ
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string | null = null;
    hidePassword: boolean = true;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword; // Alternar entre true y false
      }

    async onSubmit() {
        if (this.loginForm.valid) {
            const { username, password } = this.loginForm.value;

            try {
                const response = await this.authService.login(username, password);
                console.log("Inicio de sesion existoso",response)

                // Redirigir al usuario a la página principal o dashboard
                this.router.navigate(['/dashboard']);
            } catch (error: any) {
                // Manejar el error basado en el código de estado
                if (error.status === 401) {
                    this.errorMessage = 'Contraseña incorrecta. Por favor, verifica tus credenciales.';
                } else if (error.status === 404) {
                    this.errorMessage = 'Usuario no encontrado. Verifica tu nombre de usuario.';
                } else {
                    this.errorMessage = error.message || 'Error inesperado al iniciar sesión.';
                }
            }
        }
    }
}
