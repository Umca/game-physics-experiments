'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

console.clear();

var mesh = undefined;
var cloth = undefined;
var spacingX = 5;
var spacingY = 5;

var opts = {
 image: 'hhttps://unsplash.it/400/400?image=1053',
 pointsX: 50,
 pointsY: 50,
 pointCount: 50,
 brushSize: 30,

//  randomImage: function randomImage() {
//    this.image = 'https://unsplash.it/400/400?image=' + Math.floor(Math.random() * 1100);
//    if (cloth) {
//      cloth.randomize(loadTexture);
//    } else {
//      loadTexture();
//    }
//  },
//  reset: function reset() {
//    if (cloth) {
//      cloth.reset();
//    }
//  },
//  randomizePoints: function randomizePoints() {
//    if (cloth) {
//      cloth.randomize();
//    }
//  }
};

/*////////////////////////////////////////*/

var mouse = {
 down: false,
 x: 0,
 y: 0,
 px: 0,
 py: 1
};

var brush = new PIXI.Graphics();
function updateBrush() {
 brush.clear();
 brush.blendMode = PIXI.BLEND_MODES.ADD;
 brush.lineStyle(1, 0x888888, 0.4);
 brush.drawCircle(0, 0, opts.brushSize); // drawCircle(x, y, radius)
 brush.x = mouse.x;
 brush.y = mouse.y;
 brush.updateLocalBounds();
}

updateBrush();


/*////////////////////////////////////////*/

var stage = new PIXI.Container();
stage.addChild(brush);

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { transparent: true });

document.body.appendChild(renderer.view);
renderer.render(stage);

/*////////////////////////////////////////*/

function loadTexture() {

 console.log('loading texture', opts.image);

 document.body.className = 'loading';

 var texture = new PIXI.Texture.fromImage('pion.jpg');
 if (!texture.requiresUpdate) {
   texture.update();
 }

 texture.on('error', function () {
   console.error('AGH!');
 });

 texture.on('update', function () {
   document.body.className = '';

   console.log('texture loaded');

   if (mesh) {
     stage.removeChild(mesh);
   }

   mesh = new PIXI.mesh.Plane(this, opts.pointsX, opts.pointsY);
   mesh.width = this.width;
   mesh.height = this.height;

   mesh.x = renderer.width / 2 - mesh.width / 2;
   mesh.y = renderer.height / 2 - mesh.height / 2;

   spacingX = mesh.width / (opts.pointsX - 1);
   spacingY = mesh.height / (opts.pointsY - 1);

   cloth = new Cloth(opts.pointsX - 1, opts.pointsY - 1, !opts.pinCorners);

   stage.addChildAt(mesh, 0);
 });
}

loadTexture(opts.image);

/*////////////////////////////////////////*/

;(function update() {
 requestAnimationFrame(update);
 if (cloth) {
   cloth.update(0.016);
 }
 brush.x = mouse.x;
 brush.y = mouse.y;
 renderer.render(stage);
})(0);

/*////////////////////////////////////////*/

var twoPi = Math.PI * 2;
var ease = Elastic.easeOut.config(1.2, 0.4);

var Point = function () {
 function Point(x, y) {
   _classCallCheck(this, Point);

   this.x = this.origX = x;
   this.y = this.origY = y;

   this.randomize(this.reset.bind(this));
 }

 Point.prototype.animateTo = function animateTo(nx, ny, force, callback) {
   var _this = this;

   if (!this.resetting || force) {
     var dx = nx - this.x;
     var dy = ny - this.y;
     var dist = Math.sqrt(dx * dx + dy * dy);
     this.resetting = true;

     TweenMax.to(this, Math.min(1.25, Math.max(0.4, dist / 40)), {
       x: nx,
       y: ny,
       ease: ease,
       onComplete: function onComplete() {
         _this.resetting = false;
         if (callback) {
           callback();
         }
       }
     });
   } else if (callback) {
     callback();
   }
 };

 Point.prototype.randomize = function randomize(callback) {
   var nx = this.x + (Math.random() * 60 - 30);
   var ny = this.y + (Math.random() * 60 - 30);

   this.animateTo(nx, ny, null, callback ? callback : null);
 };

 Point.prototype.reset = function reset() {
   this.animateTo(this.origX, this.origY, true);
 };

 Point.prototype.update = function update(delta) {

   var dx = undefined;
   var dy = undefined;

   if (!this.resetting && mouse.down) {
     dx = this.x - mouse.x + mesh.x;
     dy = this.y - mouse.y + mesh.y;
     var dist = Math.sqrt(dx * dx + dy * dy);

     if (dist < opts.brushSize) {
       this.x = this.x + (mouse.x - mouse.px) * Math.abs(Math.cos(twoPi * dx / dist));
       this.y = this.y + (mouse.y - mouse.py) * Math.abs(Math.cos(twoPi * dy / dist));
     }
   }

   return this;
 };

 return Point;
}();

/*////////////////////////////////////////*/

var count = 0;

var Cloth = function () {
 function Cloth(clothX, clothY, free) {
   _classCallCheck(this, Cloth);

   this.points = [];

   var startX = 0; //renderer.view.width / 2 - clothX * spacingX / 2;
   var startY = 0; //renderer.view.height * 0.1;

   for (var y = 0; y <= clothY; y++) {
     for (var x = 0; x <= clothX; x++) {
       var point = new Point(startX + x * spacingX, startY + y * spacingY);

       this.points.push(point);
     }
   }
 }

 Cloth.prototype.randomize = function randomize(callback) {
   this.points.forEach(function (point, i) {
     point.randomize(i === 0 ? callback : null);
   });
 };

 Cloth.prototype.reset = function reset() {
   this.points.forEach(function (point) {
     point.reset();
   });
 };

 Cloth.prototype.update = function update(delta) {

   this.points.forEach(function (point, i) {
     point.update(delta * delta);

     if (mesh) {
       i *= 2;
       mesh.vertices[i] = point.x;
       mesh.vertices[i + 1] = point.y;
     }
   });
 };

 return Cloth;
}();

function pointerMove(e) {
 var pointer = e.touches ? e.touches[0] : e;
 mouse.px = mouse.x || pointer.clientX;
 mouse.py = mouse.y || pointer.clientY;
 mouse.x = pointer.clientX;
 mouse.y = pointer.clientY;
}

function pointerDown(e) {
 mouse.down = true;
 mouse.button = 1;
 pointerMove(e);
}

function pointerUp(e) {
 mouse.down = false;
 mouse.px = null;
 mouse.py = null;
}

renderer.view.addEventListener('mousedown', pointerDown);
renderer.view.addEventListener('touchstart', pointerDown);

document.body.addEventListener('mousemove', pointerMove);
document.body.addEventListener('touchmove', pointerMove);

document.body.addEventListener('mouseup', pointerUp);
document.body.addEventListener('touchend', pointerUp);
document.body.addEventListener('mouseleave', pointerUp);