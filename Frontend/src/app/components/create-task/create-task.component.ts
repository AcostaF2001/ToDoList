import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CommonModule } from '@angular/common';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule
  ],
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' }, // Configura el idioma a Español
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    MatDatepickerModule,
    MatNativeDateModule  // Opcional: Configura el formato de las fechas
  ],
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent {
  taskForm: FormGroup; // Formulario reactivo
  useDateRange: boolean = false; // Controla si el usuario elige un rango de fechas
  addObjectives: boolean = false; // Controla si el usuario añade objetivos

/**
 * Constructor de la clase CreateTaskComponent.
 *
 * @param fb Form builder
 * @param todoService Servicio de tareas
 * @param dialogRef Referencia al diálogo
 * @param data Datos opcionales pasados al modal
 */
  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    public dialogRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Datos opcionales pasados al modal
  ) {
    this.taskForm = this.fb.group({
      idUsuario: [this.getUserId(), Validators.required], // Obtén el ID del usuario
      name: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaRealizacion: [null],
      lapsoDeTiempo: this.fb.group({
        inicio: [null],
        fin: [null],
      }),
      objetivos: this.fb.array([]),
    });
  }

  // Obtener el ID del usuario desde localStorage
  private getUserId(): string | null {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user?.id || null;
      } catch (error) {
        console.error('Error al parsear los datos del usuario:', error);
      }
    }
    return null;
  }

  // Obtener el FormArray de objetivos
  get objetivos(): FormArray {
    return this.taskForm.get('objetivos') as FormArray;
  }

  // Añadir un nuevo objetivo
  addObjective(): void {
    const objectiveGroup = this.fb.group({
      descripcion: ['', Validators.required], // Validación requerida
    });
    this.objetivos.push(objectiveGroup); // Añadir el grupo al FormArray
    // console.log('Objetivos actuales:', this.objetivos.value);
  }

  // Eliminar un objetivo por índice
  removeObjective(index: number): void {
    this.objetivos.removeAt(index);
  }

  // Alternar entre día específico y rango de fechas
  toggleDateRange(): void {
    this.useDateRange = !this.useDateRange;
    if (this.useDateRange) {
      this.taskForm.get('fechaRealizacion')?.reset(); // Limpiar fecha específica
    } else {
      this.taskForm.get('lapsoDeTiempo.inicio')?.reset();
      this.taskForm.get('lapsoDeTiempo.fin')?.reset();
    }
  }


  // Alternar si el usuario quiere añadir objetivos
  toggleObjectives(): void {
    this.addObjectives = !this.addObjectives;
    if (!this.addObjectives) {
      this.objetivos.clear();
    }
  }


  // Enviar el formulario
  async submitTask(): Promise<void> {
    // console.log('Formulario antes de enviar:', this.taskForm.value);

    if (this.taskForm.invalid) {
      console.error('Formulario inválido');
      return;
    }

    // Crear una copia de los datos
    const taskData = { ...this.taskForm.value };

    // Eliminar campos no utilizados
    if (!this.useDateRange) {
      delete taskData.lapsoDeTiempo;
    } else {
      delete taskData.fechaRealizacion;
    }

    // Validar y filtrar objetivos
    taskData.objetivos = this.objetivos.controls
      .map((control) => control.value)
      .filter((objective: any) => objective.descripcion?.trim() !== '');

    // console.log('Datos enviados:', taskData);

    try {
      const response = await this.todoService.createTodo(taskData);
      console.log('Tarea creada exitosamente:', response);
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  }
  // Cerrar el modal
  close(): void {
    this.dialogRef.close(false);
  }
}
