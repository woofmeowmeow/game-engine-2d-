let createParticle = function(){ // create a random particle
    let updt = new Update(function(){
        rand_offset = new vector2(Random(-8,8),Random(-8,8));
        p_pos       = new vector2(gameW/2+rand_offset.x,gameH/2+rand_offset.y);
        p_size      = new vector2(Random(1,3),Random(1,3));
        p_vel       = new vector2(0,-2);
        p_acc       = new vector2(0,0);
        p_grav      = new vector2(0,1);
        particle    = new Entity(p_pos,p_size,p_vel,p_acc,p_grav,"circle");
        particle.c  = rgb(Random(1,255),Random(1,255),Random(1,255));
    });

    let onout = Event(game,"mouseout",function(){
        updt.stop();
    });
};

let onIn = Event(game,"mouseover",createParticle);

function gl(){
    for(let i in workspace){
        workspace[i].gravity = g_constant;
        workspace[i].applyGravity();
        workspace[i].updateVectorPosition();

        if(workspace[i].hitBottom()){ // delete entitys when they hit the bottom
            workspace[i].destroy();
        }
    }

    gfx.fillStyle = "black";
    gfx.fillRect(0,0,gameW,gameH);
    RenderAllEntitys();

    window.requestAnimationFrame(gl);
}window.requestAnimationFrame(gl);