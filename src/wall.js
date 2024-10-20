import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118.1/build/three.module.js';



export class MazeGenerator {
  constructor(scene) {
    this._scene = scene;
    this._mazeWidth = 10; // Number of cells horizontally
    this._mazeHeight = 10; // Number of cells vertically
    this._cellSize = 50; // Size of each cell in the maze
    this._wallHeight = 100;
    this._wallThickness = 5;
    this._maze = this._generateMaze();
    this._textureLoader = new THREE.TextureLoader();
  }

  // Function to generate maze using a simple DFS algorithm
  _generateMaze() {
    const maze = Array.from({ length: this._mazeHeight }, () =>
      Array.from({ length: this._mazeWidth }, () => ({
        visited: false,
        walls: [true, true, true, true], // [top, right, bottom, left]
      }))
    );

    const stack = [];
    const startCell = { x: 0, y: 0 };
    stack.push(startCell);
    maze[0][0].visited = true;

    const directions = [
      { x: 0, y: -1, wall: 0 }, // Top
      { x: 1, y: 0, wall: 1 }, // Right
      { x: 0, y: 1, wall: 2 }, // Bottom
      { x: -1, y: 0, wall: 3 }, // Left
    ];

    while (stack.length > 0) {
      const currentCell = stack[stack.length - 1];
      const { x, y } = currentCell;

      const unvisitedNeighbors = directions
        .map(({ x: dx, y: dy, wall }) => ({
          x: x + dx,
          y: y + dy,
          wall,
          oppositeWall: (wall + 2) % 4,
        }))
        .filter(
          (neighbor) =>
            neighbor.x >= 0 &&
            neighbor.y >= 0 &&
            neighbor.x < this._mazeWidth &&
            neighbor.y < this._mazeHeight &&
            !maze[neighbor.y][neighbor.x].visited
        );

      if (unvisitedNeighbors.length > 0) {
        const nextCell = unvisitedNeighbors[
          Math.floor(Math.random() * unvisitedNeighbors.length)
        ];
        maze[nextCell.y][nextCell.x].visited = true;
        maze[y][x].walls[nextCell.wall] = false;
        maze[nextCell.y][nextCell.x].walls[nextCell.oppositeWall] = false;
        stack.push({ x: nextCell.x, y: nextCell.y });
      } else {
        stack.pop();
      }
    }

    return maze;
  }

  _createWall(x, y, width, height, rotation) {
    const wallTexture = this._textureLoader.load('../images/wall.jpg');
    const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
    const wallGeometry = new THREE.BoxGeometry(width, height, this._wallThickness);
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, this._wallHeight / 2, y);
    wall.rotation.y = rotation;
    wall.castShadow = true;
    wall.receiveShadow = true;
    this._scene.add(wall);
  }

  buildMaze() {
    const halfCell = this._cellSize / 2;
    // Iterate through the maze grid and place walls based on cell data
    for (let y = 0; y < this._mazeHeight; y++) {
      for (let x = 0; x < this._mazeWidth; x++) {
        const cell = this._maze[y][x];
        const posX = x * this._cellSize - (this._mazeWidth * this._cellSize) / 2;
        const posY = y * this._cellSize - (this._mazeHeight * this._cellSize) / 2;

        // Top wall
        if (cell.walls[0]) {
          this._createWall(posX, posY - halfCell, this._cellSize, this._wallHeight, 0);
        }

        // Right wall
        if (cell.walls[1]) {
          this._createWall(posX + halfCell, posY, this._cellSize, this._wallHeight, Math.PI / 2);
        }

        // Bottom wall
        if (cell.walls[2]) {
          this._createWall(posX, posY + halfCell, this._cellSize, this._wallHeight, 0);
        }

        // Left wall
        if (cell.walls[3]) {
          this._createWall(posX - halfCell, posY, this._cellSize, this._wallHeight, Math.PI / 2);
        }
      }
    }
  }

  getWallPositions() {
    const wallPositions = [];
    const halfCell = this._cellSize / 2;

    // Iterate through each cell of the maze
    for (let y = 0; y < this._mazeHeight; y++) {
      for (let x = 0; x < this._mazeWidth; x++) {
        const cell = this._maze[y][x];
        const posX = x * this._cellSize - (this._mazeWidth * this._cellSize) / 2;
        const posY = y * this._cellSize - (this._mazeHeight * this._cellSize) / 2;

        // For each wall in the cell, calculate the grid points it covers

        // Top wall (horizontal, spans along X axis)
        if (cell.walls[0]) {
          wallPositions.push(...this._getCoveredPoints(posX - halfCell, posX + halfCell, posY - halfCell, posY - halfCell));
        }

        // Right wall (vertical, spans along Y axis)
        if (cell.walls[1]) {
          wallPositions.push(...this._getCoveredPoints(posX + halfCell, posX + halfCell, posY - halfCell, posY + halfCell));
        }

        // Bottom wall (horizontal, spans along X axis)
        if (cell.walls[2]) {
          wallPositions.push(...this._getCoveredPoints(posX - halfCell, posX + halfCell, posY + halfCell, posY + halfCell));
        }

        // Left wall (vertical, spans along Y axis)
        if (cell.walls[3]) {
          wallPositions.push(...this._getCoveredPoints(posX - halfCell, posX - halfCell, posY - halfCell, posY + halfCell));
        }
      }
    }

    return wallPositions;
  }

  // Helper function to return all grid points covered by the wall
  _getCoveredPoints(startX, endX, startY, endY) {
    const coveredPoints = [];

    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);

    // Loop over every integer point in the covered range
    for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
      for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
        coveredPoints.push(new THREE.Vector3(x, this._wallHeight / 2, y));
      }
    }

    return coveredPoints;
  }

}
