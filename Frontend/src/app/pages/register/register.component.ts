import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIcon,
    MatCardModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  profileImageUrl: string | null = null; // Para almacenar la URL de la imagen subida
  selectedImage: File | null = null; // Para almacenar el archivo seleccionado

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,private uploadService: UploadService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      profileImage: ['', Validators.required], // Campo para la URL de la imagen
    });
  }

  onProfileImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      console.log('Archivo seleccionado:', file); 
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result as string; // Mostrar vista previa
  
        // Marca el campo como válido temporalmente
        this.registerForm.patchValue({ profileImage: 'placeholder-url' }); // Provisional hasta que se suba la imagen
        this.registerForm.get('profileImage')?.updateValueAndValidity(); // Actualiza los validadores
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.registerForm.valid && this.selectedImage) {
      try {
        // Subir la imagen primero
        console.log('Imagen seleccionada para subir:', this.selectedImage);
        const uploadResponse = await this.uploadService.uploadImage(this.selectedImage);
        if (uploadResponse && uploadResponse.imageUrl) {
          this.registerForm.patchValue({ profileImage: uploadResponse.imageUrl });
  
          // Enviar los datos del formulario
          const response = await this.authService.register(this.registerForm.value);
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          throw new Error('No se pudo obtener la URL de la imagen');
        }
      } catch (error: any) {
        this.errorMessage = error.message || 'Registration failed. Please try again.';
      }
    } else {
      this.errorMessage = 'Formulario inválido. Asegúrate de que todos los campos estén completos.';
    }
  }
}
