import { Injectable } from '@angular/core';
import axiosInstance from './axios.config';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor() {}

  /**
   * Obtiene todas las tareas con filtros opcionales por nombre y estado.
   * @param filters Objeto con los filtros opcionales (name y estado).
   * @returns Promesa con la lista de tareas.
   */
  async getTodos(filters?: { name?: string; estado?: string }): Promise<any[]> {
    try {
      const params = new URLSearchParams(filters as any).toString();
      const response = await axiosInstance.get(`/todo?${params}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener las tareas:', error.response?.data || error.message);
      throw new Error('Error al obtener las tareas');
    }
  }

  /**
   * Crea una nueva tarea.
   * @param todoData Objeto con los datos de la tarea (idUsuario, name, descripcion, etc.).
   * @returns Promesa con la tarea creada.
   */
  async createTodo(todoData: {
    idUsuario: string;
    name: string;
    descripcion: string;
    fechaRealizacion?: Date;
    lapsoDeTiempo?: { inicio?: Date; fin?: Date };
    objetivos?: { descripcion: string; completado?: boolean }[];
  }): Promise<any> {
    try {
      const response = await axiosInstance.post('/todo', todoData);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear la tarea:', error.response?.data || error.message);
      throw new Error('Error al crear la tarea');
    }
  }

  /**
   * Actualiza una tarea existente.
   * @param id ID de la tarea a actualizar.
   * @param todoData Objeto con los datos actualizados de la tarea.
   * @returns Promesa con la tarea actualizada.
   */
  async updateTodo(id: string, todoData: any): Promise<any> {
    try {
      const response = await axiosInstance.put(`/todo/${id}`, todoData);
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar la tarea:', error.response?.data || error.message);
      throw new Error('Error al actualizar la tarea');
    }
  }

  /**
   * Elimina una tarea por su ID.
   * @param id ID de la tarea a eliminar.
   * @returns Promesa con la respuesta del servidor.
   */
  async deleteTodo(id: string): Promise<any> {
    try {
      const response = await axiosInstance.delete(`/todo/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al eliminar la tarea:', error.response?.data || error.message);
      throw new Error('Error al eliminar la tarea');
    }
  }

  /**
   * Cambia el estado de una tarea.
   * @param id ID de la tarea.
   * @param estado Nuevo estado de la tarea.
   * @returns Promesa con la tarea actualizada.
   */
  async changeTodoState(id: string, estado: string): Promise<any> {
    try {
      const response = await axiosInstance.patch(`/todo/${id}/estado`, { estado });
      return response.data;
    } catch (error: any) {
      console.error('Error al cambiar el estado de la tarea:', error.response?.data || error.message);
      throw new Error('Error al cambiar el estado de la tarea');
    }
  }

  /**
   * Actualiza los objetivos de una tarea.
   * @param id ID de la tarea.
   * @param objetivos Lista de objetivos a actualizar.
   * @returns Promesa con la tarea actualizada.
   */
  async updateTodoObjectives(
    id: string,
    objetivos: { descripcion: string; completado?: boolean }[]
  ): Promise<any> {
    try {
      const response = await axiosInstance.patch(`/todo/${id}/objetivos`, { objetivos });
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar los objetivos de la tarea:', error.response?.data || error.message);
      throw new Error('Error al actualizar los objetivos de la tarea');
    }
  }
}
