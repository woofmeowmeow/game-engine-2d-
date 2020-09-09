function LoadTileAtlas(img){
    let d    = document.createElement("div");
    d.id     = "addTo";
    let body = document.getElementsByTagName("body")[0];

    body.appendChild(d);
    document.getElementById(d.id).innerHTML += '<div style="display:none;"><img id="source"src='+img+'width="300"height="227"></div>';
}

function RenderMap(colums_,rows_,size,mapData){
    var atlas = document.getElementById("source");

    var map = {
        cols:  colums_,
        rows:  rows_,
        tsize: size,
        tiles: mapData,
        getTile: function(col, row) {
            return this.tiles[row * map.cols + col]
        }
    };
    
    for (var c = 0; c < map.cols; c++) {
        for (var r = 0; r < map.rows; r++) {
            var tile = map.getTile(c, r);
            if (tile !== 0) {               // 0 => empty tile
                gfx.drawImage(
                    atlas,                  // image
                    (tile - 1) * map.tsize, // source x
                    0,                      // source y
                    map.tsize,              // source width
                    map.tsize,              // source height
                    c * map.tsize,          // target x
                    r * map.tsize,          // target y
                    map.tsize,              // target width
                    map.tsize               // target height
                );
            }
        }
    }
}