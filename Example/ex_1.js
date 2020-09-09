/********************************************************/
/*                   GAME ENTITYS                       */
/********************************************************/
entPos     = new vector2(gameW/2,gameH/2);
entSize    = new vector2(135,135);
entVel     = new vector2(0,0);
entAcc     = new vector2(0,0);
entG       = new vector2(0,1);
const ent  = new Entity(entPos,entSize,entVel,entAcc,entG,"rectangle");

ent2Pos    = new vector2(360,gameH/2);
ent2Size   = new vector2(15,15);
ent2Vel    = new vector2(0,0);
ent2Acc    = new vector2(0,0);
ent2G      = new vector2(0,1);
const ent2 = new Entity(ent2Pos,ent2Size,ent2Vel,ent2Acc,ent2G,"rectangle");
/********************************************************/
/*                     GUI OBJECTS                      */
/********************************************************/
// Frame
frameSize     = new vector2(100,30);
framePos      = new vector2((gameW/2)-50,30-2);
const frame   = new Frame(framePos,frameSize);                   // add a frame around your text button so it looks better
frame.bgColor = "#2F4F4F";                                       // add background color to your frame

// TextButton
labelPos      = new vector2(gameW/2,50);                         // position vector
labelSize     = new vector2(50,25);                              // button size vector
const label   = new TextButton(labelPos,labelSize,labelClicked); // params: position,size,font,color,text,function
label.text    = "add entity";                                    // add text
label.font    = "22px Tahoma";                                   // font and text size
label.color   = "red";                                           // text color

let dialogVec = new vector2(gameW/2,gameH/2);
const dialog  = new DialogBox(dialogVec,"red","hello");
/********************************************************/
/*                   GLOBAL VARIABLES                   */
/********************************************************/
let colors = [
    "#21618C","#2E86C1",
    "#1B4F72","#F5B7B1",
    "#AF7AC5","#C39BD3"
];

let map_data = [ // create map
    1, 3, 3, 3, 2, 1, 3, 1,
    1, 1, 1, 1, 2, 2, 1, 1,
    1, 1, 1, 1, 1, 2, 1, 1,
    1, 1, 1, 1, 1, 2, 1, 1,
    1, 1, 1, 1, 1, 2, 1, 1,
    1, 1, 2, 2, 2, 2, 1, 1,
    1, 1, 2, 1, 1, 1, 1, 1,
    1, 1, 2, 0, 0, 1, 1, 1
];
ent.c  = colors[5];
ent2.c = colors[3];
window.onload      = LoadTileAtlas("https://mdn.mozillademos.org/files/11641/tiles.png"); // load your tile atlas for the map
let playerMovement = new WASD_standardMovement();                                         // player movement controls (WASD)
/********************************************************/
/*                         EVENTS                       */
/********************************************************/
let cl = label.clicked();                                       // call the clicked method on your TextButton
function labelClicked(){                                        // creatte a function and pass it in the last param of your TextButton                               
    label.color = colors[Random(0,colors.length)];
    p           = new vector2(Random(0,gameW-15),Random(0,gameH+15));
    s           = new vector2(5,5);
    v           = new vector2(0,0);
    a           = new vector2(0,0);
    g           = new vector2(0,1);
    new_ent     = new Entity(p,s,v,a,g,"rectangle");
    new_ent.c   = colors[Random(0,colors.length)];
}

let entClicked = new EventDetector(ent.position,ent.size,"click",function(){
    console.log("clicked");
});
entClicked.event();
/********************************************************/
/********************************************************/
function gl(){
    /****************************************************/
    /****************************************************/
    for(let i in workspace){           // update entity potitions/enable physics
        workspace[i].gravity = g_constant;
        workspace[i].applyGravity();
        workspace[i].updateVectorPosition();
        workspace[i].wander();
        workspace[i].enableWalls();
    }
    /****************************************************/
    /****************************************************/
    EnableEntityCollision();            // collision detection for game entitys
    Background("black");                // set canvas background color or image (also clears canvas)
    RenderMap(8,8,64,map_data);         // create and render map
    RenderAllEntitys();                 // render all entitys in workspace
    frame.draw();                       // draw frame
    label.draw();                       // draw text button
    playerMovement.init(ent);           // init player movement script
    dialog.draw();                      // draw dialog box

    if(ent.y >= gameH/2){
        dialog.change("hey");
    }
    /****************************************************/
    /****************************************************/
    window.requestAnimationFrame(gl);
}window.requestAnimationFrame(gl);