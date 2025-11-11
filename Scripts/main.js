//import {} from '.Helpers.js';
import { Player } from './Player.js';
import { Controller } from './Controller.js';
import { loadImage } from './Helper.js';
import { Gun } from './Gun.js';
import { Camera } from './Camera.js';

const dc = document.querySelector('.drawingCanvas');
const zoom = 1.3;
const windowPixel = window.devicePixelRatio || 1;
const ct = dc.getContext('2d');
const worldWidth = 2560;
const worldHeight = 960; 



dc.width = window.innerWidth * windowPixel;
dc.height = window.innerHeight * windowPixel;
ct.scale(windowPixel,windowPixel);

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
  
  ct.setTransform(zoom * scale/2 , 0, 0, zoom * scale/2, 0, 0);
  
  return {width, height,scale};
}

async function loadAssets() {
  try {
    const [characterSprite, padSprite, nubSprite,gunSprite] = await Promise.all([
      loadImage("./Assets/Character/Character.png"),
      loadImage("./Assets/UI/Controllers/jpad.png"),
      loadImage("./Assets/UI/Controllers/jnub.png"),
      loadImage("./Assets/Weapons/MP5.png")
    ]);

    return { characterSprite, padSprite, nubSprite ,gunSprite};
  } catch (err) {
    console.error(err);
  }
}


async function init() {
  const { characterSprite, padSprite, nubSprite,gunSprite } = await loadAssets();
  
  let canvasSize = resizeCanvas();
  
  const controller = new Controller(230, canvasSize.height, padSprite, nubSprite);
  const player = new Player(145, 35, 0, 0, characterSprite);
  const gun = new Gun(gunSprite);
  const camera = new Camera(
    0, 0,
    canvasSize.width / windowPixel,
    canvasSize.height / windowPixel,
    worldWidth, worldHeight
  );
  
  let lastFrame = performance.now();
  
  function gameLoop(now) {
    let delta = (now - lastFrame)/1000;
    lastFrame = now;
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
    ct.setTransform(zoom, 0, 0, zoom, 0, 0); 
    ct.clearRect(0, 0, dc.width, dc.height);
    ct.setTransform(zoom * windowPixel/2, 0, 0, zoom * windowPixel/2, -camera.x * zoom, -camera.y * zoom);
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
    console.log('hi')
  });
  document.addEventListener('touchmove', e => {
    for (let t of e.changedTouches) controller.onTouchMove(t,dc);
    console.log('ahhh')
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
    controller.x = 230;
    camera.canvasWidth = canvasSize.width / windowPixel;
    camera.canvasHeight = canvasSize.height / windowPixel;
    controller.y = canvasSize.height;
  }, 300);
});
}

init();