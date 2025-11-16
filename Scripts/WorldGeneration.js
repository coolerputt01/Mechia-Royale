let gridSpace = {
  empty: 0,
  floor: 1,
  wall: 2,
};

function RandomDirection() {
  const choice = Math.floor(Math.random() * 4);
  switch (choice) {
    case 0:
      return { x: 0, y: -1 };
    case 1:
      return { x: -1, y: 0 };
    case 2:
      return { x: 0, y: 1 };
    default:
      return { x: 1, y: 0 };
  }
}

class MapGenerator {
  constructor(width, height, tileset, scale = 2, ct) {
    this.width = width;
    this.height = height;
    this.tileset = tileset;
    this.tileSize = 16;
    this.scale = scale;
    this.grid = [];
    this.walkers = [];
    this.chanceWalkerDirChange = 0.5;
    this.chanceWalkerSpawn = 0.01;
    this.chanceWalkerDestroy = 0.05;
    this.percentToFill = 0.9;
    this.maxWalkers = 10;
    this.ct = ct;
  }
  
  startDraw() {
    this.ct.clearRect(0, 0, this.ct.canvas.width, this.ct.canvas.height);
    this.walkers = [];
    this.grid = [];
    this.setupGenerator();
    this.createFloors();
    this.spawnFloors();
  }
  
  setupGenerator() {
    this.grid = Array.from({ length: this.width }, () => Array(this.height).fill(gridSpace.empty));
    const walker = {
      dir: RandomDirection(),
      pos: {
        x: Math.floor(this.width / 2),
        y: Math.floor(this.height / 2),
      },
    };
    
    this.walkers.push(walker);
  }
  
  numberOfFloors() {
    let count = 0;
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.grid[x][y] === gridSpace.floor) count++;
      }
    }
    return count;
  }
  
  createFloors() {
    let iterations = 0;
    const maxIterations = 1000;
    
    while (iterations < maxIterations) {
      this.walkers.forEach((w) => {
        this.grid[w.pos.x][w.pos.y] = gridSpace.floor;
      });
      
      for (let i = this.walkers.length - 1; i >= 0; i--) {
        if (Math.random() < this.chanceWalkerDestroy && this.walkers.length > 1) {
          this.walkers.splice(i, 1);
        }
      }
      
      this.walkers.forEach((w) => {
        if (Math.random() < this.chanceWalkerDirChange) {
          w.dir = RandomDirection();
        }
      });
      
      if (Math.random() < this.chanceWalkerSpawn && this.walkers.length < this.maxWalkers) {
        const parent = this.walkers[Math.floor(Math.random() * this.walkers.length)];
        const newWalker = {
          pos: { ...parent.pos },
          dir: RandomDirection(),
        };
        this.walkers.push(newWalker);
      }
      
      this.walkers.forEach((w) => {
        w.pos.x += w.dir.x;
        w.pos.y += w.dir.y;
        w.pos.x = Math.max(1, Math.min(w.pos.x, this.width - 2));
        w.pos.y = Math.max(1, Math.min(w.pos.y, this.height - 2));
      });
      
      const fillPercent = this.numberOfFloors() / (this.width * this.height);
      if (fillPercent > this.percentToFill) break;
      
      iterations++;
    }
  }
  
  spawnFloors() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        switch (this.grid[x][y]) {
          case gridSpace.empty:
            this.spawnDetail(x,y,"empty")
            break;
          case gridSpace.floor:
            this.spawnDetail(x, y, "floor");
            break;
          case gridSpace.wall:
            this.spawnDetail(x, y, "wall");
            break;
        }
      }
    }
  }
  
  spawnDetail(x, y, tileType) {
    //let sx, sy;
    switch (tileType) {
      case "empty":
        break;
      case "floor":
        this.ct.fillStyle = "red";
        //sx = 16*15; sy = 16;
        break;
      case "wall":
        //sx = 8; sy = 10;
        break;
    }
    this.ct.fillRect(x, y, this.tileSize, this.tileSize);
}
}

export { MapGenerator };