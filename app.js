import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

// Variables globales para la escena y objetos
let camera, scene, renderer;
let materialL, materialR;
let meshL, meshR;
const textureLoader = new THREE.TextureLoader();

// Objeto para rastrear si las imágenes están listas
const readyStatus = {
    left: false,
    right: false
};

// URLs temporales para limpieza
const tempURLs = {
    left: null,
    right: null
};

init();

function init() {
    console.log('🚀 Inicializando aplicación VR...');
    
    // 1. Configuración Básica
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Fondo negro para mejor contraste
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 0);
    
    // Agregar luz ambiental para mejor visibilidad
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Luz más intensa
    scene.add(ambientLight);
    
    // 2. Renderer con configuración optimizada para VR
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Máximo 2x para mejor calidad
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setFramebufferScaleFactor(2.0); // Mejora la resolución en VR
    
    // Añadir el canvas al DOM
    const canvas = renderer.domElement;
    canvas.id = 'vr-canvas';
    document.body.appendChild(canvas);

    // 3. Geometría de esfera invertida para panorama 360 - Mayor resolución
    const geometry = new THREE.SphereGeometry(50, 128, 64); // Más segmentos = más suave
    geometry.scale(-1, 1, 1); // Invertir para ver desde dentro

    // 4. Materiales y Meshes - Creamos materiales vacíos con mejor calidad
    materialL = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        side: THREE.FrontSide,
        toneMapped: false // Mejor brillo y contraste
    });
    meshL = new THREE.Mesh(geometry, materialL);
    meshL.layers.set(1); // Capa 1 = Ojo Izquierdo
    scene.add(meshL);

    materialR = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        side: THREE.FrontSide,
        toneMapped: false // Mejor brillo y contraste
    });
    meshR = new THREE.Mesh(geometry, materialR);
    meshR.layers.set(2); // Capa 2 = Ojo Derecho
    scene.add(meshR);

    // 5. Botón de VR
    const vrButton = VRButton.createButton(renderer);
    vrButton.style.fontFamily = 'Orbitron, sans-serif';
    document.getElementById('vr-button-container').appendChild(vrButton);

    // 6. Event Listeners de VR
    renderer.xr.addEventListener('sessionstart', onSessionStart);
    renderer.xr.addEventListener('sessionend', onSessionEnd);

    // 7. Manejador de redimensión
    window.addEventListener('resize', onWindowResize);

    // 8. Listeners para los inputs de archivo
    document.getElementById('upload-left').addEventListener('change', (event) => {
        handleFileLoad(event, 'left');
    });
    
    document.getElementById('upload-right').addEventListener('change', (event) => {
        handleFileLoad(event, 'right');
    });

    // 9. Iniciar loop de renderizado
    renderer.setAnimationLoop(render);
    
    console.log('✅ Aplicación VR inicializada correctamente');
}

/**
 * Cuando inicia la sesión VR
 */
function onSessionStart() {
    console.log('🥽 Sesión VR iniciada');
    
    // Configurar las cámaras VR para estereoscopía
    const xrCamera = renderer.xr.getCamera();
    if (xrCamera.cameras && xrCamera.cameras.length >= 2) {
        xrCamera.cameras[0].layers.set(1); // Ojo izquierdo ve capa 1
        xrCamera.cameras[1].layers.set(2); // Ojo derecho ve capa 2
    }
    
    // Ocultar el lobby completamente
    const lobby = document.getElementById('lobby');
    lobby.classList.add('hidden');
    lobby.style.display = 'none';
    
    // Activar el canvas
    const canvas = renderer.domElement;
    canvas.classList.add('vr-active');
    
    // Bloquear scroll durante VR
    document.body.style.overflow = 'hidden';
}

/**
 * Cuando termina la sesión VR
 */
function onSessionEnd() {
    console.log('👋 Sesión VR finalizada');
    
    // Mostrar el lobby
    const lobby = document.getElementById('lobby');
    lobby.classList.remove('hidden');
    lobby.style.display = 'flex';
    
    // Desactivar el canvas
    const canvas = renderer.domElement;
    canvas.classList.remove('vr-active');
    
    // Restaurar scroll
    document.body.style.overflow = 'auto';
}

/**
 * Maneja la carga de un archivo, actualiza la vista previa y la textura de Three.js
 */
function handleFileLoad(event, eye) {
    const file = event.target.files[0];
    if (!file) return;

    console.log(`📸 Cargando imagen para ojo ${eye}:`, file.name);

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        return;
    }

    // Obtener elementos del DOM
    const boxId = eye === 'left' ? 'box-left' : 'box-right';
    const box = document.getElementById(boxId);
    const previewImg = document.getElementById(eye === 'left' ? 'preview-left' : 'preview-right');
    const statusText = box.querySelector('.status-text');
    const statusIcon = box.querySelector('.status-icon');

    // Actualizar UI: estado de carga
    statusText.textContent = 'Cargando...';
    statusIcon.textContent = '⏳';

    // Limpiar URL temporal anterior si existe
    if (tempURLs[eye]) {
        URL.revokeObjectURL(tempURLs[eye]);
    }

    // Crear URL temporal para el archivo
    const imageURL = URL.createObjectURL(file);
    tempURLs[eye] = imageURL;

    // 1. Actualizar la vista previa en el lobby
    previewImg.onload = () => {
        console.log(`✅ Vista previa cargada para ojo ${eye}`);
    };
    previewImg.src = imageURL;
    
    // 2. Cargar la textura en Three.js
    const texture = textureLoader.load(
        imageURL,
        // onLoad callback - cuando la textura se carga exitosamente
        () => {
            console.log(`✅ Textura cargada exitosamente para ojo ${eye}`);
            
            // Actualizar UI: carga exitosa
            box.classList.add('loaded');
            statusText.textContent = '✓ Cargada';
            statusIcon.textContent = '✅';
            
            // Marcar como lista
            if (eye === 'left') {
                readyStatus.left = true;
            } else {
                readyStatus.right = true;
            }
            
            // Comprobar si ambas imágenes están listas
            checkReadyState();
        },
        // onProgress callback
        undefined,
        // onError callback
        (error) => {
            console.error(`❌ Error al cargar la textura para ojo ${eye}:`, error);
            statusText.textContent = '❌ Error';
            statusIcon.textContent = '⚠️';
            alert('Error al cargar la imagen. Por favor, intenta con otro archivo.');
            
            // Limpiar
            if (tempURLs[eye]) {
                URL.revokeObjectURL(tempURLs[eye]);
                tempURLs[eye] = null;
            }
        }
    );
    
    // Configuración de la textura para máxima calidad
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter; // Mejor filtrado
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Máxima anisotropía
    texture.generateMipmaps = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    // 3. Asignar la textura al material correspondiente
    if (eye === 'left') {
        // Limpiar textura anterior si existe
        if (materialL.map) {
            materialL.map.dispose();
        }
        materialL.map = texture;
        materialL.color.setHex(0xffffff); // Asegurar color blanco para no atenuar
        materialL.needsUpdate = true;
    } else {
        // Limpiar textura anterior si existe
        if (materialR.map) {
            materialR.map.dispose();
        }
        materialR.map = texture;
        materialR.color.setHex(0xffffff); // Asegurar color blanco para no atenuar
        materialR.needsUpdate = true;
    }
}

/**
 * Comprueba si ambas imágenes se han cargado y muestra el botón de VR
 */
function checkReadyState() {
    const vrContainer = document.getElementById('vr-button-container');
    
    if (readyStatus.left && readyStatus.right) {
        console.log('✅ Ambas imágenes cargadas - Mostrando botón VR');
        vrContainer.style.display = 'block';
        
        // Pequeño retraso para la animación
        setTimeout(() => {
            vrContainer.style.opacity = '1';
        }, 50);
    } else {
        vrContainer.style.display = 'none';
        vrContainer.style.opacity = '0';
    }
}

/**
 * Maneja el redimensionamiento de la ventana
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Loop de renderizado principal
 */
function render() {
    renderer.render(scene, camera);
}

/**
 * Limpieza al cerrar
 */
window.addEventListener('beforeunload', () => {
    // Limpiar URLs temporales
    if (tempURLs.left) URL.revokeObjectURL(tempURLs.left);
    if (tempURLs.right) URL.revokeObjectURL(tempURLs.right);
    
    // Limpiar texturas
    if (materialL.map) materialL.map.dispose();
    if (materialR.map) materialR.map.dispose();
    
    // Limpiar geometría
    if (meshL) meshL.geometry.dispose();
    if (meshR) meshR.geometry.dispose();
    
    console.log('🧹 Recursos limpiados');
});