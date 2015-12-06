'use strict';





/*------------------ 2D движок --------------------*/
var j2ds = {
 vector : {},
 math : {},
 dom : {},
 now : 0,
 dt : 0,
 stopAll : 0,
 frameLimit : 60,
 sceneStartTime : 0,
 sceneSkipTime : 0,
 engine : false,
 ready : false,
 window : window,

 getInfo : false, // Определена
 getScene : function () { return j2ds.scene; },
 getDevice : false, // Jпределена
 getLayers : function () { return j2ds.layers; },
 getTextureManager : function () { return j2ds.scene.texture; },
 getIO : function () { return j2ds.input; },
 getDOM : function () { return j2ds.dom; }
};


j2ds.getInfo = function () {
	return {
	 'name' : 'j2Ds',
	 'version' : '0.3.0',
	 'site' : 'https://github.com/SkanerSoft/J2ds',
	 'info' : 'j2Ds - HTML5 2D Game Engine',
	 'author' : 'Skaner'
	};
};




/*----------- DOM ---------------*/
j2ds.dom.id = function (_id) {
 return document.getElementById(_id);
};

j2ds.dom.name = function (_id) {
 return document.getElementsByName(_id);
};

j2ds.dom.tag = function (_id) {
 return document.getElementsByTagName(_id);
};

j2ds.dom.goURL = function (_url) {
	document.location.href = _url;
};

j2ds.dom.reloadURL = function () {
	document.location.href = document.location.href;
};





/*------------------- Математика --------------*/
j2ds.vector.vec2df = function (_x, _y) {
 return {x: _x, y: _y};
};

j2ds.vector.vec2di = function (_x, _y) {
 return { x: (_x >> 0), y: (_y >> 0) };
};

j2ds.math.toInt = function (_number) {
	return _number >> 0;
};

j2ds.math.rndColor = function (_min, _max, _alpha) {
 return 'rgba('+j2ds.math.random(_min, _max)+', '+j2ds.math.random(_min, _max)+', '+j2ds.math.random(_min, _max)+', '+_alpha+')';
};

j2ds.math.random = function (_min, _max, _omitZero) {
 var rnd = (Math.floor(Math.random() * (_max - _min + 1) + _min));
 return (_omitZero && rnd == 0) ? j2ds.math.random(_min, _max, _omitZero) : rnd;
};

j2ds.math.rad = function (_num) {
 return _num * (Math.PI / 180);
};

/* функции */
j2ds.setWindow = function (_window) {
	j2ds.window = _window ? _window : window;
};

j2ds.getDevice = function() {
	var o = {};
	o.width = (parseInt(document.documentElement.clientWidth) < parseInt(screen.width))   ? parseInt(document.documentElement.clientWidth):parseInt(screen.width);
	o.height = (parseInt(document.documentElement.clientHeight) < parseInt(screen.height)) ? parseInt(document.documentElement.clientHeight) : parseInt(screen.height);
	return o;
};

j2ds.start = function(_engine, _frameLimit) {
 j2ds.engine = _engine || function() { document.body.innerHTML = 'Пожалуйста, инициализируйте игровую функцию!'; };
 j2ds.frameLimit = _frameLimit || 60;
 j2ds.sceneSkipTime = 1000.0 / j2ds.frameLimit;
 j2ds.lastTime = Date.now();
 j2ds.dt = 0;
 j2ds.sceneStartTime = j2ds.lastTime;
 j2ds.gameEngine();
};

j2ds.setActiveEngine = function(_engine) {
	j2ds.engine = _engine;
};

j2ds.gameEngine = function() {
 j2ds.now = Date.now();
 setTimeout(function () {
  if (!j2ds.stopAll) {
   j2ds.input.upd();
   j2ds.dt = (j2ds.now - j2ds.lastTime) / 100.0;
   if (j2ds.dt > j2ds.sceneSkipTime/2) {
    j2ds.dt = 0;
   }
   j2ds.sceneStartTime = j2ds.now;
   j2ds.engine();
   j2ds.lastTime = j2ds.now;
   j2ds.input.keyPress = [];
   j2ds.input.keyUp = [];
   j2ds.input.mousePress = [];
   j2ds.input.mouseUp = [];
   j2ds.input.mouseWheel = 0;
   nextJ2dsGameStep(j2ds.gameEngine);   
  }
 }, (j2ds.frameLimit < 60 ? j2ds.sceneSkipTime : 0));
};

var nextJ2dsGameStep = (function() {
 return window.requestAnimationFrame ||
 window.webkitRequestAnimationFrame  ||
 window.mozRequestAnimationFrame     ||
 window.oRequestAnimationFrame       ||
 window.msRequestAnimationFrame      ||
 function (callback) {
  window.setTimeout(callback, 1000 / j2ds.frameLimit);
 };
})();













/*----------------- INPUT -------------------*/
j2ds.input = {
 /* Переменные */
 pos : {x:0, y:0},
 x : 0,
 y : 0,
 abs : {x : 0, y : 0},
 keyDown : [],
 keyPress : [],
 keyPressed : [],
 keyUp : [],
 keyUped : false,
 mouseDown : [],
 mousePress : [],
 mousePressed : [],
 mouseUp : [],
 mouseUpped : false,
 mouseWheel : 0,
 canceled : false,
 body : false,
 anyKey : false,
 anyMouse : false,
 writeMode : false,
 displayCursor : '',
 visible : true
};

// Константы клавиш

j2ds.input.mKey = {
 'LEFT' : 1,
 'MIDDLE' : 2,
 'RIGHT' : 3
};

j2ds.input.jKey = {
 'LEFT'      : 37,
 'RIGHT'     : 39,
 'UP'        : 38,
 'DOWN'      : 40,
 'SPACE'     : 32,
 'CTRL'      : 17,
 'SHIFT'     : 16,
 'ALT'       : 18,
 'ESC'       : 27,
 'ENTER'     : 13,
 'MINUS'     : 189,
 'PLUS'      : 187,
 'CAPS_LOCK' : 20,
 'BACKSPACE' : 8,
 'TAB'       : 9,
 'Q'         : 81,
 'W'         : 87,
 'E'         : 69,
 'R'         : 82,
 'T'         : 84,
 'Y'         : 89,
 'U'         : 85,
 'I'         : 73,
 'O'         : 79,
 'P'         : 80,
 'A'         : 65,
 'S'         : 83,
 'D'         : 68,
 'F'         : 70,
 'G'         : 71,
 'H'         : 72,
 'J'         : 74,
 'K'         : 75,
 'L'         : 76,
 'Z'         : 90,
 'X'         : 88,
 'V'         : 86,
 'B'         : 66,
 'N'         : 78,
 'M'         : 77,
 '0'         : 48,
 '1'         : 49,
 '2'         : 50,
 '3'         : 51,
 '4'         : 52,
 '5'         : 53,
 '6'         : 54,
 '7'         : 55,
 '8'         : 56,
 'C'         : 67,
 '9'         : 57,
 'NUM_0'     : 45,
 'NUM_1'     : 35,
 'NUM_2'     : 40,
 'NUM_3'     : 34,
 'NUM_4'     : 37,
 'NUM_5'     : 12,
 'NUM_6'     : 39,
 'NUM_7'     : 36,
 'NUM_8'     : 38,
 'NUM_9'     : 33,
 'NUM_MINUS' : 109,
 'NUM_PLUS'  : 107,
 'NUM_LOCK'  : 144,
 'F1'        : 112,
 'F2'        : 113,
 'F3'        : 114,
 'F4'        : 115,
 'F5'        : 116,
 'F6'        : 117,
 'F7'        : 118,
 'F8'        : 119,
 'F9'        : 120,
 'F10'       : 121,
 'F11'       : 122,
 'F12'       : 123
};

j2ds.input.keyList = function () {
 var o = [];
	for (var i in j2ds.input.jKey) {
  o.push(i);
	}
	return o;
};

j2ds.input.isKeyDown = function(_code) {
 return this.keyDown[this.jKey[_code]];
};

j2ds.input.isKeyPress = function(_code) {
 return this.keyPress[this.jKey[_code]];
};

j2ds.input.isKeyUp = function(_code) {
return this.keyUp[this.jKey[_code]];
};

j2ds.input.getPosition = function() {
return j2ds.vector.vec2df(this.pos.x, this.pos.y);
};

j2ds.input.setWriteMode = function (_true) {
 j2ds.input.writeMode = _true;
};

j2ds.input.isWriteMode = function () {
 return j2ds.input.writeMode;
};

j2ds.input.keyEvent = function(e) {
 if (e.type == 'keydown') {
  if (!j2ds.input.keyPressed[e.keyCode]) {
   j2ds.input.keyPress[e.keyCode] = true;
   j2ds.input.keyPressed[e.keyCode] = true;
  }
  if (!j2ds.input.writeMode) {
   e.preventDefault();
  } else {
  	j2ds.onEvent('writeMode:keyPress', '');
  }
 } else if (e.type == 'keyup') {
  if (j2ds.input.keyPressed[e.keyCode]) {
   j2ds.input.keyPress[e.keyCode] = false;
   j2ds.input.keyPressed[e.keyCode] = false;
   j2ds.input.keyUp[e.keyCode] = true;
   j2ds.input.keyUped = true;
   e.preventDefault();
  }
 } else if (e.type == 'keypress' && (j2ds.input.writeMode)) {
  var _char = '';
  if (e.which != 0 && e.charCode != 0) {
   if (e.which >= 32) {
    _char = String.fromCharCode(e.which);
   }
  }
  j2ds.onEvent('writeMode:keyPress', _char);
 }

 j2ds.input.keyDown[e.keyCode] = (e.type== 'keydown')&&(!j2ds.input.canceled);
 j2ds.input.anyKey = e.keyCode;
 return false;
};

j2ds.input.cancel = function(_id) {
 if (!_id) {
  j2ds.input.canceled = true;
  j2ds.input.keyDown = [];
  j2ds.input.mouseDown = [];
 }
 else {
  j2ds.input.keyDown[j2ds.input.jKey[_id]] = false;
 }
};

j2ds.input.onNode = function(_id) {
 if (!_id.layer.visible) return false;
 return (this.pos.x > _id.pos.x && this.pos.x < _id.pos.x+_id.size.x) &&
        (this.pos.y > _id.pos.y && this.pos.y < _id.pos.y+_id.size.y);
};

j2ds.input.upd = function() {
 var dX = j2ds.scene.canvas.offsetWidth / j2ds.scene.width;
 var dY = j2ds.scene.canvas.offsetHeight / j2ds.scene.height;
 this.x = (this.abs.x/dX);
 this.y = (this.abs.y/dY);
 this.pos.x = j2ds.scene.view.x + this.x;
 this.pos.y = j2ds.scene.view.y + this.y;
};

j2ds.input.onMove = function(e) {
 j2ds.input.abs.x = e.pageX;
 j2ds.input.abs.y = e.pageY;
};

j2ds.input.isMouseDown = function(_code) {
 return this.mouseDown[this.mKey[_code]];
};

j2ds.input.isMousePress = function(_code) {
 return this.mousePress[this.mKey[_code]];
};

j2ds.input.isMouseUp = function(_code) {
 return this.mouseUp[this.mKey[_code]];
};

j2ds.input.isMouseWheel = function(_code) {
 return (_code == 'UP' && this.mouseWheel > 0) ||
        (_code == 'DOWN' && this.mouseWheel < 0)
};

j2ds.input.onMouseWheel = function (e) {
	this.mouseWheel = ((e.wheelDelta) ? e.wheelDelta : -e.detail);
	e.preventDefault();
	return false;
};

j2ds.input.onMouseEvent = function(e) {
 if (!e.which && e.button) {
  if (e.button & 1) e.which = 1;
  else if (e.button & 4) e.which = 2;
       else if (e.button & 2) e.which = 3;
 }

 if (e.type == 'mousedown') {
  if (!j2ds.input.mousePressed[e.which]) {
   j2ds.input.mousePress[e.which] = true;
   j2ds.input.mousePressed[e.which] = true;
  }
 } else if (e.type == 'mouseup') {
  if (j2ds.input.mousePressed[e.which]) {
   j2ds.input.mousePress[e.which] = false;
   j2ds.input.mousePressed[e.which] = false;
   j2ds.input.mouseUp[e.which] = true;
   j2ds.input.mouseUped = true;
  }
 }

 j2ds.input.mouseDown[e.which] = (e.type == 'mousedown') && (!j2ds.input.canceled);

 j2ds.window.focus();
 e.preventDefault();
 return false;
};

j2ds.input.setCursorImage = function (_curImg) {
	j2ds.dom.tag('body')[0].style.cursor = 'url("'+_curImg+'"), auto';
};

j2ds.input.setVisible = function (_true) {
 j2ds.input.visible = _true;
 if (!_true) {
  j2ds.input.displayCursor = j2ds.dom.tag('body')[0].style.cursor;
  j2ds.dom.tag('body')[0].style.cursor = 'none';
 } else {
  j2ds.dom.tag('body')[0].style.cursor = j2ds.input.displayCursor;
 }
};

j2ds.input.isVisible = function () {
	return j2ds.input.visible;
};

j2ds.input.init = function() {
 j2ds.window.focus();
 j2ds.window.oncontextmenu = function() { return false; };
 j2ds.window.onselectstart = j2ds.window.oncontextmenu;
 j2ds.window.ondragstart = j2ds.window.oncontextmenu;
 j2ds.window.onmousedown = j2ds.input.onMouseEvent;
 j2ds.window.onmouseup = function(e) { j2ds.input.canceled = false; j2ds.input.onMouseEvent(e); };
 j2ds.window.onmousemove = function(e) { j2ds.input.onMove(e); };
 j2ds.window.onkeydown = function(e) { j2ds.input.keyEvent(e); };
 j2ds.window.onkeyup = function(e) { j2ds.input.canceled = false; j2ds.input.keyEvent(e); };
 j2ds.window.onkeypress = function(e) { j2ds.input.keyEvent(e); };
 j2ds.window.onmousewheel = function(e) { j2ds.input.onMouseWheel(e); };

 if (j2ds.window.addEventListener) {
  j2ds.window.addEventListener("DOMMouseScroll", function(e) {
  	j2ds.input.onMouseWheel(e);
  }, false);
 }

 j2ds.window.onblur = function () {
  if (j2ds.stopAll == 0) {
   j2ds.stopAll = 1;
   j2ds.onEvent('scene:deactivate');
  }
 };

 j2ds.window.onfocus = function () {
  if (j2ds.stopAll == 1) {
   j2ds.stopAll = 0;
   nextJ2dsGameStep(j2ds.gameEngine);
   j2ds.onEvent('scene:activate');
   j2ds.input.cancel();
  }
 };


};







/*--------------- События ----------------*/
j2ds.events = {
 'scene:deactivate' : [],
 'scene:activate' : [],

 'scene:beforeInit' : [],
 'scene:afterInit' : [],
 'scene:beforeStart' : [],
 'scene:afterStart' : [],

 'scene:changedGameState' : [],

 'writeMode:keyPress' : [],

 'dom:loaded' : []
};


j2ds.on = function (_event, _func) {
	j2ds.events[_event].push(_func);
};

j2ds.onEvent = function (_eventType, _args) {
 for (var i = 0, len = j2ds.events[_eventType].length; i < len; i+=1) {
  if (j2ds.events[_eventType]) {
   j2ds.events[_eventType][i](_args || '');
  }
 }
};





/*---------------- слои -------------------*/

j2ds.layers = {};
j2ds.layers.list = {};

j2ds.layers.layer = function (_id) {
	return j2ds.layers.list[_id];
};

j2ds.layers.add = function (_id, _index) {

 if (j2ds.layers.list[_id]) {
  return false;
 }

	var o = {};
	o.layerName = _id;
	o.canvas = document.createElement('canvas');
	o.canvas.width = j2ds.scene.width;
	o.canvas.height = j2ds.scene.height;
	o.width = j2ds.scene.width;
	o.height = j2ds.scene.height;
	o.context = o.canvas.getContext('2d');
	o.context.shadowColor = 'rgba(0,0,0,0)';
 o.canvas.style.zIndex = 1000+_index;
 o.canvas.style.position = 'fixed';
 o.canvas.style.left = '0';
 o.canvas.style.top = '0';
 o.canvas.id = _id;
 o.alpha = 1;
 o.angle = 0;
 o.visible = 1;

 o.onContext = function (_func) {
 	_func(this.context);
 };

 o.fill = function (_color) {
 	this.context.fillStyle = _color;
 	this.context.fillRect(0, 0, this.width, this.height);
 };

 o.setAlpha = function (_alpha) {
  this.canvas.style.opacity = _alpha;
  this.alpha = _alpha;
 };

 o.getAlpha = function () {
  return this.alpha;
 };

 o.setVisible = function (_visible) {
 	if (_visible) {
 	 this.canvas.style.display = 'block';
 	 this.visible = true;
  } else {
  	this.canvas.style.display = 'none';
  	this.visible = false;
  }
 };

 o.isVisible = function () {
 	return this.visible;
 };

 o.setIndex = function (_index) {
 	this.canvas.style.zIndex = 1000+_index;
 };

 o.clear = function () {
 	this.context.clearRect(0, 0, this.width, this.height);
 };

 o.clearNode = function (_node) {
 	if (_node.isLookScene()) {
   this.context.clearRect(_node.pos.x-j2ds.scene.view.x, _node.pos.y-j2ds.scene.view.y, _node.size.x, _node.size.y);
 	}
 };

 o.clearRect = function (_pos, _size) {
  this.context.clearRect(_pos.x-j2ds.scene.view.x, _pos.y-j2ds.scene.view.y, _size.x, _size.y);
 };

	j2ds.layers.list[_id] = o;
	if (j2ds.ready) {
	 document.body.appendChild(j2ds.layers.list[_id].canvas);
	}

 return o;
};



/*----------------- сцена ---------------------*/

j2ds.scene = {
 layerName : 'sceneNode',
 layers : j2ds.layers
};


/*функции*/

j2ds.scene.setGameState = function(_engine) {
 j2ds.setActiveEngine(_engine);
 j2ds.onEvent('scene:changedGameState');
};

j2ds.scene.start = function (_engine, _frameLimit) {
 j2ds.input.init();
 j2ds.onEvent('scene:beforeStart');
 j2ds.start(_engine, _frameLimit);
 j2ds.onEvent('scene:afterStart');
};

j2ds.scene.fullScreen = function(_true) {
 var layer;
 var tmpCanvas = document.createElement('canvas'); // Нужны для копирования содержимого
 var tmpContext = tmpCanvas.getContext('2d');      // При изменении размера
 if (_true) {
  j2ds.scene.origWidth = j2ds.scene.width;
  j2ds.scene.origHeight = j2ds.scene.height;
  j2ds.scene.width = j2ds.getDevice().width;
  j2ds.scene.height = j2ds.getDevice().height;
  for (var i in j2ds.layers.list)
  {
   layer = j2ds.layers.list[i];
   tmpCanvas.width = layer.width;
   tmpCanvas.height = layer.height;
   tmpContext.drawImage(layer.canvas, 0, 0);
   layer.canvas.width = j2ds.scene.width;
   layer.canvas.height = j2ds.scene.height;
   layer.width = j2ds.scene.width;
   layer.height = j2ds.scene.height;
   layer.context.drawImage(tmpCanvas, 0, 0, layer.width, layer.height);
  }
 } else {
  j2ds.scene.width = j2ds.scene.origWidth;
  j2ds.scene.height = j2ds.scene.origHeight;
  for (var i in j2ds.layers.list)
  {
   layer = j2ds.layers.list[i];
   layer.width = j2ds.scene.origWidth;
   layer.height = j2ds.scene.origHeight;
   layer.canvas.width = j2ds.scene.origWidth;
   layer.canvas.height = j2ds.scene.origHeight;
  }
 }
};

j2ds.scene.fullScale = function(_true) {
 var layer;
 if (_true) {
  for (var i in j2ds.layers.list)
  {
   layer = j2ds.layers.list[i].canvas;
   layer.style.width = j2ds.getDevice().width+'px';
   layer.style.height = j2ds.getDevice().height+'px';
  }
 } else {
  for (var i in j2ds.layers.list)
  {
   layer = j2ds.layers.list[i].canvas;
   layer.style.width = j2ds.scene.width+'px';
   layer.style.height = j2ds.scene.height+'px';
  }
 }
};

// Устанавливает позицию для камеры
j2ds.scene.setViewPosition = function(_pos) {
	j2ds.scene.view.x = _pos.x - Math.ceil(j2ds.scene.width/2);
	j2ds.scene.view.y = _pos.y - Math.ceil(j2ds.scene.height/2);
};

//! Движение "камеры" вслед за объектом
j2ds.scene.setViewFocus = function(_id, _d) {
	j2ds.scene.view.x = _id.getPosition().x - Math.ceil(j2ds.scene.width/2)+(_d ? _d.x : 0);
	j2ds.scene.view.y = _id.getPosition().y - Math.ceil(j2ds.scene.height/2)+(_d ? _d.y : 0);
};

//! Движение "камеры"
j2ds.scene.viewMove = function(_pos) {
	j2ds.scene.view.x+=_pos.x;
	j2ds.scene.view.y+=_pos.y;
};

//! Очистка отрисованного предыдущего кадра сцены
j2ds.scene.clear = function() {
 j2ds.scene.getLayer().clear();
};

j2ds.scene.getLayer = function () {
	return j2ds.layers.layer('sceneNode');
};

// инициализация сцены
j2ds.scene.init = function(_w, _h) {

 j2ds.onEvent('scene:beforeInit');

	j2ds.scene.width = _w;
	j2ds.scene.height = _h;

	j2ds.scene.origWidth = _w;
	j2ds.scene.origHeight = _h;

 j2ds.layers.add('sceneNode', 0);

 j2ds.scene.context = j2ds.layers.layer('sceneNode').context;
 j2ds.scene.canvas = j2ds.layers.layer('sceneNode').canvas; 
 j2ds.scene.visible = true;

 j2ds.scene.cancelClear = false;

 /* Вид "камеры" */
 j2ds.scene.view = j2ds.vector.vec2df(0,0);

 j2ds.onEvent('scene:afterInit');

 j2ds.window.onload = function () {
 	for (var i in j2ds.layers.list) {
   document.body.appendChild(j2ds.layers.layer(i).canvas);
  }
  j2ds.ready = true;
  j2ds.onEvent('dom:loaded');
 };
};




/*--------------- Объекты ----------------*/
j2ds.Obj= {
 inherit : function (_parent, _child) {
  _child.prototype = Object.create(_parent.prototype);
  _child.prototype.constructor = _child;
 }
};



/*------------------ базовый объект -------------------*/

j2ds.scene.addBaseNode= function (_pos, _size) {
	return new j2ds.scene.BaseNode(_pos, _size);
};

j2ds.scene.BaseNode = function(_pos, _size) {
  this.visible  = true;
  this.alpha    = 1;
  this.pos      = _pos;
  this.size     = _size;
  this.parent   = false;
  this.angle    = 0;
  this.layer    = j2ds.scene;
 	this.box      = {
	                  offset : {x : 0, y : 0},
	                  size : {x : 0, y : 0}
	                 };
};

j2ds.scene.BaseNode.prototype.resizeBox = function (_offset, _size) {
	this.box.offset = _offset;
	this.box.size = _size;
};

j2ds.scene.BaseNode.prototype.setLayer = function (_layer) {
	this.layer = _layer ? j2ds.layers.layer(_layer) : j2ds.scene;
};

j2ds.scene.BaseNode.prototype.getLayer = function () {
	return this.layer;
};

j2ds.scene.BaseNode.prototype.setVisible = function(_visible) {
 this.visible = _visible;
};

j2ds.scene.BaseNode.prototype.isVisible = function() {
 return this.visible;
};

j2ds.scene.BaseNode.prototype.setAlpha = function(_alpha) {
 if (_alpha < 0) _alpha = 0;
 if (_alpha > 1) _alpha = 1;
 this.alpha = _alpha;
};

j2ds.scene.BaseNode.prototype.getAlpha = function(_alpha) {
 return this.alpha;
};

j2ds.scene.BaseNode.prototype.moveTo = function(_to, _t) {
 _t = _t?_t:1;
 this.move(j2ds.vector.vec2df(
 ((_to.x - this.getPosition().x) / _t),
 ((_to.y - this.getPosition().y) / _t)
 ));
};

j2ds.scene.BaseNode.prototype.setPosition = function(_pos) {
 if (_pos) {
  this.pos = j2ds.vector.vec2df(_pos.x-Math.ceil(this.size.x/2), _pos.y-Math.ceil(this.size.y/2) );
 } else {
  return this.pos;
 }
};

j2ds.scene.BaseNode.prototype.move = function(_pos) {
  this.pos.x+= _pos.x;
  this.pos.y+= _pos.y;
};

j2ds.scene.BaseNode.prototype.getPosition = function() {
 return j2ds.vector.vec2df(this.pos.x+Math.ceil(this.size.x/2), this.pos.y+Math.ceil(this.size.y/2));
};

j2ds.scene.BaseNode.prototype.setSize = function(_size) {
 if (_size) {
  this.size = _size;
 } else {
 	return this.size;
 }
};

j2ds.scene.BaseNode.prototype.getSize = function() {
 return this.size;
};

j2ds.scene.BaseNode.prototype.setParent = function(_id) {
	this.parent = _id;
};

j2ds.scene.BaseNode.prototype.getDistance = function(_id) {
	return Math.ceil( Math.sqrt(
	  Math.pow(_id.getPosition().x - this.getPosition().x, 2)+
	  Math.pow(_id.getPosition().y - this.getPosition().y, 2)
	                  )
	       );
};

j2ds.scene.BaseNode.prototype.getDistanceXY = function(_id) {
	return j2ds.vector.vec2df(Math.abs(_id.getPosition().x-this.getPosition().x), Math.abs(_id.getPosition().y-this.getPosition().y));
};

j2ds.scene.BaseNode.prototype.isIntersect = function(_id) {
 var pos = {
  x1 : this.pos.x+this.box.offset.x,
  x2 : _id.pos.x+_id.box.offset.x,
  y1 : this.pos.y+this.box.offset.y,
  y2 : _id.pos.y+_id.box.offset.y
 };

 var size = {
  x1 : this.size.x+this.box.size.x,
  x2 : _id.size.x+_id.box.size.x,
  y1 : this.size.y+this.box.size.y,
  y2 : _id.size.y+_id.box.size.y
 };

return (
        (pos.y1+size.y1 >= pos.y2) &&
        (pos.x1+size.x1 >= pos.x2)
       ) && (
        (pos.x1 < pos.x2+size.x2) &&
        (pos.y1 < pos.y2+size.y2)
       );
};

j2ds.scene.BaseNode.prototype.isCollision = function(_id) {
var result = false;
 if (
 (this.getDistanceXY(_id).x < (this.size.x/2 + _id.size.x/2)) &&
 (this.getDistanceXY(_id).y < (this.size.y/2 + _id.size.y/2))
 ) {
    result = true;
   }
 return result;
};

j2ds.scene.BaseNode.prototype.isLookScene = function() {
	var yes = true;
	if ((this.pos.x > j2ds.scene.view.x+j2ds.scene.width ||
	     this.pos.x+this.size.x < j2ds.scene.view.x) ||
	  (this.pos.y > j2ds.scene.view.y+j2ds.scene.height ||
	   this.pos.y+this.size.y < j2ds.scene.view.y)) {
	    yes = false;
	   }
	return yes;
};

j2ds.scene.BaseNode.prototype.turn = function(_angle) {
	this.angle = (this.angle % 360);
	this.angle+= _angle;
};

j2ds.scene.BaseNode.prototype.setRotation = function(_angle) {
	this.angle = _angle % 360;
};

j2ds.scene.BaseNode.prototype.getRotation = function(_angle) {
	return this.angle;
};

j2ds.scene.BaseNode.prototype.isOutScene = function() {
	var o = {};

	if (this.pos.x+this.size.x >= j2ds.scene.view.x+j2ds.scene.width) o.x = 1;
	else	if (this.pos.x <= j2ds.scene.view.x) {o.x = -1; }
	     else { o.x = 0; }

	if (this.pos.y+this.size.y >= j2ds.scene.view.y+j2ds.scene.height) o.y = 1;
	else	if (this.pos.y <= j2ds.scene.view.y) { o.y = -1; }
	     else { o.y = 0; }

	o.all = (o.x || o.y);

	return o;
};

j2ds.scene.BaseNode.prototype.moveDir = function(_speed) {
 this.pos.x+= _speed*(Math.cos(j2ds.math.rad(this.angle)));
 this.pos.y+= _speed*(Math.sin(j2ds.math.rad(this.angle)));
};

j2ds.scene.BaseNode.prototype.drawBox = function() {
 var context = this.layer.context;
 context.lineWidth = 2;
 context.strokeStyle = 'black';

 context.beginPath();
 context.rect(
 this.pos.x-j2ds.scene.view.x,
 this.pos.y-j2ds.scene.view.y,
 this.size.x, this.size.y);
 context.stroke();

 context.strokeStyle = 'yellow';

 context.beginPath();
 context.rect(this.box.offset.x+this.pos.x-j2ds.scene.view.x, this.box.offset.y+this.pos.y-j2ds.scene.view.y,
              this.box.size.x+this.size.x, this.box.size.y+this.size.y);
 context.stroke();
};







/*------------------ текст --------------------*/


j2ds.scene.addTextNode = function (_pos, _text, _sizePx, _color, _family, _width, _colorL) {
	return new j2ds.scene.TextNode(_pos, _text, _sizePx, _color, _family, _width, _colorL);
};

j2ds.scene.TextNode = function(_pos, _text, _sizePx, _color, _family, _width, _colorL) {

 j2ds.scene.BaseNode.call(this, _pos, j2ds.vector.vec2df(0, 0));

 /*Свойства*/

 this.vAlign = 'top';
 this.hAlign = 'left';
 this.color = _color ? _color : 'black';

 this.family = _family ? _family : 'serif';
 this.sizePx = _sizePx ? _sizePx : 20;

 this.box.offset.y = j2ds.math.toInt(this.sizePx*0.26);
 this.box.size.y = -j2ds.math.toInt(this.sizePx*0.26); 

 this.lineWidth = _width ? _width : 0;
 this.colorL = _colorL ? _colorL : 'black';

 this.font = this.sizePx+'px '+ this.family;

 this.fullText = _text;
 this.maxWidth = 0;
 this.lines = _text.split("\n");

 j2ds.scene.context.font = this.font;

 for (var i = 0, len = this.lines.length; i < len; i += 1) {
  this.maxWidth = (this.maxWidth < j2ds.scene.context.measureText(this.lines[i]).width ?
                                   j2ds.scene.context.measureText(this.lines[i]).width :
                                   this.maxWidth);
 }

 this.size.x = this.maxWidth;
 this.size.y = this.lines.length * this.sizePx;
};

j2ds.Obj.inherit(j2ds.scene.BaseNode, j2ds.scene.TextNode);

j2ds.scene.TextNode.prototype.setSize = function (_sizePx) {
 this.sizePx = _sizePx;
 this.font = this.sizePx+'px '+ this.family;
 j2ds.scene.context.font = this.font;

 this.box.offset.y = j2ds.math.toInt(this.sizePx*0.26);
 this.box.size.y = -j2ds.math.toInt(this.sizePx*0.26); 

 for (var i = 0, len = this.lines.length; i < len; i += 1) {
  this.maxWidth = (this.maxWidth < j2ds.scene.context.measureText(this.lines[i]).width ?
                                   j2ds.scene.context.measureText(this.lines[i]).width :
                                   this.maxWidth);
 }
 this.size.x = this.maxWidth;
 this.size.y = this.lines.length * this.sizePx;
};

j2ds.scene.TextNode.prototype.getSize = function () {
	return this.sizePx;
};

j2ds.scene.TextNode.prototype.drawSimpleText = function (_text, _pos, _color, _colorL) {
 var context = this.layer.context;
 context.fillStyle = _color ? _color : this.color;
 context.textAlign = this.hAlign;
 context.textBaseline = this.vAlign;
 context.font = this.font;
 context.lineWidth = this.lineWidth;
 context.strokeStyle = _colorL ? _colorL : this.colorL;

 var lines = _text.split("\n");

 var pos = _pos ? _pos : this.pos;

 for (var i = 0, len = lines.length; i < len; i += 1) {
   if (this.lineWidth) {
    context.strokeText(lines[i], pos.x, pos.y+this.sizePx*i);
   }
  context.fillText(lines[i], pos.x, pos.y+this.sizePx*i);
 }
 context.lineWidth = 0;
 context.strokeStyle = 'black';
};

j2ds.scene.TextNode.prototype.getText = function () {
	return this.fullText;
};

j2ds.scene.TextNode.prototype.setText = function (_text) {
 this.fullText = _text;
 this.maxWidth = 0;
 this.lines = _text.split("\n");

 j2ds.scene.context.font = this.font;

 this.box.offset.y = j2ds.math.toInt(this.sizePx*0.26);
 this.box.size.y = -j2ds.math.toInt(this.sizePx*0.26); 

 for (var i = 0, len = this.lines.length; i < len; i += 1) {
  this.maxWidth = (this.maxWidth < j2ds.scene.context.measureText(this.lines[i]).width ?
                                   j2ds.scene.context.measureText(this.lines[i]).width :
                                   this.maxWidth);
 }
 this.size.x = this.maxWidth;
 this.size.y = this.lines.length * this.sizePx;
};

j2ds.scene.TextNode.prototype.draw = function() {
 var context = this.layer.context;
 if (this.visible && this.isLookScene()) {
  if (this.alpha != 1) {
   var tmpAlpha = context.globalAlpha;
   context.globalAlpha = this.alpha;
  }

  if (this.angle)
  {
   context.save();
   context.translate(this.getPosition().x-j2ds.scene.view.x, this.getPosition().y-j2ds.scene.view.y);
   context.rotate(j2ds.math.rad(this.angle));
   context.translate(-(this.getPosition().x-j2ds.scene.view.x), -(this.getPosition().y-j2ds.scene.view.y));
  }

  context.fillStyle = this.color;
  context.textAlign = this.hAlign;
  context.textBaseline = this.vAlign;
  context.font = this.font;
  context.lineWidth = this.lineWidth;
  context.strokeStyle = this.colorL;

  for (var i = 0, len = this.lines.length; i < len; i += 1) {
   if (this.lineWidth) {
    context.strokeText(this.lines[i], this.pos.x, this.pos.y+this.sizePx*i);
   }
   context.fillText(this.lines[i], this.pos.x, this.pos.y+this.sizePx*i);
  }

  context.lineWidth = 0;
  context.strokeStyle = 'black';

  if (this.angle) { context.restore(); }

  if (this.alpha != 1) {
   context.globalAlpha = tmpAlpha;
  }
 }
};









/*------------------ окружность --------------------*/

j2ds.scene.addCircleNode = function (_pos, _radius, _color) {
	return new j2ds.scene.CircleNode(_pos, _radius, _color);
};

j2ds.scene.CircleNode = function(_pos, _radius, _color) {

 j2ds.scene.BaseNode.call(this, _pos, j2ds.vector.vec2df(_radius*2, _radius*2));

 /*Свойства*/
 this.color = _color;
 this.radius = _radius;
};

j2ds.Obj.inherit(j2ds.scene.BaseNode, j2ds.scene.CircleNode);

j2ds.scene.CircleNode.prototype.draw = function() {
 var context = this.layer.context;
 if (this.visible && this.isLookScene()) {
  if (this.alpha != 1) {
   var tmpAlpha = context.globalAlpha;
   context.globalAlpha = this.alpha;
  }
  context.lineWidth = 0;
  context.fillStyle = this.color;

  context.beginPath();
  context.arc(this.pos.x-j2ds.scene.view.x+this.radius,
  this.pos.y-j2ds.scene.view.y+this.radius,
  this.radius, 0, 2*Math.PI,true);
  context.stroke();
  context.fill();

  if (this.alpha != 1) {
   context.globalAlpha = tmpAlpha;
  }
 }
};









/*-------------------- линии ----------------------*/

j2ds.scene.addLineNode = function (_pos, _points, _scale, _color, _width, _fill, _cFill) {
	return new j2ds.scene.LineNode(_pos, _points, _scale, _color, _width, _fill, _cFill);
};

j2ds.scene.LineNode = function(_pos, _points, _scale, _color, _width, _fill, _cFill) {

 j2ds.scene.BaseNode.call(this, _pos, j2ds.vector.vec2df(0,0))

 /*Свойства*/
 this.color = _color;
 this.points = _points;
 this.fill = _fill || false;
 this.scale = _scale || 0;
 this.cFill = _cFill;
 this.lineWidth = _width;
};

j2ds.Obj.inherit(j2ds.scene.BaseNode, j2ds.scene.LineNode);

j2ds.scene.LineNode.prototype.draw = function() {
 var context = this.layer.context;
 if (this.visible && this.isLookScene()) {

  if (this.alpha != 1) {
   var tmpAlpha = context.globalAlpha;
   context.globalAlpha = this.alpha;
  }

  context.strokeStyle = this.color;
  context.lineWidth = this.lineWidth;

  context.beginPath();
  context.moveTo(this.pos.x-j2ds.scene.view.x,
  this.pos.y-j2ds.scene.view.y);

  for (var i=0, len = this.points.length;i<len;i+=1) {
   context.lineTo(
   this.pos.x+this.points[i][0]*this.scale-j2ds.scene.view.x,
   this.pos.y+this.points[i][1]*this.scale-j2ds.scene.view.y);
  }

  context.stroke();
  if (this.fill) {
   context.fillStyle = this.cFill;
   context.fill();
  }

  context.lineWidth = 0;

  if (this.alpha != 1) {
   context.globalAlpha = tmpAlpha;
  }
 }
};









/*--------------------- прямоугольники ------------------------*/

j2ds.scene.addRectNode = function (_pos, _size, _color) {
	return new j2ds.scene.RectNode(_pos, _size, _color);
};

j2ds.scene.RectNode = function(_pos, _size, _color) {

 j2ds.scene.BaseNode.call(this, _pos, _size)

 this.color = _color;
};

j2ds.Obj.inherit(j2ds.scene.BaseNode, j2ds.scene.RectNode);

j2ds.scene.RectNode.prototype.draw = function() {
 var context = this.layer.context;
 if (this.visible  && this.isLookScene()) {

  if (this.alpha != 1) {
   var tmpAlpha = context.globalAlpha;
   context.globalAlpha = this.alpha;
  }

  if (this.angle)
  {
   context.save();
   context.translate(this.getPosition().x-j2ds.scene.view.x, this.getPosition().y-j2ds.scene.view.y);
   context.rotate(j2ds.math.rad(this.angle));
   context.translate(-(this.getPosition().x-j2ds.scene.view.x), -(this.getPosition().y-j2ds.scene.view.y));
  }

  context.fillStyle = this.color;
  context.lineWidth = 0;

  context.fillRect(
  this.pos.x-j2ds.scene.view.x,
  this.pos.y-j2ds.scene.view.y,
  this.size.x, this.size.y);

  if (this.angle) { context.restore(); }

  if (this.alpha != 1) {
   context.globalAlpha = tmpAlpha;
  }
 }
};









/*--------------------- изображения ---------------------*/

j2ds.scene.texture = {
 loadImageMap    : false,   // загрузка из файла
 createImageMap : false,    // создание анимации напрямую, минуя imageMap
 templates : {}
};

j2ds.scene.texture.createImageMap = function(_w, _h, _func) {
 var o = {
  img : null,
  width : _w,
  height : _h
 };

 o.img = document.createElement('canvas');
 o.context = o.img.getContext('2d');
 o.img.width = o.width;
 o.img.height = o.height;

 _func(o.context);

 /* Функции */
 o.getAnimation = function(_sourceX, _sourceY, _sourceW, _sourceH, _frameCount) {
  var o = {
   imageMap : this,
   sourceX : _sourceX,
   sourceY : _sourceY,
   sourceW : _sourceW,
   sourceH : _sourceH,
   frameCount : _frameCount-1
  };
  return o;
 };

 return o;
};

j2ds.scene.texture.loadImageMap = function(path) {
 var o = {
  img : null,
  width : 0,
  height : 0,
  loaded : false
 };

 o.img = document.createElement('img');
 o.crossOrigin = 'anonymous';
 o.img.src = path;
 o.img.onload = function() {
  o.width = o.img.width;
  o.height = o.img.height;
  o.loaded = true;
 };
 /* Свойства */

 /* Функции */
 o.getAnimation = function(_sourceX, _sourceY, _sourceW, _sourceH, _frameCount) {
  var o = {
   imageMap : this,
   sourceX : _sourceX,
   sourceY : _sourceY,
   sourceW : _sourceW,
   sourceH : _sourceH,
   frameCount : _frameCount-1
  };
  return o;
 };

 return o;
};


j2ds.scene.addSpriteNode = function (_pos, _size, _animation) {
	return new j2ds.scene.SpriteNode(_pos, _size, _animation);
};

j2ds.scene.SpriteNode = function(_pos, _size, _animation) {

 j2ds.scene.BaseNode.call(this, _pos, _size);

 this.tmpSpeed = 0;
 this.frame = 0;
 this.animation = _animation;
 this.flip = {x:false, y:false};

};

j2ds.Obj.inherit(j2ds.scene.BaseNode, j2ds.scene.SpriteNode);

j2ds.scene.SpriteNode.prototype.setFlip = function(_x, _y) {
 this.flip = {x:_x, y:_y};
};

j2ds.scene.SpriteNode.prototype.draw = function(_speed) {
 if (this.visible && this.isLookScene()) {
  _speed = _speed || 1;

  if (this.frame > this.animation.frameCount) {
   this.frame = 0;
  }
  this.drawFrame(this.frame+1);

  if (this.tmpSpeed > _speed) {
   this.frame+=1;
   this.tmpSpeed = 0;
  }
  else {
   this.tmpSpeed+=1;
  }
 };
};

 // отрисовка одного кадра
j2ds.scene.SpriteNode.prototype.drawFrame = function(_frame) {
 var context = this.layer.context;
 if (this.visible && this.isLookScene()) {

  if (this.alpha != 1) {
   var tmpAlpha = context.globalAlpha;
   context.globalAlpha = this.alpha;
  }

  context.lineWidth = 0;

  if (this.angle || this.flip.x || this.flip.y)
  {
   context.save();
   context.translate(this.getPosition().x-j2ds.scene.view.x, this.getPosition().y-j2ds.scene.view.y);
   context.rotate(j2ds.math.rad(this.angle));
   context.scale(this.flip.x ? -1 : 1, this.flip.y ? -1 : 1);
   context.translate(-(this.getPosition().x-j2ds.scene.view.x), -(this.getPosition().y-j2ds.scene.view.y));
  }

  _frame = _frame?(_frame-1):0;

  context.drawImage(
  this.animation.imageMap.img,
  (this.animation.sourceX+(this.animation.sourceW*_frame)), this.animation.sourceY,
  this.animation.sourceW, this.animation.sourceH,
  this.pos.x-j2ds.scene.view.x, this.pos.y-j2ds.scene.view.y,
  this.size.x, this.size.y);

  if (this.angle || this.flip.x || this.flip.y) {context.restore(); }

  if (this.alpha != 1) {
   context.globalAlpha = tmpAlpha;
  }
 }
};

j2ds.scene.SpriteNode.prototype.setAnimation = function(_id) {
 if (this.animation != _id)	{
	 this.animation = _id;
	}
};



/*----------- шаблоны текстур -------------*/

j2ds.scene.texture.templates.ellips = function (_context, _size, _color) {
	
};

j2ds.scene.texture.templates.fillRect = function (_context, _size, _color) {
 _context.fillStyle = _color;
 _context.fillRect(0, 0, _size.x, _size.y);
};

j2ds.scene.texture.templates.strokeRect = function (_context, _size, _color, _lineWidth) {
 _context.strokeStyle = _color;
 _context.lineWidth = _lineWidth;
 _context.strokeRect(0, 0, _size.x, _size.y);
};

j2ds.scene.texture.templates.gradientL = function (_context, _size, _colors, _izHorizontal) {
 var gradient = _context.createLinearGradient(0, 0, _size.x, 0);
 var step = 1 / _colors.length;
 if (!_izHorizontal) {
  gradient = _context.createLinearGradient(0, 0, 0, _size.y);
 }
 for (var i = step/2, j = 0; j < _colors.length; j+=1, i+=step) {
  gradient.addColorStop(i, _colors[j]);
 }
 _context.fillStyle = gradient;
 _context.fillRect(0, 0, _size.x, _size.y);
};

j2ds.scene.texture.templates.gradientR = function (_context, _size, _pos1, _r1, _pos2, _r2, _colors) {
	var gradient = _context.createRadialGradient(_pos1.x, _pos1.y, _r1, _pos2.x, _pos2.y, _r2);
	var step = 1 / _colors.length;
 for (var i = step/2, j = 0; j < _colors.length; j+=1, i+=step) {
  gradient.addColorStop(i, _colors[j]);
 }
 _context.fillStyle = gradient;
 _context.fillRect(0, 0, _size.x, _size.y);
};












/*--------------- Локальное хранилище ----------------*/



j2ds.createLocal = function(_id) {
var o = {};
o.id = _id;
o.ls = j2ds.window.localStorage ? j2ds.window.localStorage : false;

if (!o.ls) alert('J2ds ERROR in "createLocal('+_id+')" \n' + 'Объект "localStorage" не поддерживается.');
/*Свойства*/

/*Функции*/
o.saveNode = function (_name, _o) {
 if (!this.ls) return false;
  this.ls.setItem(this.id+_name, JSON.stringify(_o));
 };

 o.load = function (_name) {
  if (!this.ls) { return false; }
  return this.ls.getItem(this.id+_name);
 };

 o.is = function (_name) {
 if (!this.ls) { return false; }
  return !!(this.ls.getItem(this.id+_name));
 }

 o.save = function (_name, _value) {
  if (!this.ls) { return false; }
  this.ls.setItem(this.id+_name, _value);
 }

 o.loadNode = function (_name) {
 if (!this.ls) { return false; }
  return JSON.parse(this.ls.getItem(this.id+_name));
 }

 return o;
};
