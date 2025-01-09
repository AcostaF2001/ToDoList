import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  standalone: true, // Indica que este componente es standalone
  imports: [CommonModule, MatButtonModule,MatDialogModule,MatDatepickerModule,MatNativeDateModule,MatIcon],
  providers: [  
    MatDatepickerModule,
    MatNativeDateModule  
  ],
  styleUrls: ['./to-do.component.scss'],
})
export class ToDoComponent implements OnInit {
  todos: any[] = []; // Lista de tareas
  title: string = ''; // Título dinámico
  showTitle: boolean = true; // Controla si se muestra el título o no

  constructor(private todoService: TodoService,private dialog: MatDialog) { }

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
