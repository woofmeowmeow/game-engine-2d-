const game = document.createElement("canvas"), gfx = game.getContext("2d"); // game and context constants

    game.id     = "game_window";
    game.width  = 400;
    game.height = 400;
    
    let gameW = game.width, gameH = game.height; // game area width and height
    let body  = document.getElementsByTagName("body")[0];
    body.appendChild(game);

    const delta_time        = 0.008; //0.005 years is equal to 1.825 days
    const softeningConstant = 0.15;
    const g_constant        = 6.673*(10**-11);
    let workspace           = []; // workspace stores all entitys in your game

/******************************
 * canvas background color
 * param_1: color or url
 * param_2: "Image" or nothing
******************************/

let Background = function(color,type){
    if(!type){
        gfx.fillStyle = color;
        gfx.fillRect(0,0,game.height,game.width);
    }else{
        let image = new Image();
        image.src = color;
        gfx.fillRect(0,0,game.width,game.height);
        gfx.drawImage(image,0,0,game.width,game.height);
    }
};

/************
 * rgb color
************/

let rgba = function(r,g,b,a){
    return "rgba"+"("+r+", "+g+", "+b+", "+a+")";
};

/**************
 * play sounds
**************/

let Sound = function(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = function(){
        this.sound.play();
    };

    this.stop = function(){
        this.sound.pause();
    };
};

/****************
 * opens an hta
****************/

let ApplicationWindow = function(hta){
    WshShell = new ActiveXObject("WScript.Shell");
    WshShell.Run(hta, 1, false);

    this.enableJavascript = function(){
        let head = document.getElementsByTagName("head")[0];
        head.appendChild('<meta http-equiv="x-ua-compatible" content="ie=edge" />'); // enableJavascript appends this tag to the head of the hta
    };
};

/***************************
 * returns a random integer
***************************/

let Random = function(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
};

/*******************************************************
 * convert negative to positive or positive to negative
*******************************************************/

let Reverse = function(num){
    if(num > 0){
        return -Math.abs(num);
    }else{
        return Math.abs(-num);
    }
};

/******************************************************
 * Distance() returns the distance between two entitys
******************************************************/

let GetDistance = function(ent1,ent2){
    this.ent1 = ent1;
    this.ent2 = ent2;

    vec1 = new vector2(ent1.x,ent1.y);
    vec2 = new vector2(ent2.x,ent2.y);

    let a = vec1.x - vec2.x;
    let b = vec1.y - vec2.y;

    return Math.sqrt(a*a + b*b);
};

/******************************************************
 * Distance() returns the distance between two entitys
******************************************************/

let GetVectorDistance = function(vec1,vec2){
    this.vec1 = vec1;
    this.vec2 = vec2;

    let a = vec1.x - vec2.x;
    let b = vec1.y - vec2.y;

    return Math.sqrt(a*a + b*b);
};

/************************************************
 * to use this just pass in a function like this: 
 * var gl = new Update(function(){});
************************************************/

let Update = function(f){
    this.f = f;

    let interval = setInterval(f,30);
    
    this.stop = function(){ // stop interval
        gfx.clearRect(0,0,gameW,gameH);
        clearInterval(interval,0);
    };
};

/******************************************
 * draws all entitys in the workspace
******************************************/

let RenderAllEntitys = function(){
    for(let i in workspace){
        workspace[i].render();
    }
};

/**************************************************
 * removes and erases all entitys in the workspace
**************************************************/

let DestroyAllEntitys = function(){
    for(let i in workspace){
        workspace[i].destroy();
    }
};

/****************************************************
 * apply physics by calling ApplyPhysics() in update
****************************************************/

let ApplyPhysics = function(){
    for(let i in workspace){
        workspace[i].applyGravity();
    }
};

/***************
 * event class
***************/

let Event = function(parent,event,fn,bool){
    parent.addEventListener(event,fn,bool);
};

/********************************
 * event detector class
********************************/

let EventDetector = function(vector2Pos,vector2Size,evnt,fn){
    this.event = function(){
        let ev = new Event(game,evnt,function(e){
            let x = e.clientX,
                y = e.clientY;

            if(Math.pow(x-vector2Pos.x,vector2Size.y)+Math.pow(y-vector2Pos.y,vector2Size.x) < Math.pow(vector2Size.x,vector2Size.y)){
                fn();
            }
        });
    };
};

/************************
 * object collision
 * returns true or false
************************/

function collison(x1, y1, w1, h1, x2, y2, w2, h2){
    if(x2 >= w1 + x1 || x1 >= w2 + x2 || y2 >= h1 + y1 || y1 >= h2 + y2){
        return false;
    }
    return true;
}

/*****************************
 * entity collision detection
*****************************/

function EnableEntityCollision(){
    let obj1;
    let obj2;

    // reset collision state of all objects
    for(let i = 0; i < workspace.length; i++){
        workspace[i].hit = false;
    }

    // start checking for collisions
    for(let i = 0; i < workspace.length; i++){
        obj1 = workspace[i];
        for(let j = i + 1; j < workspace.length; j++){
            obj2 = workspace[j];

            // compare object1 with object2
            if(collison(obj1.x, obj1.y, obj1.w, obj1.h, obj2.x, obj2.y, obj2.w, obj2.h)){
                obj1.hit = true;
                obj2.hit = true;

                /*               
                // reverse obj1 velocity by gravitySpeed - velocity and just reverse obj2 velocity 
                if(obj1.x <= obj2.x + obj2.w && obj2.x >= obj1.x - obj1.w){
                    obj1.vx = Reverse(obj1.gravityVector.x-obj1.vx);
                    obj2.vx = Reverse(obj2.vx);
                }
                // reverse obj2 velocity by gravitySpeed - velocity and just reverse obj1 velocity 
                else if(obj2.x <= obj1.x + obj1.w && obj1.x >= obj2.y - obj2.w){
                    obj2.vx = Reverse(obj2.gravityVector.x-obj2.vx);
                    obj1.vx = Reverse(obj1.vx);
                } 
                */

                // reverse velocity of both objects on x axis
                obj1.vx = Reverse(obj1.vx);
                obj2.vx = Reverse(obj2.vx);

                // reverse obj1 velocity by gravitySpeed - velocity and just reverse obj2 velocity 
                if(obj1.y <= obj2.y + obj2.h && obj2.y >= obj1.y - obj1.h){
                    obj1.vy = Reverse(obj1.gravityVector.y-obj1.vy);
                    obj2.y = obj2.y;
                }
                // reverse obj2 velocity by gravitySpeed - velocity and just reverse obj1 velocity 
                else if(obj2.y <= obj1.y + obj1.h && obj1.y >= obj2.y - obj2.h){
                    obj2.vy = Reverse(obj2.gravityVector.y-obj2.vy);
                    obj1.vy = obj1.vy;
                }

                // move obj position if they get stuck
                if(obj1.x > obj2.x && obj2.x < obj1.x && obj1.y > obj2.y && obj2.y < obj1.y){
                    console.log("unstuck");
                    obj1.x = obj1.x - obj2.w;
                }
            }
        }
    }
}

/********************
 * vector2(x,y)
********************/

function vector2(x,y){
    this.x = x || 0; this.y = y || 0;
}

vector2.prototype = {
	negative: function() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	},
	add: function(v) {
		if (v instanceof vector2) {
			this.x += v.x;
			this.y += v.y;
		} else {
			this.x += v;
			this.y += v;
		}
		return this;
	},
	subtract: function(v) {
		if (v instanceof vector2) {
			this.x -= v.x;
			this.y -= v.y;
		} else {
			this.x -= v;
			this.y -= v;
		}
		return this;
	},
	multiply: function(v) {
		if (v instanceof vector2) {
			this.x *= v.x;
			this.y *= v.y;
		} else {
			this.x *= v;
			this.y *= v;
		}
		return this;
	},
	divide: function(v) {
		if (v instanceof vector2) {
			if(v.x != 0) this.x /= v.x;
			if(v.y != 0) this.y /= v.y;
		} else {
			if(v != 0) {
				this.x /= v;
				this.y /= v;
			}
		}
		return this;
	},
	equals: function(v) {
		return this.x == v.x && this.y == v.y;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	cross: function(v) {
		return this.x * v.y - this.y * v.x
	},
	length: function() {
		return Math.sqrt(this.dot(this));
	},
	normalize: function() {
		return this.divide(this.length());
	},
	min: function() {
		return Math.min(this.x, this.y);
	},
	max: function() {
		return Math.max(this.x, this.y);
	},
	toAngles: function() {
		return -Math.atan2(-this.y, this.x);
	},
	angleTo: function(a) {
		return Math.acos(this.dot(a) / (this.length() * a.length()));
	},
	toArray: function(n) {
		return [this.x, this.y].slice(0, n || 2);
	},
	clone: function() {
		return new vector2(this.x, this.y);
	},
	set: function(x, y) {
		this.x = x; this.y = y;
		return this;
	}
};

/********************
 * draws a grid
********************/

let DrawGrid = function(c,r,vec2,color){
    this.c = c;
    this.r = r;
    this.w = 25;
    this.h = 25;
    this.vec2 = vec2;
    this.color = color;

    for(let i = 0; i < c; i++){
        for(let j = 0; j < r; j++){
            let x = i * vec2.x;
            let y = j * vec2.y;
            
            gfx.strokeStyle = color;
            gfx.strokeRect(x,y,this.w,this.h);
        }
    }
};

/********************
 * 2d array class
********************/

let Create2DArray = function(c,r,arr,val){
    this.c = c;
    this.r = r;
    this.arr = arr;
    this.val = val;

    for(let i = 0; i < c; i++){
        arr[i] = [];
        for(let j = 0; j < r; j++){
            arr[i][j] = val;
        }
    }
};

/************************************************************
 * FindEntityById() returns the entity with the specified id
************************************************************/

let FindEntityById = function(id){
    this.id = id;

    for(i in workspace){
        if(workspace[i].id === id){
            return workspace[i];
        }
    }
};

/************************************************
 * create a game object using the Entity() class
************************************************/

let Entity = function(vecP,vecS,vecV,vecA,vecG,type,imagePath){ // create entity.(types: "rectangle", "circle")
    workspace.push(this);

    this.hit  = false;this.vecP = vecP; this.vecS      = vecS;this.vecG = vecG;
    this.vecV = vecV;this.vecA  = vecA; this.imagePath = imagePath;
    
    this.position = vecP;      // position vector
    this.x = this.position.x;
    this.y = this.position.y;
    vecP.x = this.x;
    vecP.y = this.y;
    
    this.size = vecS;          // size vector
    this.w = this.size.x;
    this.h = this.size.y;
    vecS.x = this.w;
    vecS.y = this.h;
    
    this.velocity = vecV;      // velocity vector
    this.vx = vecV.x;
    this.vy = vecV.y;
    vecV.x  = this.vx;
    vecV.y  = this.vy;

    this.acceleration = vecA;  // acceleration vector
    this.ax = vecA.x;
    this.ay = vecA.y;
    vecA.x  = this.ax;
    vecA.y  = this.ay;

    this.gravityVector = vecG; // gravity vector
    this.gravity       = vecG.x;
    this.gravitySpeed  = vecG.y;
    vecG.x             = this.gravity;
    vecG.y             = this.gravitySpeed;
    
    this.c    = "grey";                      // color
    this.r    = 70;                          // radius
    this.m    = Math.pow(1.5,this.size.x/3); // mass value (scales by size)
    this.f    = 0.99;                        // friction value
    this.type = type;                        // types: "rectangle", "circle"
    this.id   = Random(1,Math.pow(5,20));    // entity id

    /******************************************
     * draw your entity by calling ent.render()
    ******************************************/

    this.render = function(){ // 
        if(type == "rectangle"){
            if(imagePath){
                let image = new Image();
                image.src = imagePath;
                gfx.fillRect(this.x,this.y,this.w,this.h);
                gfx.drawImage(image,this.x,this.y,this.w,this.h);
            }else{
                gfx.fillStyle = this.c;
                gfx.fillRect(this.x,this.y,this.w,this.h);
            }
        }
        if(type == "circle"){
            gfx.beginPath();
            gfx.arc(this.x,this.y,this.w,this.h,this.r,0,2*Math.PI,false);
            gfx.fillStyle = this.c;
            gfx.fill();
        }
    };

    /*************************************************
     * destroy an entity by calling ent.destroy()
    *************************************************/
	
    this.destroy = function(){ 
        gfx.clearRect(this.x,this.y,this.w,this.h);
        let index = workspace.indexOf(this);
        workspace.splice(index,1);
    };

    /*****************************************************
     * duplicate an entity by calling ent.duplicate()
    *****************************************************/

    this.duplicate = function(){
        let newent        = new Entity(this.type);
        newent.position.x = this.x; newent.position.y = this.y;
        newent.size.w     = this.w; newent.size.h = this.h;
        newent.c          = this.c; newent.imagePath = imagePath;
        return newent;
    };

    /***********************************************
     * apply gravity by calling ent.applyGravity()
    ***********************************************/

    this.applyGravity = function(){
        this.gravityVector.y += this.gravityVector.x;
        this.x               += this.vx;
        this.y               += this.vy + this.gravityVector.y;
    };

    /*****************************************************************
     * ent.getDistance(vec2) returns the distance between two entitys
    *****************************************************************/

    this.getDistance = function(vec2){
        this.vec2 = vec2;

        let a = this.x - vec2.x;
        let b = this.y - vec2.y;

        return Math.sqrt(a*a + b*b);
    };

    /*****************************************************************
     * ent.getForce(ent) returns the g-force between two entitys
    *****************************************************************/

    this.getForce = function(m2){
        this.m2 = m2;

        r = this.getDistance(m2.position);
        G = g_constant;
        F = (G*this.m*m2.m)/(r**2);

        num = F.toFixed(2);
        return parseFloat(num);
    };

    /***************************
     * apply force to entitys
    ***************************/

    this.applyForce = function(force){
        this.acceleration = force;
    };

    /**********************************************************************
     * check if an entity hits a border of the canvas
     * note: these returns true or false
    **********************************************************************/

    this.hitTop = function(){ //--top
        let top = 0;
        if(this.y <= top){
            return true;
        }else{
            return false;
        }
    };

    this.hitBottom = function(){ //--bottom
        let bottom = gameH;
        if(this.y >= bottom - this.h){
            return true;
        }else{
            return false;
        }
    };

    this.hitLeftSide = function(){ //--left
        let side = 0;
        if(this.x <= side){
            return true;
        }else{
            return false;
        }
    };

    this.hitRightSide = function(){ //--right
        let side = gameW - this.w ;
        if(this.x >= side){
            return true;
        }else{
            return false;
        }
    };

    /*******************************************
     * to enable borders call ent.enableWalls()
    *******************************************/

    this.enableWalls = function(){
        if(this.hitBottom()){
            this.vy -= 1.5;
            this.y = gameH-this.h;
        }
        if(this.hitTop()){
            this.vy += 0.9;
        }
        if(this.hitLeftSide()){
            this.vx += 0.9;
        }
        if(this.hitRightSide()){
            this.vx -= 0.9;
        }
    };

    /******************************************
     * updates position, velocity and friction
    ******************************************/

    this.updatePosition = function(){
        //update velocity
        this.vx += this.ax;
        this.vy += this.ay;
    
        //cheat's friction (friction = 0.97)
        this.vx *= this.f;
        this.vy *= this.f;
    
        //update position
        this.x += this.vx;
        this.y += this.vy;
    };

    this.updateVectorPosition = function(){
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.vx *= this.f;
        this.vy *= this.f;
        this.acceleration.set(0,0);
    };

    /*******************************************************
     * ent.wander() will make it randomly wander x & y axis
    *******************************************************/

    this.wander = function(){
        this.newPos = new vector2(Random(-8,8),Random(-8,8));
        let rand = Random(1,50);

        if(this.gravity != 0 && this.x != this.newPos.x || this.y != this.newPos.y){
            if(rand === 1){
                this.vx += 0.1;
            }
            if(rand === 2){
                this.vx -= 0.1;
            }
            if(rand === 3){
                this.vy += 0.1;
            }
            if(rand === 4){
                this.vy -= 0.1;
            }
        }
    };

    /*********************************************************
     * ent.moveRandom() will make it randomly move x & y axis
    *********************************************************/

    this.moveRandom = function(){
        let newPos = new vector2(Random(-8,8),Random(-8,8));
        let rand = Random(1,15);

        if(this.x != newPos.x || this.y != newPos.y){
            if(rand === 1){
                /*X:*/ this.x = this.x + newPos.x; /*Y:*/ this.y = this.y + newPos.y;
            }
            if(rand === 2){
                /*X:*/ this.x = this.x - newPos.x; /*Y:*/ this.y = this.y - newPos.y;
            }
        }
    };
};

/********************************************************/
/*                     GUI CLASSES                      */
/********************************************************/

/**************
 * TextLabel
**************/

let TextLabel = function(vector2,font,color,text,textAlign){
    this.text      = text; this.font       = font;
    this.textAlign = textAlign; this.color = color;

    this.draw = function(){
        gfx.font = font;
        gfx.fillStyle = color;
        gfx.textAlign = textAlign;
        gfx.fillText(text,vector2.x,vector2.y);
    };

    this.erase = function(){
        gfx.fillStyleStyle = rgba(0,0,0,0.0);
        gfx.fillText(text,vector2.x,vector2.y);
    };
};

/**************
 * TextButton
**************/

let TextButton = function(vector2,vector2Size,fn){
    this.vector2     = vector2;  this.vector2Size = vector2Size;
    this.text        = "button"; this.font        = "30px Comic Sans MS";
    this.textAlign   = "center"; this.color       = "red";

    this.clicked = function(){
        let evnt = new Event(game,"click",function(e){
            let x = e.clientX,
                y = e.clientY;

            if(Math.pow(x-vector2.x,vector2Size.y)+Math.pow(y-vector2.y,vector2Size.x) < Math.pow(vector2Size.x,vector2Size.y)){
                fn();
            }
        });
    };

    this.draw = function(){
        gfx.font = this.font;
        gfx.fillStyle = this.color;
        gfx.textAlign = this.textAlign;
        gfx.fillText(this.text,vector2.x,vector2.y);
    };

    this.erase = function(bgColor){
        gfx.fillStyle = bgColor;
        gfx.fillText(this.text,vector2.x,vector2.y);
    };
};

/**************
 * Frame
**************/

let Frame = function(vector2Pos,vector2Size){
    this.bgColor     = "grey";
    this.vector2Pos  = vector2Pos;
    this.vector2Size = vector2Size;

    this.draw = function(){
        gfx.fillStyle = this.bgColor;
        gfx.fillRect(vector2Pos.x,vector2Pos.y,vector2Size.x,vector2Size.y);
    }

    this.erase = function(){
        gfx.clearRect(vector2Pos.x,vector2Pos.y,vector2Size.x,vector2Size.y);
    };
};

/**************
 * DialogBox
**************/

let DialogBox = function(vec,color,text){
    this.text      = text;
    this.vec       = vec;
    this.color     = color;
    this.font      = "20px Aerial";
    this.tl        = new TextLabel(vec,this.font,color,text);
    let changedVal = false;

    this.draw = function(){
        this.tl.draw();
    };

    this.erase = function(){
        this.tl.erase();
    };

    /*********************
     * change dialog text
    *********************/

    this.change = function(newText){
        this.tl.erase();
        this.newTl  = new TextLabel(vec,this.font,color,newText);
        this.newTl.draw();
        changedVal  = true;
    };

    /*******************************
     * returns true if text changes
    *******************************/

    this.changed = function(){
        if(changedVal == true){
            changedVal = false;
            return true;
        }
    };
};