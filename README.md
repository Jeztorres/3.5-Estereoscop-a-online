# 🥽 Visor VR Estereoscópico 360°

Una aplicación web interactiva para visualizar imágenes panorámicas estereoscópicas en realidad virtual usando Three.js y WebXR.

## ✨ Características

- 🎮 **Visualización VR Estereoscópica**: Soporte completo para visualización de imágenes separadas para cada ojo
- 🌐 **Panoramas 360°**: Experiencia inmersiva de 360 grados
- 📱 **Compatible con WebXR**: Funciona con visores VR compatibles (Meta Quest, Oculus, etc.)
- 🎨 **Interfaz Moderna**: Diseño futurista con efectos neón y animaciones
- 📸 **Carga Fácil**: Sube tus propias imágenes panorámicas
- ⚡ **Alta Calidad**: Renderizado optimizado con texturas de alta resolución

## 🚀 Demo en Vivo

Prueba la aplicación aquí: [https://jeztorres.github.io/3.5-Estereoscop-a-online/](https://jeztorres.github.io/3.5-Estereoscop-a-online/)

## 🛠️ Tecnologías

- **Three.js** - Motor de renderizado 3D
- **WebXR** - API de realidad virtual
- **HTML5/CSS3** - Interfaz moderna y responsive
- **JavaScript ES6+** - Lógica de la aplicación

## 📋 Requisitos

- Navegador moderno con soporte para WebXR (Chrome, Edge, Firefox)
- Dispositivo VR compatible (Meta Quest, Oculus Rift, etc.) o emulador WebXR
- Imágenes panorámicas 360° (una para cada ojo)

## 🎯 Cómo Usar

1. **Carga las Imágenes**
   - Haz clic en "Seleccionar Imagen" para el ojo izquierdo
   - Haz clic en "Seleccionar Imagen" para el ojo derecho
   - Las vistas previas aparecerán automáticamente

2. **Entra en VR**
   - Una vez cargadas ambas imágenes, aparecerá el botón "ENTER VR"
   - Haz clic en el botón o usa tu dispositivo VR
   - ¡Disfruta de la experiencia inmersiva!

3. **Salir de VR**
   - Usa el botón de salida de tu dispositivo VR
   - O presiona ESC en tu navegador

## 💻 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/Jeztorres/3.5-Estereoscop-a-online.git

# Navegar al directorio
cd 3.5-Estereoscop-a-online

# Abrir con un servidor local (ejemplo con Python)
python -m http.server 8000

# O con Node.js
npx http-server
```

Luego abre `http://localhost:8000` en tu navegador.

## 📁 Estructura del Proyecto

```
app-sidebyside/
├── index.html          # Página principal
├── styles.css          # Estilos y animaciones
├── app.js             # Lógica de la aplicación VR
└── README.md          # Este archivo
```

## 🎨 Características Técnicas

- **Resolución Mejorada**: Framebuffer escalado 2x para mayor claridad
- **Anisotropía Máxima**: Texturas más nítidas en ángulos oblicuos
- **Filtrado Avanzado**: Mipmapping y filtrado lineal
- **Iluminación Optimizada**: Luz ambiental para mejor visibilidad
- **Geometría de Alta Resolución**: 128x64 segmentos para suavidad

## 🤝 Contribuir

Las contribuciones son bienvenidas! Si tienes ideas para mejorar el proyecto:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 👤 Autor

**Jez Torres**
- GitHub: [@Jeztorres](https://github.com/Jeztorres)

## 🙏 Agradecimientos

- Three.js por el excelente motor 3D
- WebXR por hacer la VR accesible en la web
- La comunidad de desarrolladores VR

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
