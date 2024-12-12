import { Injectable } from '@angular/core';
import axiosInstance from './axios.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  // Método para iniciar sesión
  async login(username: string, password: string): Promise<any> {
    try {
      // Llamar al endpoint de login
      const response = await axiosInstance.post('/auth/login', { username, password });

      // Extraer el token y los datos del usuario
      const { token, user, role } = response.data;

      // Guardar el token y la información del usuario en el localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth,
          profileImage: user.profileImage,
          gender: user.gender
        })
      );

      // Guardar el rol (puede ser null)
      localStorage.setItem('role', JSON.stringify(role));

      return response.data; // Retornar los datos de la respuesta
    } catch (error: any) {
      console.error('Error en la solicitud de login:', error);

      // Si es un error de Axios
      if (error.response) {
        throw error.response.data; // Retornar los datos del error del servidor
      }

      // Si no es un error de Axios
      throw { message: 'Error inesperado en la solicitud' };
    }
  }

  async register(userData: any): Promise<any> {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('Error during registration:', error);
      throw error.response?.data || { message: 'Unknown error occurred' };
    }
  }
  
}
