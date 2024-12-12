const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const router = express.Router();
require('dotenv').config();
const authenticateToken = require('../middlewares/auth');

// Configuración de multer para manejar archivos subidos
const upload = multer({ storage: multer.memoryStorage() });

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Endpoint para subir una imagen a Cloudinary
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const image = req.file; // La imagen subida
    if (!image) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    // Subir la imagen a Cloudinary usando un stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'uploads' }, // Opcional: especifica la carpeta donde almacenar las imágenes
      (error, result) => {
        if (error) {
          console.error('Error al subir la imagen a Cloudinary:', error);
          return res.status(500).json({ message: 'Error al subir la imagen', error });
        }
        // Responder con la URL de la imagen subida
        res.status(200).json({ imageUrl: result.secure_url });
      }
    );

    // Convierte el buffer de la imagen en un stream y pásalo a Cloudinary
    const bufferStream = new Readable();
    bufferStream.push(image.buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  } catch (error) {
    console.error('Error al procesar la imagen:', error.message);
    res.status(500).json({ message: 'Error al procesar la imagen', error });
  }
});

module.exports = router;
