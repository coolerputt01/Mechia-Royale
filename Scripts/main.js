//import {} from '.Helpers.js';
import { Player } from './Player.js';
import { Controller } from './Controller.js';
import { loadImage } from './Helper.js';
import { Gun } from './Gun.js';
import { Camera } from './Camera.js';
import { MapGenerator } from './WorldGeneration.js';

const dc = document.querySelector('.drawingCanvas');
const zoom = 1.3;
const windowPixel = window.devicePixelRatio || 1;
const ct = dc.getContext('2d');


dc.width = window.innerWidth * windowPixel;
dc.height = window.innerHeight * windowPixel;
dc.style.width = `${window.innerWidth}px`;
dc.style.height = `${window.innerHeight}px`;

function resizeCanvas(){
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scale = window.devicePixelRatio || 1;
  dc.width = width * scale;
  dc.height = height * scale;
  
  dc.style.width = `${width}px`;
  dc.style.height = `${height}px`;
  
  ct.setTransform(1 , 0, 0, 1, 0, 0);
  
  return {width, height,scale};
}

async function loadAssets() {
  try {
    const [characterSprite, padSprite, nubSprite,gunSprite,mapTexture] = await Promise.all([
      loadImage("./Assets/Character/Character.png"),
      loadImage("./Assets/UI/Controllers/jpad.png"),
      loadImage("./Assets/UI/Controllers/jnub.png"),
      loadImage("./Assets/Weapons/MP5.png"),
      loadImage("./Assets/Tilesets/TileSet.png"),
    ]);

    return { characterSprite, padSprite, nubSprite ,gunSprite,mapTexture};
  } catch (err) {
    console.error(err);
  }
}


async function init() {
  const { characterSprite, padSprite, nubSprite,gunSprite ,mapTexture} = await loadAssets();
  
  let canvasSize = resizeCanvas();
  
  const controller = new Controller(230, canvasSize.height, padSprite, nubSprite,1.5);
  const player = new Player(145, 35, 0, 0, characterSprite);
  const gun = new Gun(gunSprite);
  
  const tileSize = 128;
  const mapScale = 1;
  const tilesX = 1500;
  const tilesY = 1500;
  
  const worldWidth = tilesX;
  const worldHeight = tilesY;

  
  let mapCanvas = document.createElement('canvas');
  let mapCtx = mapCanvas.getContext('2d');
  mapCtx.imageSmoothingEnabled = false;
  mapCanvas.width = worldWidth;
  mapCanvas.height = worldHeight;
  
  const map = new MapGenerator(tilesX, tilesY, mapTexture, mapScale, mapCtx);
  map.tileSize = tileSize;
  map.startDraw();
  
  const camera = new Camera(0, 0,
    canvasSize.width / windowPixel,
    canvasSize.height / windowPixel,
    worldWidth,
    worldHeight
  );
  
  camera.worldWidth = worldWidth;
  camera.worldHeight = worldHeight;
  //ct.setTransform(1,0,0,1,0,0); // 200
  ct.imageSmoothingEnabled = false;
  
  let lastFrame = performance.now();
  
  function gameLoop(now) {
    let delta = (now - lastFrame)/1000;
    lastFrame = now;
    ct.setTransform(1 , 0, 0, 1, 0, 0);
    ct.clearRect(0, 0, dc.width, dc.height);
    ct.imageSmoothingEnabled = false;
    
    if (controller.active) {
      player.ismoving = true;
      const speed = 500;
      player.x += controller.moveX * delta * speed;
      player.y += controller.moveY * delta * speed;
      
      player.x = Math.max(0, Math.min(player.x, camera.worldWidth - player.width * player.scale));
      player.y = Math.max(0, Math.min(player.y, camera.worldHeight - player.height * player.scale));
      
      if (controller.moveX > 0){
        player.isFacing = "right";
      }else if (controller.moveX < 0) {
        player.isFacing = "left";
      }
    }else {
      player.ismoving = false;
    }
    camera.followPlayer(player,windowPixel);
    
    ct.save();
    ct.setTransform(zoom, 0, 0, zoom, -camera.x * zoom, -camera.y * zoom);
    ct.drawImage(mapCanvas, 0, 0);
    gun.draw(ct,player,delta);
    player.drawFrame(ct,delta);
    ct.restore();
    
    camera.drawWorldBorder(ct,zoom);
    //camera.drawDeadzone(ct,zoom);
    
    //ct.setTransform(zoom, 0, 0, zoom, 0, 0);
    controller.draw(ct);
  
    requestAnimationFrame(gameLoop);
  }
  document.addEventListener('touchstart', e => {
    for (let t of e.changedTouches) controller.onTouchStart(t,dc);
  });
  document.addEventListener('touchmove', e => {
    for (let t of e.changedTouches) controller.onTouchMove(t,dc);
  });
  document.addEventListener('touchend', e => {
    for (let t of e.changedTouches) controller.onTouchEnd(t);
  });
  requestAnimationFrame(gameLoop);
  /*window.addEventListener('resize', () => {
  canvasSize = resizeCanvas();
  controller.x = 230;
  controller.y = canvasSize.height - 250;
  });*/
  window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    canvasSize = resizeCanvas();

    camera.canvasWidth = canvasSize.width;
    camera.canvasHeight = canvasSize.height;
    
    controller.x = 230;
    controller.y = canvasSize.height;
    
    camera.x = Math.max(0, Math.min(player.x - camera.canvasWidth / 2, worldWidth - camera.canvasWidth));
    camera.y = Math.max(0, Math.min(player.y - camera.canvasHeight / 2, worldHeight - camera.canvasHeight));
  }, 300);
});
}

init();