//Set Up Variables
let draw = {
    tiles: true,
    spaces: true,
    players: true,
    tops: true,
    mechs: false,
    grid: false,
}
let allCanvas = {
    tile: {
        canvas: $('tile'),
        ctx: $('tile').getContext('2d'),
    },
    space: {
        canvas: $('space'),
        ctx: $('space').getContext('2d'),
    },
    player: {
        canvas: $('player'),
        ctx: $('player').getContext('2d'),
    },
    top: {
        canvas: $('top'),
        ctx: $('top').getContext('2d'),
    },
    mech: {
        canvas: $('mech'),
        ctx: $('mech').getContext('2d'),
    },
}
let canvas = $('player');
let ctx = canvas.getContext('2d');
let doDrawMechs = false;
let doGridLines = false;
let player = {
    interacting: false,
    speed: 0,
    moving: {
        left: false,
        right: false,
        down: false,
        up: false,
    },
    tile: {
        x: 0,
        y: 0,
    },
    pos: {
        x: 0,
        y: 0,
    },
    img: false,
}

//Functions
function start() {
    //Load All Images
    loadAllImages();

    //Set Up Player
    setUpPlayer();

    //Set Canvas Size
    setCanvasSize(allCanvas,draw);

    //Start Canvas Loop
    startLoop();
}
function clearCanvass() {
    
    allCanvas.tile.ctx.clearRect(0,0,allCanvas.tile.canvas.width,allCanvas.tile.canvas.height);
    allCanvas.space.ctx.clearRect(0,0,allCanvas.space.canvas.width,allCanvas.space.canvas.height);
    allCanvas.player.ctx.clearRect(0,0,allCanvas.player.canvas.width,allCanvas.player.canvas.height);
    allCanvas.top.ctx.clearRect(0,0,allCanvas.top.canvas.width,allCanvas.top.canvas.height);
    allCanvas.mech.ctx.clearRect(0,0,allCanvas.mech.canvas.width,allCanvas.mech.canvas.height);

}
function startLoop() {
    setInterval(function() {
        //Clear Needed
        if (draw.tiles) allCanvas.tile.ctx.clearRect(0,0,allCanvas.tile.canvas.width,allCanvas.tile.canvas.height);
        if (draw.spaces) allCanvas.space.ctx.clearRect(0,0,allCanvas.space.canvas.width,allCanvas.space.canvas.height);
        if (draw.players) allCanvas.player.ctx.clearRect(0,0,allCanvas.player.canvas.width,allCanvas.player.canvas.height);
        if (draw.tops) allCanvas.top.ctx.clearRect(0,0,allCanvas.top.canvas.width,allCanvas.top.canvas.height);
        if (draw.mechs) allCanvas.mech.ctx.clearRect(0,0,allCanvas.mech.canvas.width,allCanvas.mech.canvas.height);

        //Do Player Actions if Player is Present
        if (player) {
            //Move Player
            movePlayer();

            //Check If Player is on anything
            let inverseX = (data[0].length-1) - player.tile.x;
            let inverseY = (data.length-1) - player.tile.y;

            if (checkHWOOnAll(data[inverseY][inverseX])) {
                let id = checkHWOOnAll(data[inverseY][inverseX]);
                hidingIDS = id;
                clearCanvass();
                draw = {
                    tiles: true,
                    spaces: true,
                    players: true,
                    tops: true,
                    mechs: false,
                    grid: false,
                }
            } else {
                hidingIDS = false;
                
                clearCanvass();
                draw = {
                    tiles: true,
                    spaces: true,
                    players: true,
                    tops: true,
                    mechs: false,
                    grid: false,
                }
            }

            if (player.interacting) {
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[0].length; j++) {
                        let tile = data[i][j];
                        if (tile.mech.chat) {
                            //Check Distance From Player
                            if ((Math.sqrt((Math.pow(((data[0].length-1)-j)-player.tile.x,2)) + (Math.pow(((data.length-1)-i)-player.tile.y,2)))) < tile.mech.chat_startChatDistance) {
                                player.interacting = false;
                                player.chatting = [j,i];
                                startChat($('chat'),tile.mech);
                            }
                        }
                    }
                }
            }
            player.interacting = false;
        }

        //Draw Everything
        drawEverything(allCanvas,data,draw,player);
        draw.mechs = false;
        draw.tiles = false;
        draw.tops = false;
        draw.spaces = false;


    },1000/60)
}
function checkWalkableOnAll(data) {
    if (!data.tile.walkable) return false; 
    if (!data.space.walkable) return false;
    if (!data.top.walkable) return false; 
    if (!data.mech.walkable) return false; 
    return true;
}

function checkHWOOnAll(data) {
    if (data.tile.hideWhenOn) return data.tile.hwoID; 
    if (data.space.hideWhenOn) return data.space.hwoID;
    if (data.top.hideWhenOn) return data.top.hwoID; 
    if (data.mech.hideWhenOn) return data.mech.hwoID; 
    return false;
}
function movePlayer() {
    moveLeft: if (player.moving.left) {
        let playerLeft = Math.round(((player.pos.x-(tileSize/2)) - player.speed) / tileSize); 
        let inverseX = (data[0].length-1) - playerLeft;
        let inverseY = (data.length-1) - player.tile.y;
        let speedInverseX = (data[0].length-1) - player.tile.x;

        //Check If Will Walk Off Sceen
        if (playerLeft < 0) break moveLeft;

        //Check If Can't Move On Tile
        if(!checkWalkableOnAll(data[inverseY][inverseX])) break moveLeft;

        //Check If Player is On a Teleporter
        teleport: if(checkTeleportOnAll(data[inverseY][inverseX])) {
            let arr = checkTeleportOnAll(data[inverseY][inverseX]);
            if (arr[1][0] == player.tile.y && arr[1][1] == inverseX) break teleport;

            for (let i = 0; i < scenes.length; i++) {
                if (scenes[i].name == arr[0]) {
                    data = scenes[i].data;
                }
            }

            player.tile.x = (data[0].length-1) - arr[1][1];
            player.tile.y = (data.length-1) - arr[1][0];

            player.pos.y = player.tile.y * tileSize;
            player.pos.x = player.tile.x * tileSize;

            setCanvasSize(allCanvas,draw);
            break moveLeft;
        }


        //Change Speed Modifier
        let speed = (player.speed*4) * data[inverseY][speedInverseX].tile.speed;

        player.pos.x -= speed;
    }
    moveRight: if (player.moving.right) {
        let playerRight = Math.round(((player.pos.x+(tileSize/2)) + player.speed) / tileSize); 
        let inverseX = (data[0].length-1) - playerRight;
        let inverseY = (data.length-1) - player.tile.y;
        let speedInverseX = (data[0].length-1) - player.tile.x;

        //Check If Will Walk Off Sceen
        if (playerRight > data[0].length - 1) break moveRight;

        //Check If Can't Move On Tile
        if(!checkWalkableOnAll(data[inverseY][inverseX])) break moveRight;

        //Check If Player is On a Teleporter
        teleport: if(checkTeleportOnAll(data[inverseY][inverseX])) {
            let arr = checkTeleportOnAll(data[inverseY][inverseX]);

            if (arr[1][0] == player.tile.y && arr[1][1] == inverseX) break teleport;

            for (let i = 0; i < scenes.length; i++) {
                if (scenes[i].name == arr[0]) {
                    data = scenes[i].data;
                }
            }

            player.tile.x = (data[0].length-1) - arr[1][1];
            player.tile.y = (data.length-1) - arr[1][0];

            player.pos.y = player.tile.y * tileSize;
            player.pos.x = player.tile.x * tileSize;
            setCanvasSize(allCanvas,draw);
            break moveRight;
        }


        //Change Speed Modifier
        let speed = (player.speed*4) * data[inverseY][speedInverseX].tile.speed;

        player.pos.x += speed;
    }
    moveDown: if (player.moving.down) {
        let playerDown = Math.round(((player.pos.y+(tileSize/2)) + player.speed) / tileSize); 
        let inverseY = (data.length-1) - playerDown;
        let inverseX = (data[0].length-1) - player.tile.x;
        let speedInverseY = (data.length-1) - player.tile.y;

        //Check If Will Walk Off Sceen
        if (playerDown > data.length - 1) break moveDown;

        //Check If Can't Move On Tile
        if(!checkWalkableOnAll(data[inverseY][inverseX])) break moveDown;

        //Check If Player is On a Teleporter
        teleport: if(checkTeleportOnAll(data[inverseY][inverseX])) {
            let arr = checkTeleportOnAll(data[inverseY][inverseX]);

            if (arr[1][0] == player.tile.y && arr[1][1] == inverseX) break teleport;

            for (let i = 0; i < scenes.length; i++) {
                if (scenes[i].name == arr[0]) {
                    data = scenes[i].data;
                }
            }

            player.tile.x = (data[0].length-1) - arr[1][1];
            player.tile.y = (data.length-1) - arr[1][0];

            player.pos.y = player.tile.y * tileSize;
            player.pos.x = player.tile.x * tileSize;
            setCanvasSize(allCanvas,draw);
            break moveDown;
        }
        
        
        //Change Speed Modifier
        let speed = (player.speed*4) * data[speedInverseY][inverseX].tile.speed;
        
        player.pos.y += speed;
    }
    moveUp: if (player.moving.up) {
        let playerDown = Math.round(((player.pos.y-(tileSize/2)) + player.speed) / tileSize); 
        let inverseY = (data.length-1) - playerDown;
        let inverseX = (data[0].length-1) - player.tile.x;
        let speedInverseY = (data.length-1) - player.tile.y;

        //Check If Will Walk Off Sceen
        if (playerDown < 0) break moveUp;

        //Check If Can't Move On Tile
        if(!checkWalkableOnAll(data[inverseY][inverseX])) break moveUp;

        //Check If Player is On a Teleporter
        teleport: if(checkTeleportOnAll(data[inverseY][inverseX])) {
            let arr = checkTeleportOnAll(data[inverseY][inverseX]);

            
            if (arr[1][0] == player.tile.y && arr[1][1] == inverseX) break teleport;


            for (let i = 0; i < scenes.length; i++) {
                if (scenes[i].name == arr[0]) {
                    data = scenes[i].data;
                }
            }

            player.tile.x = (data[0].length-1) - arr[1][1];
            player.tile.y = (data.length-1) - arr[1][0];

            player.pos.y = player.tile.y * tileSize;
            player.pos.x = player.tile.x * tileSize;
            setCanvasSize(allCanvas,draw);
            break moveUp;
        }

        
        //Change Speed Modifier
        let speed = (player.speed*4) * data[speedInverseY][inverseX].tile.speed;

        player.pos.y -= speed;
    }
    player.tile.x = Math.round(player.pos.x / tileSize)
    player.tile.y = Math.round(player.pos.y / tileSize)
}
function setUpPlayer() {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j].mech.testPlayFromHere) {
                player.pos.x = (((data[i].length-1)-j)*tileSize)// + (tileSize/2);
                player.pos.y = (((data.length-1)-i)*tileSize)// + (tileSize/2);
                player.tile.x = j;
                player.tile.y = i;
                player.img = data[i][j].mech.id;
                player.speed = data[i][j].mech.speed;
                return;
            }
        }
    }
    player = false;
}


function goBackToEditor() {
    
    let testPlayer = window.open("./index.html","_self")
}
//Finished Functions and Start
start();
//Interactive Window

window.addEventListener('keydown',function(e) {
    let key = e.key;
    let lkey = e.key.toLowerCase(); //Key but in lowercase no matter what 

    if (lkey == 'escape') {
        ls.save('scTestPlayer',false)
        goBackToEditor();
    }
    if (lkey == 'g') {
        doGridLines = doGridLines ? false : true;
    }
    if (lkey == 'm') {
        doDrawMechs = doDrawMechs ? false : true;
    }
    if (lkey == 'e') {
        player.interacting = true;
    }

    if (lkey == 'a') player.moving.left = true;
    if (lkey == 's') player.moving.down = true;
    if (lkey == 'd') player.moving.right = true;
    if (lkey == 'w') player.moving.up = true;
})
window.addEventListener('keyup',function(e) {
    let key = e.key;
    let lkey = e.key.toLowerCase(); //Key but in lowercase no matter what 


    if (lkey == 'a') player.moving.left = false;
    if (lkey == 's') player.moving.down = false;
    if (lkey == 'd') player.moving.right = false;
    if (lkey == 'w') player.moving.up = false;
})