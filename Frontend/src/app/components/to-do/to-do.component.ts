import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { TaskCardComponent } from '../task-card/task-card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  standalone: true, // Indica que este componente es standalone
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatIcon, TaskCardComponent, DragDropModule],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ],
  styleUrls: ['./to-do.component.scss'],
})
export class ToDoComponent implements OnInit {
  todos: any[] = []; // Lista de tareas
  title: string = 'Your To-Do List'; // Título dinámico
  showTitle: boolean = true; // Controla si se muestra el título o no

  constructor(private todoService: TodoService, private dialog: MatDialog) { }

  // Método para obtener el ID del usuario
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

  /**
   * Inicializa el componente cargando las tareas del usuario actual desde el servicio de tareas.
   * Si no se encuentra el ID del usuario en el localStorage, se muestra un mensaje de error.
   * Si la lista de tareas está vacía, se muestra el título con un mensaje personalizado.
   * Si se encuentran tareas, se oculta el título.
   * @returns {Promise<void>} Promesa que se resuelve cuando se carga la lista de tareas.
   */
  async ngOnInit(): Promise<void> {
    try {
      // Obtener el idUsuario desde el localStorage
      const userData = localStorage.getItem('user');
      let id: string | null = null;

      if (userData) {
        try {
          const user = JSON.parse(userData); // Parsear el JSON
          id = user?.id; // Extraer el idUsuario
        } catch (error) {
          console.error('Error al parsear los datos del usuario:', error);
        }
      }

      if (!id) {
        console.error('No se encontró el ID del usuario en el localStorage.');
        return;
      }

      // Obtener las tareas del usuario
      this.todos = await this.todoService.getTodos(id);

      // Mostrar título si la lista de tareas está vacía
      if (this.todos.length === 0) {
        // console.log('No hay tareas.');
        this.title = 'Empieza a Organizar tu día a día';
        this.showTitle = true;
      } else {
        console.log('Tareas encontradas:', this.todos);
        this.showTitle = false;
      }
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  }

/**
 * Maneja el fin del drag de una tarea y actualiza la posición
 * en el backend.
 * @param event Evento de drag-and-drop.
 * @param task Tarea que se está moviendo.
 */
  onDragEnd(event: any, task: any): void {
    const { x, y } = event.source.getFreeDragPosition();
    task.positionx = x;
    task.positiony = y;

    // Guardar los cambios en el backend
    const userId = this.getUserId();
    if (!userId) {
      console.error('El ID del usuario no está disponible.');
      return;
    }

    this.todoService
      .updateTaskPositions(userId, this.todos.map(t => ({ id: t._id, positionx: t.positionx, positiony: t.positiony })))
      .then(() => {
        console.log('Posiciones actualizadas correctamente.');
      })
      .catch(error => {
        console.error('Error al actualizar posiciones:', error);
      });
  }

/**
 * Opens a dialog for creating a new task. Once the dialog is closed,
 * it checks whether the task creation was successful. If successful,
 * it logs a success message and reloads the tasks by invoking `ngOnInit`.
 * If the task creation is canceled, it logs a cancellation message.
 */

  createNewTask(): void {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Tarea creada exitosamente');
        // Aquí puedes actualizar la lista de tareas si es necesario
        this.ngOnInit(); // Recargar las tareas
      } else {
        console.log('Creación de tarea cancelada');
      }
    });
  }
}
