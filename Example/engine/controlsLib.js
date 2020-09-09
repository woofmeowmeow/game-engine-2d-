function WASD_standardMovement(){
    //event listener
    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);
    
    function onKeyDown(event){
        let keyCode = event.keyCode;

        switch (keyCode) {
            case 68: //d
                keyD = true;
                break;
            case 83: //s
                keyS = true;
                break;
            case 65: //a
                keyA = true;
                break;
            case 87: //w
                keyW = true;
                break;
        }
    }
    
    function onKeyUp(event){
        let keyCode = event.keyCode;

        switch (keyCode) {
            case 68: //d
                keyD = false;
                break;
            case 83: //s
                keyS = false;
                break;
            case 65: //a
                keyA = false;
                break;
            case 87: //w
                keyW = false;
                break;
        }
    }
    
    let keyW = false;
    let keyA = false;
    let keyS = false;
    let keyD = false;
    
    this.init = function(entity){
        if (keyD == true) {
            entity.vx += 0.05;
        }
        if (keyS == true) {
            entity.vy += 0.05;
        }
        if (keyA == true) {
            entity.vx -= 0.05;
        }
        if (keyW == true) {
            entity.vy -= 0.05;
        }
    }
}