import { Injectable } from '@angular/core';
import axiosInstance from './axios.config';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor() {}

  /**
   * Sube una imagen al backend
   * @param file El archivo de imagen seleccionado
   * @returns Promesa con la respuesta del servidor que incluye la URL de la imagen
   */
  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file); // 'image' debe coincidir con el nombre del campo en el backend

      console.log('FormData antes de enviar:', formData.get('image'));

      const response = await axiosInstance.post('/upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Asegúrate de incluir este encabezado
        },
      });

      return response.data; // Devuelve la respuesta del backend
    } catch (error: any) {
      console.error('Error al subir la imagen:', error.response?.data || error.message);
      throw new Error('Error al subir la imagen');
    }
  }
}
