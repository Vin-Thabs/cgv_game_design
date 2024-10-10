import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const pointerLockControls = new PointerLockControls(camera, document.body);
scene.add(pointerLockControls.getObject());
pointerLockControls.getObject().position.set(0, 2, 5); 

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(15, 50);
scene.add(gridHelper);

const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

// Load MTL and OBJ
mtlLoader.load('/OBJ/Tree_1.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('/OBJ/Tree_1.obj', (root) => {
        root.castShadow = true; 
        scene.add(root);
    }, undefined, (error) => {
        console.error('Error loading OBJ:', error);
    });
}, undefined, (error) => {
    console.error('Error loading MTL:', error);
});

// Add a smooth PointLight
const pointLight = new THREE.PointLight(0xffffff, 5, 100);
pointLight.castShadow = true; 
pointLight.shadow.mapSize.width = 1024; 
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 40;
pointLight.shadow.camera.far = 100;
scene.add(pointLight);

// Create an ambient light for soft global illumination
const ambientLight = new THREE.AmbientLight(0x404040); 
scene.add(ambientLight);

// Key event listeners for movement
const keys = {};
const speed = 0.1;

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

document.addEventListener('click', () => {
    pointerLockControls.lock();
});

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    // Update light position to follow the camera
    pointLight.position.copy(pointerLockControls.getObject().position);

    if (pointerLockControls.isLocked) {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(direction, new THREE.Vector3(0, 1, 0));

        if (keys['w']) {
            pointerLockControls.getObject().position.add(direction.multiplyScalar(speed));
        }
        if (keys['s']) {
            pointerLockControls.getObject().position.add(direction.multiplyScalar(-speed));
        }
        if (keys['a']) {
            pointerLockControls.getObject().position.add(right.multiplyScalar(-speed));
        }
        if (keys['d']) {
            pointerLockControls.getObject().position.add(right.multiplyScalar(speed));
        }
    }

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);