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

// Create the ground
const groundGeometry = new THREE.PlaneGeometry(50, 50);  // Size of the ground
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Temporary material, we'll apply textures later
const ground = new THREE.Mesh(groundGeometry, groundMaterial);

// Rotate the ground to be flat (default is vertical)
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Create a wall
const wallGeometry = new THREE.PlaneGeometry(50, 10);  // Wall dimensions (width, height)
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Temporary material

// Front wall
const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(0, 5, -25);  // Positioning the wall
scene.add(wall1);

// Back wall
const wall2 = wall1.clone();
wall2.position.set(0, 5, 25);
wall2.rotation.y = Math.PI;  // Rotate 180 degrees to face opposite direction
scene.add(wall2);

// Left wall
const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
wall3.position.set(-25, 5, 0);
wall3.rotation.y = Math.PI / 2;  // Rotate to face inward
scene.add(wall3);

// Right wall
const wall4 = wall3.clone();
wall4.position.set(25, 5, 0);
scene.add(wall4);

// Create the roof
const roof = new THREE.Mesh(groundGeometry, groundMaterial);
roof.position.set(0, 10, 0);  // Move roof to the top
roof.rotation.x = -Math.PI / 2;
scene.add(roof);

// Create the hallway floor
const hallwayFloorGeometry = new THREE.PlaneGeometry(10, 50);  // Hallway dimensions
const hallwayFloorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Material for the hallway
const hallwayFloor = new THREE.Mesh(hallwayFloorGeometry, hallwayFloorMaterial);
hallwayFloor.rotation.x = -Math.PI / 2;  // Flat on the ground
hallwayFloor.rotation.z = -Math.PI / 2;
hallwayFloor.position.set(-50, 0, 0);  // Extend from the door to the next room
scene.add(hallwayFloor);

// Create the hallway roof
const hallwayRoofGeometry = new THREE.PlaneGeometry(10, 50);  // Same dimensions as the hallway floor
const hallwayRoofMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Same material as the floor
const hallwayRoof = new THREE.Mesh(hallwayRoofGeometry, hallwayRoofMaterial);
hallwayRoof.rotation.z = -Math.PI / 2;
hallwayRoof.rotation.x = Math.PI / 2;  // Flat, facing downward (opposite of the floor)
hallwayRoof.position.set(-50, 10, 0);  // Positioned above the hallway walls
scene.add(hallwayRoof);

// Create hallway walls
const hallwayWallGeometry = new THREE.PlaneGeometry(50, 10);  // Length of the hallway walls, height of 10

// Left wall of the hallway
const hallwayWallLeft = new THREE.Mesh(hallwayWallGeometry, wallMaterial);
hallwayWallLeft.position.set(-50, 5, -5);  // Align the left wall with the hallway floor
hallwayWallLeft.rotation.y = Math.PI;  // Rotate 180 degrees to face inward
scene.add(hallwayWallLeft);

// Right wall of the hallway
const hallwayWallRight = new THREE.Mesh(hallwayWallGeometry, wallMaterial);
hallwayWallRight.position.set(-50, 5, 5);  // Align the right wall with the hallway floor
hallwayWallRight.rotation.y = 0;  // No need to rotate, faces outward by default
scene.add(hallwayWallRight);

// Create the smaller room's floor
const smallerRoomFloorGeometry = new THREE.PlaneGeometry(30, 30);  // Smaller room dimensions
const smallerRoomFloorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Material for the smaller room
const smallerRoomFloor = new THREE.Mesh(smallerRoomFloorGeometry, smallerRoomFloorMaterial);
smallerRoomFloor.rotation.x = -Math.PI / 2;  // Flat on the ground
smallerRoomFloor.position.set(-90, 0, 0);  // Position the smaller room at the end of the hallway
scene.add(smallerRoomFloor);

// Create the smaller room's walls
const smallerRoomWallGeometry = new THREE.PlaneGeometry(30, 10);  // Wall size to match the floor
const smallerRoomWallFrontGeometry = new THREE.PlaneGeometry(10, 10);  // Wall size to match the floor

//front left wall
const smallerRoomWallFrontLeft = new THREE.Mesh(smallerRoomWallFrontGeometry, wallMaterial);
smallerRoomWallFrontLeft.position.set(-75, 5, -10);  // Align with the left side of the floor
smallerRoomWallFrontLeft.rotation.y = Math.PI / 2;
scene.add(smallerRoomWallFrontLeft);

//front right wall
const smallerRoomWallFrontRight = new THREE.Mesh(smallerRoomWallFrontGeometry, wallMaterial);
smallerRoomWallFrontRight.position.set(-75, 5, 10);  // Align with the left side of the floor
smallerRoomWallFrontRight.rotation.y = Math.PI / 2;
scene.add(smallerRoomWallFrontRight);

// Left wall of the smaller room
const smallerRoomWallLeft = new THREE.Mesh(smallerRoomWallGeometry, wallMaterial);
smallerRoomWallLeft.position.set(-90, 5, -15);  // Align with the left side of the floor
scene.add(smallerRoomWallLeft);

// Right wall of the smaller room
const smallerRoomWallRight = new THREE.Mesh(smallerRoomWallGeometry, wallMaterial);
smallerRoomWallRight.position.set(-90, 5, 15);  // Align with the right side of the floor
scene.add(smallerRoomWallRight);

// Back wall of the smaller room
const smallerRoomWallBack = new THREE.Mesh(smallerRoomWallGeometry, wallMaterial);
smallerRoomWallBack.position.set(-105, 5, 0);  // Align with the back side of the room
smallerRoomWallBack.rotation.y = -Math.PI / 2;
scene.add(smallerRoomWallBack);

// Create the smaller room's roof
const smallerRoomRoofGeometry = new THREE.PlaneGeometry(30, 30);  // Same dimensions as the floor
const smallerRoomRoofMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Same material as the floor
const smallerRoomRoof = new THREE.Mesh(smallerRoomRoofGeometry, smallerRoomRoofMaterial);

// Position and rotate the roof
smallerRoomRoof.rotation.x = Math.PI / 2;  // Flat, facing downward (like the floor)
smallerRoomRoof.position.set(-90, 10, 0);  // Positioned above the walls at y = 10
scene.add(smallerRoomRoof);

// Create the new hallway floor
const newHallwayFloorGeometry = new THREE.PlaneGeometry(10, 70);  // Hallway dimensions (width, length)
const newHallwayFloorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Material for the hallway
const newHallwayFloor = new THREE.Mesh(newHallwayFloorGeometry, newHallwayFloorMaterial);

// Position and rotate the new hallway floor to extend from the door
newHallwayFloor.rotation.x = -Math.PI / 2;  // Flat on the ground
newHallwayFloor.position.set(-90, 0, -40);  // Extend from the left door of the smaller room
scene.add(newHallwayFloor);

// Create the new hallway walls
const newHallwayWallGeometry = new THREE.PlaneGeometry(50, 10);  // Wall dimensions (length, height)
const newHallwayLeftWallGeometry = new THREE.PlaneGeometry(70, 10);

// Left wall of the new hallway
const newHallwayWallLeft = new THREE.Mesh(newHallwayLeftWallGeometry, wallMaterial);
newHallwayWallLeft.position.set(-95, 5, -40);  // Position the left wall
newHallwayWallLeft.rotation.y = -Math.PI/2;  // Rotate 180 degrees to face inward
scene.add(newHallwayWallLeft);

// Right wall of the new hallway
const newHallwayWallRight = new THREE.Mesh(newHallwayWallGeometry, wallMaterial);
newHallwayWallRight.position.set(-85, 5, -40);  // Position the left wall
newHallwayWallRight.rotation.y = -Math.PI/2;  // Rotate 180 degrees to face inward
scene.add(newHallwayWallRight);

// Create the new hallway roof
const newHallwayRoofGeometry = new THREE.PlaneGeometry(10, 70);  // Same dimensions as the floor
const newHallwayRoofMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Same material as the floor
const newHallwayRoof = new THREE.Mesh(newHallwayRoofGeometry, newHallwayRoofMaterial);

// Position and rotate the new hallway roof
newHallwayRoof.rotation.x = Math.PI / 2;  // Flat, facing downward
newHallwayRoof.position.set(-90, 10, -40);  // Positioned above the walls
scene.add(newHallwayRoof);

// Create the extension for the new hallway floor
const extendedHallwayFloorGeometry = new THREE.PlaneGeometry(10, 100);  // Hallway dimensions (width, length)
const extendedHallwayFloorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Material for the hallway
const extendedHallwayFloor = new THREE.Mesh(extendedHallwayFloorGeometry, extendedHallwayFloorMaterial);

// Position and rotate the extended hallway floor to connect to the L-shaped hallway
extendedHallwayFloor.rotation.x = -Math.PI / 2;  // Flat on the ground
extendedHallwayFloor.position.set(-45, 0, -70);  // Extend from the end of the L-shaped hallway
extendedHallwayFloor.rotation.z = Math.PI/2;
scene.add(extendedHallwayFloor);

// Create the extended hallway walls
const extendedHallwayWallGeometry = new THREE.PlaneGeometry(80, 10);  // Wall dimensions (length, height)
const extendedHallwayLeftWallGeometry = new THREE.PlaneGeometry(100, 10);  // Left wall is longer

// Left wall of the extended hallway (longer)
const extendedHallwayWallLeft = new THREE.Mesh(extendedHallwayLeftWallGeometry, wallMaterial);
extendedHallwayWallLeft.position.set(-45, 5, -75);  // Position the left wall
extendedHallwayWallLeft.rotation.y = 0;  // Align it with the new hallway floor
scene.add(extendedHallwayWallLeft);

// Right wall of the extended hallway (shorter)
const extendedHallwayWallRight = new THREE.Mesh(extendedHallwayWallGeometry, wallMaterial);
extendedHallwayWallRight.position.set(-45, 5, -65);  // Position the right wall
extendedHallwayWallRight.rotation.y = 0;  // Align it with the new hallway floor
scene.add(extendedHallwayWallRight);

// Create the extended hallway roof
const extendedHallwayRoofGeometry = new THREE.PlaneGeometry(10, 100);  // Same dimensions as the floor
const extendedHallwayRoofMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Same material as the floor
const extendedHallwayRoof = new THREE.Mesh(extendedHallwayRoofGeometry, extendedHallwayRoofMaterial);

// Position and rotate the extended hallway roof
extendedHallwayRoof.rotation.x = Math.PI / 2;  // Flat, facing downward
extendedHallwayRoof.position.set(-45, 10, -70);  // Positioned above the walls, matching the floor
extendedHallwayRoof.rotation.z = Math.PI / 2;
scene.add(extendedHallwayRoof);

// Create the floor for the final hallway connecting to the main place
const finalHallwayFloorGeometry = new THREE.PlaneGeometry(10, 40);  // Hallway dimensions (width, length)
const finalHallwayFloorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Material for the hallway
const finalHallwayFloor = new THREE.Mesh(finalHallwayFloorGeometry, finalHallwayFloorMaterial);

// Position and rotate the final hallway floor to connect to the extended hallway
finalHallwayFloor.rotation.x = -Math.PI / 2;  // Flat on the ground
finalHallwayFloor.position.set(0, 0, -45);  // Extend from the end of the extended hallway (adjust as needed)
scene.add(finalHallwayFloor);

// Create the final hallway walls
const finalHallwayWallGeometry = new THREE.PlaneGeometry(40, 10);  // Wall dimensions (length, height)
const finalHallwayWallRightGeometry = new THREE.PlaneGeometry(50, 10);

// Left wall of the final hallway
const finalHallwayWallLeft = new THREE.Mesh(finalHallwayWallGeometry, wallMaterial);
finalHallwayWallLeft.position.set(-5, 5, -45);  // Position the left wall
finalHallwayWallLeft.rotation.y = Math.PI / 2;  // Rotate 90 degrees to face inward
scene.add(finalHallwayWallLeft);

// Right wall of the final hallway
const finalHallwayWallRight = new THREE.Mesh(finalHallwayWallRightGeometry, wallMaterial);
finalHallwayWallRight.position.set(5, 5, -50);  // Position the right wall
finalHallwayWallRight.rotation.y = -Math.PI / 2;  // Rotate 90 degrees to face inward
scene.add(finalHallwayWallRight);

// Create the final hallway roof
const finalHallwayRoofGeometry = new THREE.PlaneGeometry(10, 40);  // Same dimensions as the floor
const finalHallwayRoofMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });  // Same material as the floor
const finalHallwayRoof = new THREE.Mesh(finalHallwayRoofGeometry, finalHallwayRoofMaterial);

// Position and rotate the final hallway roof
finalHallwayRoof.rotation.x = Math.PI / 2;  // Flat, facing downward
finalHallwayRoof.position.set(0, 10, -45);  // Positioned above the walls, matching the floor
scene.add(finalHallwayRoof);

// Load concrete texture for the ground
const groundTexture = textureLoader.load('/images/Stylized_Feathers_002_normal.png');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(4, 4);  // Repeat the texture for better tiling

ground.material.map = groundTexture;  // Apply the texture to the ground
ground.material.needsUpdate = true;

smallerRoomRoof.material.map = groundTexture;  // Apply the texture to the smaller room ground
smallerRoomRoof.material.needsUpdate = true;

hallwayFloor.material.map = groundTexture;  // Apply the texture to the hall ground
hallwayFloor.material.needsUpdate = true;

hallwayRoof.material.map = groundTexture;  // Apply the texture to the hall roof
hallwayRoof.material.needsUpdate = true;

smallerRoomFloor.material.map = groundTexture;  // Apply the texture to the  smaller room ground
smallerRoomFloor.material.needsUpdate = true;

newHallwayFloor.material.map = groundTexture;  // Apply the texture to the  new hallway ground
newHallwayFloor.material.needsUpdate = true;

newHallwayRoof.material.map = groundTexture;  // Apply the texture to the  new hallway ground
newHallwayRoof.material.needsUpdate = true;

extendedHallwayFloor.material.map = groundTexture;  // Apply the texture to the  extended hallway ground
extendedHallwayFloor.material.needsUpdate = true;

extendedHallwayRoof.material.map = groundTexture;  // Apply the texture to the  extended hallway roof
extendedHallwayRoof.material.needsUpdate = true;

finalHallwayFloor.material.map = groundTexture;  // Apply the texture to the  final hallway ground
finalHallwayFloor.material.needsUpdate = true;

finalHallwayRoof.material.map = groundTexture;  // Apply the texture to the  final hallway roof
finalHallwayRoof.material.needsUpdate = true;

// Load brick texture for the walls
const wallTexture = textureLoader.load('/images/Stylized_Cliff_Rock_005_normal.png');
wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(2, 2);

wall1.material.map = wallTexture;
wall1.material.needsUpdate = true;

wall2.material.map = wallTexture;
wall2.material.needsUpdate = true;

wall3.material.map = wallTexture;
wall3.material.needsUpdate = true;

wall4.material.map = wallTexture;
wall4.material.needsUpdate = true;

// Apply the texture to the hallway walls
hallwayWallLeft.material.map = wallTexture;
hallwayWallLeft.material.needsUpdate = true;

hallwayWallRight.material.map = wallTexture;
hallwayWallRight.material.needsUpdate = true;

// Apply the texture to the smaller room walls
smallerRoomWallFrontLeft.material.map = wallTexture;
smallerRoomWallFrontLeft.material.needsUpdate = true;

smallerRoomWallFrontRight.material.map = wallTexture;
smallerRoomWallFrontRight.material.needsUpdate = true;

smallerRoomWallLeft.material.map = wallTexture;
smallerRoomWallLeft.material.needsUpdate = true;

smallerRoomWallRight.material.map = wallTexture;
smallerRoomWallRight.material.needsUpdate = true;

smallerRoomWallBack.material.map = wallTexture;
smallerRoomWallBack.material.needsUpdate = true;

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