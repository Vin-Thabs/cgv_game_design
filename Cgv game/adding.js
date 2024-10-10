import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);  // 0.1 is the near clipping distance
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
const textureLoader = new THREE.TextureLoader();

// Function to generate random positions on the plane
function getRandomPosition() {
    const x = (Math.random() - 0.5) * 48;  // Random X position within the plane's width (-25 to 25)
    const z = (Math.random() - 0.5) * 48;  // Random Z position within the plane's depth (-25 to 25)
    return { x, z };
}

// OrbitControls for rotating the camera
const orbit = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("red");
document.body.appendChild(renderer.domElement);

camera.position.set(0, 3, 0);  // Lower and more central position
//camera.lookAt(0, 5, -25);  // Look towards the front wall inside the dungeon
orbit.update();

// Optionally, limit the camera's panning and zooming
orbit.maxPolarAngle = Math.PI / 2;  // Prevent the camera from flipping upside down
orbit.minDistance = 5;  // Set the minimum distance (how close the camera can get)
orbit.maxDistance = 500;  // Set the maximum distance (how far the camera can move back)

// Improved lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);  // Stronger ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);  // Strong directional light
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Load MTL (Material) first
const mtlLoader1 = new MTLLoader();
mtlLoader1.load('/OBJ/Barrel.mtl', function (materials) {
    materials.preload();

    // Log the materials to ensure they are loaded correctly
    console.log('Materials loaded:', materials);

    // Once materials are loaded, load OBJ model
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('/OBJ/Barrel.obj', function (object) {
        for (let i = 0; i < 10; i++) {  // Load 10 random barrels
            const barrelClone = object.clone();  // Clone the original barrel
    
            // Get a random position
            const { x, z } = getRandomPosition();
            barrelClone.position.set(x, 0, z);  // Place the barrel randomly on the plane
            barrelClone.scale.set(0.5, 0.5, 0.5);  // Adjust the size of the barrel

            // Log to ensure materials are correctly applied to each clone
            barrelClone.traverse(function (child) {
                if (child.isMesh) {
                    console.log('Material on mesh:', child.material);
                }
            });

            scene.add(barrelClone);  // Add the barrel clone to the scene
        }
    }, 
    // On progress
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, 
    // On error
    function (error) {
        console.error('An error happened:', error);
    });
});
// Load MTL (Material) first
/*const mtlLoader2 = new MTLLoader();
mtlLoader2.load('/OBJ/Bookcase_Full.mtl', function (materials) {
    materials.preload();

    // Once materials are loaded, load OBJ model
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('/OBJ/Bookcase_Full.obj', function (object) {
        for (let i = 0; i < 10; i++) {  // Load 10 random barrels
            const bookClone = object.clone();  // Clone the original barrel
    
            // Get a random position
            const { x, z } = getRandomPosition();
            bookClone.position.set(x, 0, z);  // Place the barrel randomly on the plane
            bookClone.scale.set(1, 1, 1);  // Adjust the size of the barrel
    
            scene.add(bookClone);  // Add the barrel clone to the scene
        }
    }, 
    // On progress
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, 
    // On error
    function (error) {
        console.error('An error happened:', error);
    });
});*/

const mtlLoader3 = new MTLLoader();
mtlLoader3.load('/OBJ/BridgeSection.mtl', function (materials) {
    materials.preload();

    // Once materials are loaded, load OBJ model
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('/OBJ/BridgeSection.obj', function (object) {
            // Get a random position
            object.position.set(0, 5, 0);  // Place the barrel randomly on the plane
            object.scale.set(1, 1, 1);  // Adjust the size of the barrel
    
            scene.add(object);  // Add the barrel clone to the scene
    }, 
    // On progress
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, 
    // On error
    function (error) {
        console.error('An error happened:', error);
    });
});

const mtlLoader4 = new MTLLoader();
mtlLoader4.load('/OBJ/Doors_GothicArch.mtl', function (materials) {
    materials.preload();

    // Once materials are loaded, load OBJ model
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('/OBJ/Doors_GothicArch.obj', function (object) {
            // Get a random position
            object.position.set(-25, 0, 0);  // Place the barrel randomly on the plane
            object.scale.set(1, 1, 1);  // Adjust the size of the barrel
            object.rotation.y = Math.PI/2;
    
            scene.add(object);  // Add the barrel clone to the scene
    }, 
    // On progress
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, 
    // On error
    function (error) {
        console.error('An error happened:', error);
    });
});

// Load the door model again to add it to the left wall of the smaller room
mtlLoader4.load('/OBJ/Doors_GothicArch.mtl', function (materials) {
    materials.preload();

    // Once materials are loaded, load OBJ model
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('/OBJ/Doors_GothicArch.obj', function (object) {
        // Position the door on the left wall of the smaller room
        object.position.set(-90, 0, -15);  // Place the door on the left side of the smaller room
        object.scale.set(1, 1, 1);  // Adjust the scale as needed
        scene.add(object);  // Add the door to the scene
    }, 
    // On progress
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded (GothicArch Door)');
    }, 
    // On error
    function (error) {
        console.error('An error happened while loading the door:', error);
    });
});

// Load the door model to add it at the connection point between the final hallway and the main area
mtlLoader4.load('/OBJ/Doors_GothicArch.mtl', function (materials) {
    materials.preload();

    // Once materials are loaded, load OBJ model
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('/OBJ/Doors_GothicArch.obj', function (object) {
        // Position the door at the connection between the final hallway and the main place
        object.position.set(0, 0, -25);  // Adjust position based on your layout
        object.scale.set(1, 1, 1);  // Adjust scale if needed
        scene.add(object);  // Add the door to the scene
    }, 
    // On progress
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded (Final Door)');
    }, 
    // On error
    function (error) {
        console.error('An error happened while loading the door:', error);
    });
});

// Function to create a floor or roof with rotation on X, Y, and Z axes
function createFloorOrRoof(width, length, position, rotation = { x: -Math.PI / 2, y: 0, z: 0 }, material) {
    const planeGeometry = new THREE.PlaneGeometry(width, length);
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.position.set(...position);
    plane.rotation.x = rotation.x;
    plane.rotation.y = rotation.y;
    plane.rotation.z = rotation.z;
    scene.add(plane);
    return plane;
}

// Function to create a wall with rotation on X, Y, and Z axes
function createWall(width, height, position, rotation = { x: 0, y: 0, z: 0 }, material) {
    const wallGeometry = new THREE.PlaneGeometry(width, height);
    const wall = new THREE.Mesh(wallGeometry, material);
    wall.position.set(...position);
    wall.rotation.x = rotation.x;
    wall.rotation.y = rotation.y;
    wall.rotation.z = rotation.z;
    scene.add(wall);
    return wall;
}

// Define the material for the ground
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Temporary material, we'll apply textures later
const hallwayMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Temporary material, we'll apply textures later
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Temporary material
const Room2Floor = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Temporary material
const Room2RoofMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const Room2WallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const hallway2floormaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Material for the new hallway floor
const hallway2RoofMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Material for the new hallway roof
const hallway3FloorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Material for hallway3 floor

// Create the ground using the function
createFloorOrRoof(50, 50, [0, 0, 0], { x: -Math.PI / 2,y:0,z:0}, groundMaterial);

// Create the front wall using the function
createWall(50, 10, [0, 5, -25], { x: 0, y: 0, z: 0 }, wallMaterial);  // Width, height, position, rotation for the front wall

// Create the back wall using the function
createWall(50, 10, [0, 5, 25], { x: 0, y: Math.PI, z: 0 }, wallMaterial);  // Back wall with 180-degree rotation

// Create the left wall using the function
createWall(50, 10, [-25, 5, 0],{ x: 0, y: Math.PI/2, z: 0 }, wallMaterial);  // Left wall rotated 90 degrees inward

// Create the right wall using the function
createWall(50, 10, [25, 5, 0], { x: 0, y: -Math.PI/2, z: 0 }, wallMaterial);  // Right wall rotated 90 degrees inward

// Use the function to create the roof
createFloorOrRoof(50, 50, [0, 10, 0], { x:Math.PI / 2, y: 0, z: 0}, groundMaterial);  // Width, length, position, and rotation for the roof

// Use the function to create the hallway floor with Z rotation
createFloorOrRoof(10, 50, [-50, 0, 0], { x: -Math.PI / 2, y: 0, z: -Math.PI / 2 }, hallwayMaterial);  // Width, length, position, and rotation for the hallway floor

// Use the function to create the hallway roof with X and Z rotation
createFloorOrRoof(10, 50, [-50, 10, 0], { x: Math.PI / 2, y: 0, z: -Math.PI / 2 }, hallwayMaterial);

// Use the function to create the hallway roof with X and Z rotation
createFloorOrRoof(10, 50, [-50, 10, 0], { x: Math.PI / 2, y: 0, z: -Math.PI / 2 }, hallwayMaterial);

// Use the function to create the right wall of the hallway
createWall(50, 10, [-50, 5, 5], { x: 0, y: 0, z: 0 }, wallMaterial);  // Width, height, position, and rotation for the hallway's right wall

// Use the function to create the left wall of the hallway
createWall(50, 10, [-50, 5, -5], { x: 0, y: 0, z: 0 }, wallMaterial);  // Width, height, position, and rotation for the hallway's left wall

// Use the function to create Room 2's floor
createFloorOrRoof(30, 30, [-90, 0, 0], { x: -Math.PI / 2, y: 0, z: 0 }, Room2Floor);

// Front left wall of Room 2
createWall(10, 10, [-75, 5, -10], { x: 0, y: Math.PI / 2, z: 0 }, Room2WallMaterial);

// Front right wall of Room 2
createWall(10, 10, [-75, 5, 10], { x: 0, y: Math.PI / 2, z: 0 }, Room2WallMaterial);

// Left wall of Room 2
createWall(30, 10, [-90, 5, -15], { x: 0, y: 0, z: 0 }, Room2WallMaterial);

// Right wall of Room 2
createWall(30, 10, [-90, 5, 15], { x: 0, y: 0, z: 0 }, Room2WallMaterial);

// Back wall of Room 2
createWall(30, 10, [-105, 5, 0], { x: 0, y: -Math.PI / 2, z: 0 }, Room2WallMaterial);

// Use the function to create Room 2's roof
createFloorOrRoof(30, 30, [-90, 10, 0], { x: Math.PI / 2, y: 0, z: 0 }, Room2RoofMaterial);

// Use the function to create the new hallway floor
createFloorOrRoof(10, 70, [-90, 0, -40], { x: -Math.PI / 2, y: 0, z: 0 }, hallwayMaterial);

// Left wall of the new hallway (longer)
createWall(70, 10, [-95, 5, -40], { x: 0, y: -Math.PI / 2, z: 0 }, hallwayMaterial);

// Right wall of the new hallway (shorter)
createWall(50, 10, [-85, 5, -40], { x: 0, y: -Math.PI / 2, z: 0 }, hallwayMaterial);

// Use the function to create the new hallway roof
createFloorOrRoof(10, 70, [-90, 10, -40], { x: Math.PI / 2, y: 0, z: 0 }, hallwayMaterial);

// Use the function to create hallway3 floor
createFloorOrRoof(10, 100, [-45, 0, -70], { x: -Math.PI / 2, y: 0, z: Math.PI / 2 }, hallwayMaterial);

// Use the function to create the left wall of hallway3 (longer)
createWall(100, 10, [-45, 5, -75], { x:0,y: 0,z:0 }, hallwayMaterial);

// Use the function to create the right wall of hallway3 (shorter)
createWall(80, 10, [-45, 5, -65], { x:0,y: 0,z:0 }, hallwayMaterial);

// Use the function to create the roof for hallway3
createFloorOrRoof(10, 100, [-45, 10, -70], { x: Math.PI / 2, y: 0, z: Math.PI / 2 }, hallwayMaterial);

// Use the function to create the floor for the final hallway
createFloorOrRoof(10, 40, [0, 0, -45], { x: -Math.PI / 2, y: 0, z: 0 }, hallwayMaterial);

// Use the function to create the left wall for the final hallway
createWall(40, 10, [-5, 5, -45], { x:0,y: Math.PI / 2,z:0 }, wallMaterial);

// Use the function to create the right wall for the final hallway
createWall(50, 10, [5, 5, -45], { x:0,y: Math.PI / 2,z:0 }, wallMaterial);

// Use the function to create the roof for the final hallway
createFloorOrRoof(10, 40, [0, 10, -45], { x: Math.PI / 2, y: 0, z: 0 }, hallwayMaterial);

// Load concrete texture for the ground
const groundTexture = textureLoader.load('/images/Stylized_Feathers_002_normal.png');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(4, 4);  // Repeat the texture for better tiling

// Apply texture to named ground materials
groundMaterial.map = groundTexture;
groundMaterial.needsUpdate = true;

Room2RoofMaterial.map = groundTexture;  // Apply texture to Room 2's roof
Room2RoofMaterial.needsUpdate = true;

Room2Floor.map = groundTexture;  // Apply texture to Room 2's floor
Room2Floor.needsUpdate = true;

hallwayMaterial.map = groundTexture;  // Apply texture to the hallway floor and roof
hallwayMaterial.needsUpdate = true;

hallway2floormaterial.map = groundTexture;  // Apply texture to the new hallway floor
hallway2floormaterial.needsUpdate = true;

hallway2RoofMaterial.map = groundTexture;  // Apply texture to the new hallway roof
hallway2RoofMaterial.needsUpdate = true;

hallway3FloorMaterial.map = groundTexture;  // Apply texture to hallway3 floor
hallway3FloorMaterial.needsUpdate = true;

// Load brick texture for the walls
const wallTexture = textureLoader.load('/images/Stylized_Cliff_Rock_005_normal.png');
wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(2, 2);

// Apply texture to room2 wall materials
Room2WallMaterial.map = wallTexture;
Room2WallMaterial.needsUpdate = true;

// Apply texture to named wall materials
wallMaterial.map = wallTexture;
wallMaterial.needsUpdate = true;

// Apply texture to all room and hallway walls
hallwayMaterial.map = wallTexture;
hallwayMaterial.needsUpdate = true;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});