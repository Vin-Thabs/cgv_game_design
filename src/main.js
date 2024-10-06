import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118.1/build/three.module.js';

import {third_person_camera} from './third-person-camera.js';
import {entity_manager} from './entity-manager.js';
import {player_entity} from './player-entity.js'
import {entity} from './entity.js';
import {gltf_component} from './gltf-component.js';
import {health_component} from './health-component.js';
import {player_input} from './player-input.js';
import {npc_entity} from './npc-entity.js';
import {math} from './math.js';
import {spatial_hash_grid} from './spatial-hash-grid.js';
import {ui_controller} from './ui-controller.js';
import {health_bar} from './health-bar.js';
import {level_up_component} from './level-up-component.js';
import {quest_component} from './quest-component.js';
import {spatial_grid_controller} from './spatial-grid-controller.js';
import {inventory_controller} from './inventory-controller.js';
import {equip_weapon_component} from './equip-weapon-component.js';
import {attack_controller} from './attacker-controller.js';


// const _VS = `
// varying vec3 vWorldPosition;

// void main() {
//   vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
//   vWorldPosition = worldPosition.xyz;

//   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
// }`;


// const _FS = `
// uniform vec3 topColor;
// uniform vec3 bottomColor;
// uniform float offset;
// uniform float exponent;

// varying vec3 vWorldPosition;

// void main() {
//   float h = normalize( vWorldPosition + offset ).y;
//   gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
// }`;



class HackNSlashDemo {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.outputEncoding = THREE.sRGBEncoding;
    this._threejs.gammaFactor = 2.2;
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this._threejs.domElement.id = 'threejs';

    document.getElementById('container').appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 10000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(25, 10, 25);

    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0xFFFFFF);
    this._scene.fog = new THREE.FogExp2(0x89b2eb, 0.002);

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(-10, 500, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 1000.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    this._sun = light;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10000, 10000, 10, 10),
        new THREE.MeshStandardMaterial({
            color: 0x1e601c,
          }));
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    this._entityManager = new entity_manager.EntityManager();
    this._grid = new spatial_hash_grid.SpatialHashGrid(
        [[-1000, -1000], [1000, 1000]], [100, 100]);

    this._LoadControllers();
    this._LoadPlayer();
    //this._LoadFoliage();
    //this._LoadClouds();
   // this._LoadSky();

    this._LoadAudio();
    this._LoadAudioFootsteps();
    //this._LoadVideo()

    this._previousRAF = null;
    this._RAF();
   }

  _LoadControllers() {
    const ui = new entity.Entity();
    ui.AddComponent(new ui_controller.UIController());
    this._entityManager.Add(ui, 'ui');
  }

  // _LoadSky() {
  //   const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFFF, 0.6);
  //   hemiLight.color.setHSL(0.6, 1, 0.6);
  //   hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  //   this._scene.add(hemiLight);

  //   const uniforms = {
  //     "topColor": { value: new THREE.Color(0x0077ff) },
  //     "bottomColor": { value: new THREE.Color(0xffffff) },
  //     "offset": { value: 33 },
  //     "exponent": { value: 0.6 }
  //   };
  //   uniforms["topColor"].value.copy(hemiLight.color);

  //   this._scene.fog.color.copy(uniforms["bottomColor"].value);

  //   const skyGeo = new THREE.SphereBufferGeometry(1000, 32, 15);
  //   const skyMat = new THREE.ShaderMaterial({
  //       uniforms: uniforms,
  //       vertexShader: _VS,
  //       fragmentShader: _FS,
  //       side: THREE.BackSide
  //   });

  //   const sky = new THREE.Mesh(skyGeo, skyMat);
  //   this._scene.add(sky);
  // }

  // _LoadClouds() {
  //   for (let i = 0; i < 20; ++i) {
  //     const index = math.rand_int(1, 3);
  //   const pos = new THREE.Vector3(
  //       (Math.random() * 2.0 - 1.0) * 500,
  //       100,
  //       (Math.random() * 2.0 - 1.0) * 500);

  //     const e = new entity.Entity();
  //     e.AddComponent(new gltf_component.StaticModelComponent({
  //       scene: this._scene,
  //       resourcePath: './resources/nature2/GLTF/',
  //       resourceName: 'Cloud' + index + '.glb',
  //       position: pos,
  //       scale: Math.random() * 5 + 10,
  //       emissive: new THREE.Color(0x808080),
  //     }));
  //     e.SetPosition(pos);
  //     this._entityManager.Add(e);
  //     e.SetActive(false);
  //   }
  // }

  // _LoadFoliage() {
  //   for (let i = 0; i < 100; ++i) {
  //     const names = [
  //         'CommonTree_Dead', 'CommonTree',
  //         'BirchTree', 'BirchTree_Dead',
  //         'Willow', 'Willow_Dead',
  //         'PineTree',
  //     ];
  //     const name = names[math.rand_int(0, names.length - 1)];
  //     const index = math.rand_int(1, 5);

  //     const pos = new THREE.Vector3(
  //         (Math.random() * 2.0 - 1.0) * 500,
  //         0,
  //         (Math.random() * 2.0 - 1.0) * 500);

  //     const e = new entity.Entity();
  //     e.AddComponent(new gltf_component.StaticModelComponent({
  //       scene: this._scene,
  //       resourcePath: './resources/nature/FBX/',
  //       resourceName: name + '_' + index + '.fbx',
  //       scale: 0.25,
  //       emissive: new THREE.Color(0x000000),
  //       specular: new THREE.Color(0x000000),
  //       receiveShadow: true,
  //       castShadow: true,
  //     }));
  //     e.AddComponent(
  //         new spatial_grid_controller.SpatialGridController({grid: this._grid}));
  //     e.SetPosition(pos);
  //     this._entityManager.Add(e);
  //     e.SetActive(false);
  //   }
  // }
  _LoadAudio() {
    const listener = new THREE.AudioListener();
    this._camera.add(listener);

    // Create a global audio source
    this._sound = new THREE.Audio(listener);

    // Load a sound and set it as the audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('../resources/Music/theme.mp3', (buffer) => {
        this._sound.setBuffer(buffer);
        this._sound.setLoop(true);   // Loop the background music
        this._sound.setVolume(0.5);  // Adjust volume as needed
        // Play only if not already playing
        if (!this._sound.isPlaying) {
            this._sound.play();
        }
    });

    //Resume audio context after user interaction if suspended
    window.addEventListener('click', () => {
        if (listener.context.state === 'suspended') {
            listener.context.resume();
        }
    });
 }

//  _LoadAudio() {
//   const listener = new THREE.AudioListener();
//   this._camera.add(listener);

//   // Create an audio source for background music
//   this._audio = new THREE.Audio(listener);

//   // Load the audio file
//   const audioLoader = new THREE.AudioLoader();
//   audioLoader.load('../resources/Sounds/background-music.mp3', (buffer) => {
//       this._audio.setBuffer(buffer);
//       this._audio.setLoop(true); // Loop the music
//       this._audio.setVolume(0.5); // Adjust volume as needed
//       this._audio.play();         // Play audio automatically after loading
//   });
// }


 _LoadAudioFootsteps() {
  const listener = new THREE.AudioListener();
  this._camera.add(listener);

  // Create a separate audio source for footsteps
  this._footstepSound = new THREE.Audio(listener);

  // Load the footstep sound
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('../resources/Music/forever.mp3', (buffer) => {
      this._footstepSound.setBuffer(buffer);
      this._footstepSound.setLoop(true);   // Loop the footstep sound
      this._footstepSound.setVolume(1);  // Adjust volume as needed
  });

  // Add event listeners for key press and key release
  document.addEventListener('keydown', (event) => this._OnKeyPress(event));
  document.addEventListener('keyup', (event) => this._OnKeyRelease(event));
}

_OnKeyPress(event) {
  // Check if one of the movement keys is pressed and footstep sound isn't already playing
  if (['KeyW', 'KeyS'].includes(event.code)) {
    if (!this._footstepSound.isPlaying) {
      this._footstepSound.play();  // Play footstep sound on movement
    }
  }
}

_LoadVideo() {
  // Create a video element
  const video = document.createElement('video');
  
  // Set video attributes
  video.src = '../resources/Video/hello.mp4'; // Replace with your video file path
  video.crossOrigin = 'anonymous'; // Optional: For cross-origin requests
  video.loop = true; // Loop the video if desired
  video.muted = true; // Mute the video if you don't want sound
  video.style.position = 'absolute'; // Positioning the video
  video.style.top = '0'; // Adjust as necessary
  video.style.left = '0'; // Adjust as necessary
  video.style.width = '100%'; // Fullscreen width
  video.style.height = '100%'; // Fullscreen height
  video.style.zIndex = '0'; // Background layer

  // Append the video to the container (make sure it exists in your HTML)
  document.getElementById('container').appendChild(video);
  
  // Play the video automatically
  video.play().catch(error => {
      console.error('Error attempting to play video:', error);
  });

  // Optionally, handle video end event
  video.addEventListener('ended', () => {
      // Perform any actions when video ends, if needed
  });
}


_OnKeyRelease(event) {
  // Stop the footstep sound when the movement keys are released
  if (['KeyW', 'KeyS'].includes(event.code)) {
    if (this._footstepSound.isPlaying) {
      this._footstepSound.stop();  // Stop the footstep sound when movement stops
    }
  }
}



  

  _LoadPlayer() {
    const params = {
      camera: this._camera,
      scene: this._scene,
    };

    //this has an effect on you attack, health and monsters
    const levelUpSpawner = new entity.Entity();
    levelUpSpawner.AddComponent(new level_up_component.LevelUpComponentSpawner({
        camera: this._camera,
        scene: this._scene,
    }));
    this._entityManager.Add(levelUpSpawner, 'level-up-spawner');

    // const axe = new entity.Entity();
    // axe.AddComponent(new inventory_controller.InventoryItem({
    //     type: 'weapon',
    //     damage: 3,
    //     renderParams: {
    //       name: 'Axe',
    //       scale: 0.25,
    //       icon: 'war-axe-64.png',
    //     },
    // }));
    //this._entityManager.Add(axe);

    const sword = new entity.Entity();
    sword.AddComponent(new inventory_controller.InventoryItem({
        type: 'weapon',
        damage: 3,
        renderParams: {
          name: 'Sword',
          scale: 0.25,
          icon: 'pointy-sword-64.png',
        },
    }));
    this._entityManager.Add(sword);

    // const girl = new entity.Entity();
    // girl.AddComponent(new gltf_component.AnimatedModelComponent({
    //     scene: this._scene,
    //     resourcePath: './resources/girl/',
    //     resourceName: 'peasant_girl.fbx',
    //     resourceAnimation: 'Standing Idle.fbx',
    //     scale: 0.035,
    //     receiveShadow: true,
    //     castShadow: true,
    // }));
    // girl.AddComponent(new spatial_grid_controller.SpatialGridController({
    //     grid: this._grid,
    // }));
    // girl.AddComponent(new player_input.PickableComponent());
    // girl.AddComponent(new quest_component.QuestComponent());
    // girl.SetPosition(new THREE.Vector3(30, 0, 0));
    // this._entityManager.Add(girl);

    const player = new entity.Entity();
    player.AddComponent(new player_input.BasicCharacterControllerInput(params));
    player.AddComponent(new player_entity.BasicCharacterController(params));
    player.AddComponent(
      new equip_weapon_component.EquipWeapon({anchor: 'RightHandIndex1'}));
    player.AddComponent(new inventory_controller.InventoryController(params));
    player.AddComponent(new health_component.HealthComponent({
        updateUI: true,
        health: 100,
        maxHealth: 100,
        strength: 50,
        wisdomness: 5,
        benchpress: 20,
        curl: 100,
        experience: 0,
        level: 1,
    }));
    player.AddComponent(
        new spatial_grid_controller.SpatialGridController({grid: this._grid}));
    player.AddComponent(new attack_controller.AttackController({timing: 0.7}));
    this._entityManager.Add(player, 'player');

    // player.Broadcast({
    //     topic: 'inventory.add',
    //     value: axe.Name,
    //     added: false,
    // });

    player.Broadcast({
        topic: 'inventory.add',
        value: sword.Name,
        added: false,
    });

    player.Broadcast({
        topic: 'inventory.equip',
        value: sword.Name,
        added: false,
    });

    const camera = new entity.Entity();
    camera.AddComponent(
        new third_person_camera.ThirdPersonCamera({
            camera: this._camera,
            target: this._entityManager.Get('player')}));
    this._entityManager.Add(camera, 'player-camera');

    // this handlees monsters and the npc enables them to run by themselves;
    for (let i = 0; i < 50; ++i) {
      const monsters = [
        {
          resourceName: 'Ghost.fbx',
          resourceTexture: 'Ghost_Texture.png',
        },
        {
          resourceName: 'Alien.fbx',
          resourceTexture: 'Alien_Texture.png',
        },
        {
          resourceName: 'Skull.fbx',
          resourceTexture: 'Skull_Texture.png',
        },
        {
          resourceName: 'GreenDemon.fbx',
          resourceTexture: 'GreenDemon_Texture.png',
        },
        {
          resourceName: 'Cyclops.fbx',
          resourceTexture: 'Cyclops_Texture.png',
        },
        {
          resourceName: 'Cactus.fbx',
          resourceTexture: 'Cactus_Texture.png',
        },
      ];
      const m = monsters[math.rand_int(0, monsters.length - 1)];

      const npc = new entity.Entity();
      npc.AddComponent(new npc_entity.NPCController({
          camera: this._camera,
          scene: this._scene,
          resourceName: m.resourceName,
          resourceTexture: m.resourceTexture,
      }));
      npc.AddComponent(
          new health_component.HealthComponent({
              health: 100,
              maxHealth: 100,
              strength: 10,
              wisdomness: 2,
              benchpress: 3,
              curl: 1,
              experience: 0,
              level: 2,
              camera: this._camera,
              scene: this._scene,
          }));
      npc.AddComponent(
          new spatial_grid_controller.SpatialGridController({grid: this._grid}));
      npc.AddComponent(new health_bar.HealthBar({
          parent: this._scene,
          camera: this._camera,
      }));
      npc.AddComponent(new attack_controller.AttackController({timing: 0.35}));
      npc.SetPosition(new THREE.Vector3(
          (Math.random() * 2 - 1) * 500,
          0,
          (Math.random() * 2 - 1) * 500));
      this._entityManager.Add(npc);
    }
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _UpdateSun() {
    const player = this._entityManager.Get('player');
    const pos = player._position;

    this._sun.position.copy(pos);
    this._sun.position.add(new THREE.Vector3(-10, 500, -10));
    this._sun.target.position.copy(pos);
    this._sun.updateMatrixWorld();
    this._sun.target.updateMatrixWorld();
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Step(timeElapsed) {
    const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);

    this._UpdateSun();

    this._entityManager.Update(timeElapsedS);
  }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new HackNSlashDemo();
});
