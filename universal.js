//Variables
let data,worlds,game,scenes;
if (ls.get('scTestPlayer')) {
    data = JSON.parse(ls.get('scTestPlayer')); //scCurrentMap
    worlds = JSON.parse(ls.get('SCmaps'));
    game = findGameByName(ls.get('scGame'),worlds)
    scenes = game.scenes;
}


let maxWorldWidth = 20;
let minWorldWidth = 5;
let maxWorldHeight = 20;
let minWorldHeight = 5;
let tileSize = 45; //Pixels
let hidingIDS = false;

//Functions

function findGameByName(name,games) {
    for (let i = 0; i < games.length; i++) {
        if (games[i].name == name) return games[i];
    }
}
function decodeFile(file) {
    let map = file.split('/');
    for (let i = 0; i < map.length; i++) {
        map[i] = map[i].split(',')
    }
    let newMap = [];
    for (let i = 0; i < map.length; i++) {
        let row = [];
        for (let j = 0; j < map[0].length; j++) {
            let cell = map[i][j].split('-');

            row.push({
                tile: returnTrueObj('tile',cell[0]),
                space: returnTrueObj('space',cell[1]),
                top: returnTrueObj('top',cell[2]),
                mech: returnTrueObj('mech',cell[3])
            });
        }
        newMap.push(row)
    }
    return newMap;
}

function returnTrueObj(type,cell) {
    let tileSplit = [];
    let on = 'id';
    let id = '';
    let atrStart;
    for (let i = 0; i < String(cell).length; i++) {
        let char = String(cell).charAt(i);
        if (on == 'id' && !isNaN(char)) {
            id += char;
            continue;
        } else {
            on = 'atr';
        }
        if (char == '[') {
            atrStart = '';
            continue;
        }
        if (char == ']') {
            tileSplit.push(atrStart.split('<>'));
            atrStart = '';
            continue;
        }
        atrStart += char;
    }
    let obj = structuredClone(returnObj(type,Number(id)));
    for (let i = 0; i < tileSplit.length; i++) {
        
        let value = tileSplit[i][1];
        if (value === 'false') value = false;
        if (value === 'true') value = true;
        if (!isNaN(value) && value !== false && value !== true) value = Number(value);

        let id = tileSplit[i][0];
        if (id == '00w') obj.walkable = value;
        if (id == '00s') obj.speed = value;
        if (id == '0t0') obj.teleport = value;
        if (id == '00h') obj.hideWhenOn = value;
        if (id == '0h0') obj.hwoID = value;
        if (id == '0hh') obj.hwoMyID = value;
        if (id == '00r') obj.render = value;
    }
    return obj;
}

function decodeAll(string) {
    let games = string.split("}}}");
    let finalGames = [];
    for (let j = 0; j < games.length; j++) {
        let nameData = games[j].split("{{{");
        let scenes = nameData[1].split('|{]');
        let finalScenes = [];
        for (let i = 0; i < scenes.length; i++) {
            let nameData = scenes[i].split("}{|");
            let obj = {
                name: nameData[0],
                data: decodeFile(nameData[1]),
                settings: {
                    width: Number(nameData[2]),
                    height: Number(nameData[3]),
                }
            }
            finalScenes.push(obj)
        }
        let obj = {
            name: nameData[0],
            scenes: finalScenes,
            settings: {
                nothing: nameData[2],   
            }
        }
        finalGames.push(obj);
    }
    return finalGames;
}
function returnObj(type,id) {
    if (type == 'tile') {
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].id == id) return tiles[i];
        }
    }
    if (type == 'space') {
        for (let i = 0; i < spaces.length; i++) {
            if (spaces[i].id == id) return spaces[i];
        }
    }
    if (type == 'top') {
        for (let i = 0; i < tops.length; i++) {
            if (tops[i].id == id) return tops[i];
        }
    }
    if (type == 'mech') {
        for (let i = 0; i < mechs.length; i++) {
            if (mechs[i].id == id) return mechs[i];
        }
    }
}

function loadAllImages() {
    window.count = 0;
    window.finishedLoadingImages = false;
    let images = document.body.create('div');
    images.css({
        position: "absolute",
        top: "10000px",
    })

    for (let i = 0; i < tiles.length; i++) {
        if (!tiles[i].img) continue;
        window.count++;
        let img = images.create('img');
        img.src = 'img/' + tiles[i].img + '.png';
        img.id = 'imgTile' + tiles[i].id;
        img.onload = function() {
            window.count--;
            if (window.count === 0) 
                window.finishedLoadingImages = true;
        }
    }
    for (let i = 0; i < spaces.length; i++) {
        if (!spaces[i].img) continue;
        window.count++;

        let img = images.create('img');
        img.src = 'img/' + spaces[i].img + '.png';
        img.id = 'imgSpace' + spaces[i].id;

        img.onload = function() {
            window.count--;
            if (window.count === 0) 
                window.finishedLoadingImages = true;
        }
    }
    for (let i = 0; i < tops.length; i++) {
        if (!tops[i].img) continue;
        window.count++;

        let img = images.create('img');
        img.src = 'img/' + tops[i].img + '.png';
        img.id = 'imgTop' + tops[i].id;

        img.onload = function() {
            window.count--;
            if (window.count === 0) 
                window.finishedLoadingImages = true; 
        }
    }
    for (let i = 0; i < mechs.length; i++) {
        if (!mechs[i].img) continue;
        window.count++;

        let img = images.create('img');
        img.src = 'img/' + mechs[i].img + '.png';
        img.id = 'imgMech' + mechs[i].id;

        img.onload = function() {
            window.count--;
            if (window.count === 0) 
                window.finishedLoadingImages = true; 
        }
    }
}


function setCanvasSize(canvas,draw) {
    draw.tiles = true;
    draw.players = true;
    draw.spaces = true;
    draw.tops = true;
    draw.mechs = false;

    let canvass = [canvas.tile.canvas,canvas.space.canvas,canvas.player.canvas,canvas.top.canvas,canvas.mech.canvas];
    for (let i = 0; i < canvass.length; i++) {
        canvass[i].style.width = (tileSize * data[0].length) + 'px';
        canvass[i].style.height = (tileSize * data.length) + 'px';
        canvass[i].width = (tileSize * data[0].length);
        canvass[i].height = (tileSize * data.length);
    }
}
function drawEverything(canvas,data,draw,player) {
    //Draw Tiles
    if(draw.tiles) drawTiles(canvas.tile.ctx,data);
    //Draw Spaces
    if(draw.spaces) {
        canvas.space.ctx.clearRect(0,0,canvas.space.width,canvas.space.height)
        drawSpaces(canvas.space.ctx,data);
    
    }
    //Draw Player
    if(draw.players) drawPlayer(canvas.player.ctx,player);
    //Draw Tops
    if(draw.tops) {
        canvas.top.ctx.clearRect(0,0,canvas.top.width,canvas.top.height)
        drawTops(canvas.top.ctx,data);
    }
    //Draw Mechs If True
    drawMechs(canvas.mech.ctx,data,player);
    //Draw Grid Lines if true
    if(draw.grid) drawGridLines(canvas.mech.ctx,data);
}

function drawPlayer(ctx,player) {
    ctx.drawImage($('imgMech' + player.img),player.pos.x,player.pos.y,tileSize,tileSize)
}
function drawGridLines(ctx,data) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    for (let i = 0; i < data.length; i++) {
        ctx.beginPath();
        ctx.moveTo(0,i * tileSize);
        ctx.lineTo(canvas.width,i * tileSize);
        ctx.stroke();
    }
    for (let j = 0; j < data[0].length; j++) {
        ctx.beginPath();
        ctx.moveTo(j * tileSize,0);
        ctx.lineTo(j * tileSize,canvas.height);
        ctx.stroke();
    }
}
function drawTiles(ctx,data) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            let tile = data[i][j].tile;
            if (!tile.render) continue;
            if (hidingIDS === tile.hwoMyID) continue;
            ctx.drawImage($('imgTile' + tile.id),((data[0].length-1)-j) * tileSize,((data.length-1)-i) * tileSize,tileSize,tileSize)
        }
    }
}
function drawSpaces(ctx,data) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            let tile = data[i][j].space;
            if (!tile.render) continue;
            if (hidingIDS === tile.hwoMyID) continue;
            ctx.drawImage($('imgSpace' + tile.id),((data[0].length-1)-j) * tileSize,((data.length-1)-i) * tileSize,tileSize,tileSize)
        }
    }
}
function drawTops(ctx,data,color) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            let tile = data[i][j].top;
            if (!tile.render) continue;
            if (hidingIDS === tile.hwoMyID) continue;
            ctx.drawImage($('imgTop' + tile.id),((data[0].length-1)-j) * tileSize,((data.length-1)-i) * tileSize,tileSize,tileSize)
        }
    }
}
function drawMechs(ctx,data,player) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            let tile = data[i][j].mech;
            //Draw Chat IF Needed
            if (tile.chat) {
                let color = tile.chat_cantInteractColor;
                if (player) {
                    if ((Math.sqrt((Math.pow(((data[0].length-1)-j)-player.tile.x,2)) + (Math.pow(((data.length-1)-i)-player.tile.y,2)))) < tile.chat_startChatDistance) {
                        color = tile.chat_canInteractColor;
                    } else {
                        if (player.chatting) {
                            if (player.chatting[0] == j && player.chatting[1] == i) {
                                player.chatting = false;
                                tile.chat_currentText = 0;
                                tile.chatting = false;
                                killChat($('chat'));
                                tile.chat_teleport = false;
                            }
                        }
                    }
                } 
                ctx.fillStyle = color;
                ctx.fillRect(((((data[0].length-1)-(j+tile.chat_xPos)) * tileSize)+((tileSize/2)-2.5)),(((data.length-1)-(i+tile.chat_yPos)) * tileSize)+(tileSize-10),5,5);
                ctx.fillRect(((((data[0].length-1)-(j+tile.chat_xPos)) * tileSize)+((tileSize/2)-3)),(((data.length-1)-(i+tile.chat_yPos)) * tileSize)+(tileSize-45),6,30);
            }
            //Draw Mech
            if(!draw.mechs) continue; 
            if (!tile.render) continue;
            if (hidingIDS === tile.hwoMyID) continue;
            ctx.drawImage($('imgMech' + tile.id),((data[0].length-1)-j) * tileSize,((data.length-1)-i) * tileSize,tileSize,tileSize)
        }
    }
}
function checkTeleportOnAll(data) {
    if (String(data.tile.teleport).includes("♣")) {
        let arr = data.tile.teleport.split("♣");
        arr[1] = arr[1].split('j');
        arr[1][0] = arr[1][0].replace("i","");
        arr[1][0] = Number(arr[1][0]);
        arr[1][1] = Number(arr[1][1]); 
        return arr; 
    }
    if (String(data.space.teleport).includes("♣")) {
        let arr = data.space.teleport.split("♣");
        arr[1] = arr[1].split('j');
        arr[1][0] = arr[1][0].replace("i","");
        arr[1][0] = Number(arr[1][0]);
        arr[1][1] = Number(arr[1][1]); 
        return arr; 
    }
    if (String(data.top.teleport).includes("♣")) {
        let arr = data.top.teleport.split("♣");
        arr[1] = arr[1].split('j');
        arr[1][0] = arr[1][0].replace("i","");
        arr[1][0] = Number(arr[1][0]);
        arr[1][1] = Number(arr[1][1]); 
        return arr; 
    }
    if (String(data.mech.teleport).includes("♣")) {
        let arr = data.mech.teleport.split("♣");
        arr[1] = arr[1].split('j');
        arr[1][0] = arr[1][0].replace("i","");
        arr[1][0] = Number(arr[1][0]);
        arr[1][1] = Number(arr[1][1]); 
        return arr; 
    }
    return false;
}

function startChat(canvas,mech) {
    let ctx = canvas.getContext('2d');
    if (mech.chat_teleport) {
        let arr = mech.chat_teleport.split("♣");
        arr[1] = arr[1].split('j');
        arr[1][0] = arr[1][0].replace("i","");
        arr[1][0] = Number(arr[1][0]);
        arr[1][1] = Number(arr[1][1]); 

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
        mech.chat_currentText = 0;
        mech.chatting = false;
        killChat($('chat'));
        return;
    }
    if (mech.chatting === true) {
        mech.chat_currentText++;
        if (mech.chat_currentText > mech.chat_texts.length - 1) {
            mech.chat_currentText = 0;
            mech.chatting = false;
            killChat(canvas);
            return;
        }
    }
    else mech.chatting = true;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //Gather Information
    let textBox = mech.chat_texts[mech.chat_currentText];
    let type = textBox.type;
    let i;
    if (type == 'random') i = rnd(0,textBox.texts.length-1)
    if (type == 'ordered') {
        if (textBox.current === textBox.texts.length) textBox.current = 0;
        i = textBox.current;
        textBox.current++;
    }
    if (textBox.texts[i].teleport) {
        mech.chat_teleport = textBox.texts[i].teleport;
    }

    //Create Character
    if (textBox.texts[i].emoticon) {
        ctx.drawImage($('img' + textBox.texts[i].emoticon.family + textBox.texts[i].emoticon.id),180,canvas.height-textBox.texts[i].emoticon.size*150-150,textBox.texts[i].emoticon.size*150,textBox.texts[i].emoticon.size*150);
    }
    //Create Chat Box
    ctx.fillStyle = textBox.texts[i].style.backgroundColor;
    ctx.beginPath();
    ctx.roundRect((canvas.width - 700)/2,canvas.height-200,700,200,10);
    ctx.fill();
    //Create Text
    let text = textBox.texts[i].text;
    ctx.fillStyle = textBox.texts[i].style.fontColor;
    ctx.font = textBox.texts[i].style.fontSize + 'px ' + textBox.texts[i].style.fontFamily;
    let lines = getLines(ctx,text,650);
    for (let j = 0; j < lines.length; j++) {
        ctx.fillText(lines[j], 280, (340+(((j+0.5)*textBox.texts[i].style.fontSize))));
    }
}
function killChat(canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0,0,canvas.width,canvas.height);
}
function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}