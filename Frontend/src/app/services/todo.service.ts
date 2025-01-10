import { Injectable } from '@angular/core';
import axiosInstance from './axios.config';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly baseUrl = '/todo'; // Base URL para los endpoints de tareas

  constructor() { }

  /**
   * Obtiene todas las tareas con filtros opcionales por nombre y estado.
   * @param idUsuario ID del usuario (obligatorio).
   * @param filters Filtros opcionales (name y estado).
   * @returns Promesa con la lista de tareas.
   */
  async getTodos(
    idUsuario: string,
    filters?: { name?: string; estado?: string }
  ): Promise<any[]> {
    if (!idUsuario) {
      throw new Error('El ID del usuario (idUsuario) es obligatorio.');
    }

    try {
      const params = new URLSearchParams({ idUsuario, ...filters } as any).toString();
      const response = await axiosInstance.get(`${this.baseUrl}?${params}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener las tareas:', error.response?.data || error.message);
      throw new Error('Error al obtener las tareas');
    }
  }

  /**
   * Crea una nueva tarea.
   * @param todoData Datos de la tarea.
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
      const response = await axiosInstance.post(this.baseUrl, todoData);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear la tarea:', error.response?.data || error.message);
      throw new Error('Error al crear la tarea');
    }
  }

  /**
   * Actualiza una tarea existente.
   * @param id ID de la tarea a actualizar.
   * @param todoData Datos actualizados de la tarea.
   * @returns Promesa con la tarea actualizada.
   */
  async updateTodo(id: string, todoData: Partial<{
    name: string;
    descripcion: string;
    estado: string;
    fechaRealizacion?: Date;
    lapsoDeTiempo?: { inicio?: Date; fin?: Date };
    objetivos?: { descripcion: string; completado?: boolean }[];
  }>): Promise<any> {
    try {
      const response = await axiosInstance.put(`${this.baseUrl}/${id}`, todoData);
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar la tarea:', error.response?.data || error.message);
      throw new Error('Error al actualizar la tarea');
    }
  }

  /**
   * Elimina una tarea por ID.
   * @param id ID de la tarea.
   * @returns Promesa con la respuesta del servidor.
   */
  async deleteTodo(id: string): Promise<any> {
    try {
      const response = await axiosInstance.delete(`${this.baseUrl}/${id}`);
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
      const response = await axiosInstance.patch(`${this.baseUrl}/${id}/estado`, { estado });
      return response.data;
    } catch (error: any) {
      console.error('Error al cambiar el estado de la tarea:', error.response?.data || error.message);
      throw new Error('Error al cambiar el estado de la tarea');
    }
  }

  /**
   * Actualiza los objetivos de una tarea.
   * @param id ID de la tarea.
   * @param objetivos Objetivos actualizados.
   * @returns Promesa con la tarea actualizada.
   */
  async updateTodoObjectives(
    id: string,
    objetivos: { descripcion: string; completado?: boolean }[]
  ): Promise<any> {
    try {
      const response = await axiosInstance.patch(`${this.baseUrl}/${id}/objetivos`, { objetivos });
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar los objetivos:', error.response?.data || error.message);
      throw new Error('Error al actualizar los objetivos');
    }
  }

  /**
   * Actualiza las posiciones de las tareas de un usuario.
   * @param idUsuario ID del usuario.
   * @param tasks Lista de tareas con sus nuevas posiciones.
   * @returns Promesa con la respuesta del servidor.
   */
  async updateTaskPositions(
    idUsuario: string,
    tasks: { id: string; positionx: number; positiony: number }[] // Unificar propiedades con mayúsculas
  ): Promise<any> {
    if (!idUsuario || !tasks || tasks.length === 0) {
      throw new Error('El ID del usuario y las tareas son obligatorios.');
    }

    try {
      const response = await axiosInstance.put(`${this.baseUrl}/order`, {
        idUsuario,
        tasks, // No necesitas mapear las propiedades porque ya están en el formato correcto
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar las posiciones de las tareas:', error.response?.data || error.message);
      throw new Error('Error al actualizar las posiciones de las tareas');
    }
  }
}
