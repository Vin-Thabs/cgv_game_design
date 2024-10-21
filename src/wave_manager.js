import { EntityManager } from './entity_manager'; 
import {npc_entity} from './npc-entity.js';   
import {health_component} from './health-component.js';
import {spatial_grid_controller} from './spatial-grid-controller.js';
import {health_bar} from './health-bar.js';         
import { attack_controller } from './attack_controller'; 

// Assuming you are using THREE.js for 3D vectors
import * as THREE from 'three'; // Vector3 for positioning



class ZombieWaveSpawner {
    constructor(entityManager, camera, scene, grid) {
      this._entityManager = entityManager;
      this._camera = camera;
      this._scene = scene;
      this._grid = grid;
      this._waveInterval = 5 * 60 * 1000;  // 5 minutes in milliseconds
      this._zombieCount = 10;  // Number of zombies per wave
      this._waveTimer = 0;
    }
  
    // Function to spawn one zombie
    _spawnZombie() {
      const zombies = [
        {
          resourceName: 'Zombie1.fbx',
          resourceTexture: 'Zombie1_Texture.png',
        },
        {
          resourceName: 'Zombie2.fbx',
          resourceTexture: 'Zombie2_Texture.png',
        },
      ];
  
      const randomZombie = zombies[Math.floor(Math.random() * zombies.length)];
  
      const npc = new entity.Entity();
      npc.AddComponent(new npc_entity.NPCController({
        camera: this._camera,
        scene: this._scene,
        resourceName: randomZombie.resourceName,
        resourceTexture: randomZombie.resourceTexture,
      }));
      npc.AddComponent(
        new health_component.HealthComponent({
          health: 100,
          maxHealth: 100,
          strength: 2,
          wisdomness: 1,
          benchpress: 1,
          curl: 1,
          experience: 0,
          level: 1,
          camera: this._camera,
          scene: this._scene,
        })
      );
      npc.AddComponent(
        new spatial_grid_controller.SpatialGridController({ grid: this._grid })
      );
      npc.AddComponent(new health_bar.HealthBar({
        parent: this._scene,
        camera: this._camera,
      }));
      npc.AddComponent(new attack_controller.AttackController({ timing: 0.35 }));
  
      // Set random position within a certain area
      npc.SetPosition(new THREE.Vector3(
        (Math.random() * 2 - 1) * 300 / 2,
        0,
        (Math.random() * 2 - 1) * 300 / 2
      ));
  
      this._entityManager.Add(npc);
    }
  
    // Function to spawn a wave of zombies
    _spawnWave() {
      for (let i = 0; i < this._zombieCount; ++i) {
        this._spawnZombie();
      }
     
    }
  
    // Update method to check if the wave should spawn
    Update(timeElapsed) {
      this._waveTimer += timeElapsed;
  
      // If 5 minutes have passed, spawn a new wave
      if (this._waveTimer >= this._waveInterval) {
        this._spawnWave();
        this._waveTimer = 0;  // Reset timer after wave
      }
    }
  }
  
  class Game {
    constructor() {
      this._entityManager = new EntityManager();
      this._camera = new THREE.Camera();
      this._scene = new THREE.Scene();
      this._grid = new SpatialGrid(100, 100);
  
      // Create the zombie wave spawner
      this._zombieWaveSpawner = new ZombieWaveSpawner(
        this._entityManager, 
        this._camera, 
        this._scene, 
        this._grid
      );
  
      // Optionally initialize other entities like the player camera
      const playerCamera = new entity.Entity();
      playerCamera.AddComponent(
        new third_person_camera.ThirdPersonCamera({
          camera: this._camera,
          target: this._entityManager.Get('player'),
        })
      );
      this._entityManager.Add(playerCamera, 'player-camera');
    }
  
    Update(timeElapsed) {
      // Update the wave spawner
      this._zombieWaveSpawner.Update(timeElapsed);
  
      // Other update logic for your game...
      this._entityManager.Update(timeElapsed);
    }
  }
  
  // Main game loop with time tracking
  let lastTime = 0;
  const game = new Game();
  
  function gameLoop(time) {
    const timeElapsed = time - lastTime;
    lastTime = time;
  
    // Call game update with the elapsed time
    game.Update(timeElapsed);
  
    // Continue the game loop
    requestAnimationFrame(gameLoop);
  }
  
  // Start the game loop
  requestAnimationFrame(gameLoop);
  