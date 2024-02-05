
////////////////////////
//  Needed Variables  //
////////////////////////

let htmlMap = $('map');
let map;
let games = [];
let displayingSaves = true;
let maps = [];
let currentMap = 0;
let currentGame;
let showGrid = true;
let shiftDown = false;
let controlDown = false;
let rotation = 'down';
let mouseDown =  false;
let mouseKey = false;
let selectionTool = false;
let selectionName = false;
let chooseTeleType = false;
let chooseTeleupText = false;
let chooseTele = false;
let teleOG = false;
let teleSelectT = false;
let teleSelectN = false;
let showTiles = true;
let showSpaces = true;
let showTops = true;
let showMechs = true;
let multipleTeleSelected = false;


let chooseEmoType = false;
let chooseEmoupText = false;
let chooseEmoButton = false;
let chooseEmo = false;


///////////////////
// End Variables //
/////////////////////
// Start Functions //
/////////////////////

function checkLoaded() {
    if(finishedLoadingImages === false) {
       window.setTimeout(checkLoaded, 0); /* this checks the flag every 100 milliseconds*/
    } else {
        start();
    }
}

function loadImagesFirst() {
    //Load Images
    loadAllImages();

    checkLoaded();
}
//Order Of Events.
function start() {

    //Update Maps From Cookies
    games = ls.get('SCmaps',false) ? JSON.parse(ls.get('SCmaps')) : [];

    //Create Empty Game if None Found
    if (games.length < 1) {
        games.push({
            name: "Untitled 1",
            settings: {},
            scenes: [],
        });
        games[0].scenes.push({
            name: "Untitled 1",
            data: makeMap(20,20),
            settings: {
                width: 20,
                height: 20,
            }
            
        })
        currentGame = "Untitled 1";
        currentMap = 'Untitled 1';
    } else {
        currentGame = ls.get('scCurrentGame',games[0].name);
        currentMap = ls.get('scCurrentMap',games[0].scenes[0].name);
    }

    if (findGameByName(currentGame,games).scenes.length < 1) {
        findGameByName(currentGame,games).scenes.push({
            name: "Untitled 1",
            data: makeMap(findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.width,findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.height),
            settings: {
                width: 20,
                height: 20,
            }
        });
    }

    //Update HTMLS
    $('savesHeader')[0].innerHTML = currentGame + ' -  Scenes';

    //Set Current Map
    
    currentMap = ls.get('scCurrentMap',false) ? ls.get('scCurrentMap',false) : findGameByName(currentGame,games).scenes[0].name;
    ls.save('scCurrentMap',false);

    //Loads Saved Maps
    loadMaps();

    //Draw Map
    let number = findMapByName(currentMap);
    createMap(findGameByName(currentGame,games).scenes[number].data);

    //Create Tile Options
    createOptions();

    //Switch to correct Tab
    switchTab('Tiles');

    //Load Inspecor
    loadTileInspector();

    //Fix Map Size
    fixMapSize();
}

function findMapByName(name) {
    for (let i = 0; i < findGameByName(currentGame,games).scenes.length; i++) {
        if (findGameByName(currentGame,games).scenes[i].name === name) return i;
    }
}
function createOptions() {
    if (selectionTool) {
        let multipleSelected = selectionTool.pos2 ? true : false;

        let list = [['allTiles',[$(selectionName).tile]],['allSpaces',[$(selectionName).space]],['allTops',[$(selectionName).top]],['allMechs',[$(selectionName).mech]]];
        $('layer').innerHTML = 'Layer ' + $('layer').innerHTML.charAt(6) + " - " + selectionName;
        selectedCell = list[Number($('layer').innerHTML.charAt(6))-1][1][0];

        for (let j = 0; j < list.length; j++) {
            let html = $(list[j][0]);
            let clist = list[j][1];

            html.innerHTML = '';
            for (let i = 0; i < clist.length; i++) {
                let div = html.create('div');
                div.id = 'optholder';
                div.tile = i;
                div.type = clist[i].type; 
                div.multipleSelected = multipleSelected;

                if (!multipleSelected) {

                    let imgHolder = div.create('div');
                    imgHolder.id = 'optimgHolder';
                    imgHolder.style.background = clist[i].color;
                    if (clist[i].img) {
                        let img = imgHolder.create('img');
                        img.src =   'img/' + clist[i].img + '.png';
                        if (selectedCell.name == clist[i].name && selectedCell.type == clist[i].type) {
                        }
                    }
                    
                    if (selectedCell.name == clist[i].name && selectedCell.type == clist[i].type) {
                        
                        //imgHolder.style.transform = 'rotate(90deg)' 
                        div.style.background = 'lightblue';
                    }
                    let text = div.create('div');
                    text.id ='opttext';
                    text.innerHTML = clist[i].name;
                } else {
                    
                    let imgHolder = div.create('div');
                    imgHolder.id = 'optimgHolder';
                    imgHolder.style.background = "red";
                    
                    if (selectedCell.name == clist[i].name && selectedCell.type == clist[i].type) {
                        
                        //imgHolder.style.transform = 'rotate(90deg)' 
                        div.style.background = 'lightblue';
                    }
                    let text = div.create('div');
                    text.id ='opttext';
                    text.innerHTML = "Layer " + clist[i].type;
                }



                div.onclick = function() {
                    this.trigger();
                }
                div.trigger = function() {
                    selectedCell = clist[this.tile];
                    loadTileInspector(this.multipleSelected,div.type);
                    createOptions();

                    if (this.type == 'tile') $('rsbrFillTiles').style.display = 'block';
                    else $('rsbrFillTiles').style.display = 'none';
                }
            }
        }
        loadTileInspector(multipleSelected);
    } else {
        let list = [['allTiles',tiles],['allSpaces',spaces],['allTops',tops],['allMechs',mechs]];
        for (let j = 0; j < list.length; j++) {
            let html = $(list[j][0]);
            let clist = list[j][1];

            html.innerHTML = '';
            for (let i = 0; i < clist.length; i++) {
                let div = html.create('div');
                div.id = 'optholder';
                div.tile = i;
                div.type = clist[i].type;

                let imgHolder = div.create('div');
                imgHolder.id = 'optimgHolder';
                imgHolder.style.background = clist[i].color;
                if (clist[i].img) {
                    let img = imgHolder.create('img');
                    img.src = 'img/' + clist[i].img + '.png';
                }
                
                if (selectedCell.name == clist[i].name && selectedCell.type == clist[i].type) {
                    
                    //imgHolder.style.transform = 'rotate(90deg)' 
                    div.style.background = 'lightblue';
                }


                let text = div.create('div');
                text.id ='opttext';
                text.innerHTML = clist[i].name;

                div.onclick = function() {
                    selectedCell = clist[this.tile];
                    loadTileInspector();
                    createOptions();
                    rotation = 'down';

                    if (this.type == 'tile') $('rsbrFillTiles').style.display = 'block';
                    else $('rsbrFillTiles').style.display = 'none';
                }
            }
        }
    }
}
function loadAttributes(multipleSelected = false) {
    let body = $('rsblaBody');
    body.innerHTML = '';
    if (multipleSelected) {
        if (selectedCell.teleport !== undefined) createAtr('Teleport',selectedCell.teleport,true,multipleSelected);
    } else {
        if (selectedCell.type !== undefined) createAtr('Type',selectedCell.type,false);
        if (selectedCell.walkable !== undefined) createAtr('Walkable',selectedCell.walkable,true);
        if (selectedCell.speed !== undefined) createAtr('Speed',selectedCell.speed,true);
        if (selectedCell.teleport !== undefined) createAtr('Teleport',selectedCell.teleport,true);
        if (selectedCell.hideWhenOn !== undefined) createAtr('Hide_When_On',selectedCell.hideWhenOn,true);
        if (selectedCell.hwoID !== undefined) createAtr('HWO_ID',selectedCell.hwoID,true);
        if (selectedCell.hwoMyID !== undefined) createAtr('HWO_My_ID',selectedCell.hwoMyID,true);
        if (selectedCell.render !== undefined) createAtr('Render',selectedCell.render,true);
    
        if (selectedCell.chat !== undefined) createAtr('Chat',selectedCell.chat,true);
    
        if (selectedCell.id !== undefined) createAtr('ID',selectedCell.id,false);
        if (selectedCell.color !== undefined) createAtr('Color',selectedCell.color,false);
        if (selectedCell.name !== undefined) createAtr('Name',selectedCell.name,false);
        if (selectedCell.img !== undefined) createAtr('Image',selectedCell.img,false);
        if (selectedCell.testPlayFromHere !== undefined) createAtr('Test_Play_From_Here',selectedCell.testPlayFromHere,false);
        if (selectedCell.draw !== undefined) createAtr('Draw_On_Mini_Maps',selectedCell.draw,false);
    }
}
let listOfAtt = [
    {
        att: "Type",
        title: "Which Layer This Cell Will Appear",
        value: ["tile","space","top","mech"],
    },
    {
        att: "Walkable",
        title: "If The Player Can Walk On This Cell",
        value: ["true","false"],
    },
    {
        att: "Speed",
        title: "When Player Is Walking Over This Cell, The Players Speed Is Multiplied By This Calls Value",
        value: ["Any Number"],
    },
    {
        att: "Teleport",
        title: "Teleports The Player To Another Cell",
        value: ["Click Cell On Any Map In Game"],
    },
    {
        att: "Hide_When_On",
        title: "When Player Is On This Cell, Every Cell whose HWO_My_ID Match This Cells HWO_ID Will Hide For As Long As The Player Is On This Cell",
        value: [true,false],
    },
    {
        att: "HWO_ID",
        title: "If This Cells Hide_When_On is True, Every Cell whose WHY_My_ID Match This Cells HWO_ID Will Hide For As Long As The Player Is On This Cell",
        value: ["Any Value"],
    },
    {
        att: "HWO_My_ID",
        title: "",
        value: ["Any Value"],
    },
    {
        att: "ID",
        title: "",
        value: ["Any Number"],
    },
    {
        att: "Color",
        title: "Color Cell Appears On Mini Maps, Also The Color Behind for Transparent Images",
        value: ["Any Color (Hex/RGB/Name)"],
    },
    {
        att: "Name",
        title: "",
        value: ["Any Value"],
    },
    {
        att: "Image",
        title: "",
        value: ["URL To IMG"],
    },
    {
        att: "Draw_On_Mini_Maps",
        title: "",
        value: [true,false],
    },
    {
        att: "Render",
        title: "If The Game Will Render This Tile",
        value: [true,false],
    }
];
function createAtr(first,second,clickable,multipleSelected) {
    let body = $('rsblaBody');
    let holder, div1, div2;

    holder = body.create('holder');
    holder.className = 'atrHolder';
    div1 = holder.create('div');
    div1.className = 'atrName';
    div1.innerHTML = first + ": ";

    let titleFound = false;
    for (let i = 0; i < listOfAtt.length; i++) {
        if (listOfAtt[i].att === first) titleFound = "[" + String(listOfAtt[i].value).replaceAll(',','/') + '] ' + listOfAtt[i].title;
    }
    if (titleFound) div1.title = titleFound;

    div2 = holder.create('div');
    div2.className = clickable ? 'atrClick' : 'atrNoclick';
    div2.innerHTML = second;
    div2.div1 = div1.innerHTML;
    div2.id = 'atr' + first;
    if (clickable) div2.onclick = function() {
        let value;
        if (this.div1 !== 'Teleport: ' && this.div1 !== 'Chat: ') {
            value = prompt("Change Value",this.innerHTML);

            if (value === '' || value == undefined) return;
            this.innerHTML = value;
            if (selectionName) {
                selectedCell = checkAttributes();
                if(selectedCell.type == 'tile') $(selectionName).tile = selectedCell;
                if(selectedCell.type == 'space') $(selectionName).space = selectedCell;
                if(selectedCell.type == 'top') $(selectionName).top = selectedCell;
                if(selectedCell.type == 'mech') $(selectionName).mech = selectedCell;
                save();
            }
        }
        if (this.div1 == 'Teleport: ') {
            if (multipleSelected) {
                multipleTeleSelected = true;
            }
            chooseTeleType = 'att';
            chooseTele = true;
            teleOG = currentMap;
            teleSelectT = selectionTool;
            teleSelectN = selectionName;

            this.innerHTML = "Click Cell To Teleport To";
        }
        if (this.div1 == 'Chat: ') {
            $('chatPopUp').style.display = 'block';
            for (let i = 0; i < $('.MAText').length; i++) {
                $('.MAText')[i].addEventListener('input',function() {
                    selectedCell.chat_startChatDistance = Number($('maStartChatDistance').value);
                    selectedCell.chat_exitChatDistance = Number($('maExitChatDistance').value);
                    selectedCell.chat_cantInteractColor = $('maCantInteractColor').value;
                    selectedCell.chat_canInteractColor = $('maCanInteractColor').value;
                    selectedCell.chat_yPos = Number($('maYpos').value);
                    selectedCell.chat_xPos = Number($('maXpos').value);
                    selectedCell.selectedCell = $('maChatRepeats').value;
                    newSave();
                })
            }

            $('maStartChatDistance').value = selectedCell.chat_startChatDistance;
            $('maStartChatDistanceValue').innerHTML = selectedCell.chat_startChatDistance;
            $('maExitChatDistance').value = selectedCell.chat_exitChatDistance;
            $('maExitChatDistanceValue').innerHTML = selectedCell.chat_exitChatDistance;

            $('maCantInteractColor').value = selectedCell.chat_cantInteractColor;
            $('maCanInteractColor').value = selectedCell.chat_canInteractColor;
            
            $('maYpos').value = selectedCell.chat_yPos;
            $('maYposValue').innerHTML = selectedCell.chat_yPos;
            $('maXpos').value = selectedCell.chat_xPos;
            $('maXposValue').innerHTML = selectedCell.chat_xPos;
            
            $('maChatRepeats').value = selectedCell.chat_repeat;

            generateChats();
        }
    }
}
function generateChats() {
    
    $('allTexts').innerHTML = '';
    //Create Add Bar
    let holder = $('allTexts').create('div');
    holder.className = 'atHolder';
    let title = holder.create('div');
    title.className = 'atTitle2';
    title.innerHTML = "Add Chat";
    title.onclick = function() {
        selectedCell.chat_texts.push({
            texts: [
                {
                    text: "Hello World",
                    emoticon: {
                        family: "Space",
                        id: 5,
                        yPos: 0,
                        xPos: 0,
                        size: 1
                    },
                    teleport: false,
                    style: {
                        fontSize: 25,
                        fontFamily: "Arial",
                        fontColor: "#000000",
                        backgroundColor: "#ffffff",
                    }
                },
            ],
            type: ('random'), //Random/Ordered
            current: 0,
        })
        generateChats();
        newSave();
    }

    //Create Chat Options
    for (let i = 0; i < selectedCell.chat_texts.length; i++) {
        let textBox = selectedCell.chat_texts[i];

        let holder = $('allTexts').create('div');
        holder.className = 'atHolder';
        let title = holder.create('div');
        title.className = 'atTitle';
        title.id = 'notIt';
        title.innerHTML = "Chat " + (i+1);
        title.texts = textBox;
        title.i = i;
        title.onclick = function() {
            for (let i = 0; i < $('.atTitle').length; i++) {
                $('.atTitle')[i].id = 'notIt';
                $('.atTitle')[i].body.innerHTML = "";
            }
            this.id = 'isIt';
            this.body.innerHTML = '';
            //Create Add Bar
            let holder2 = this.body.create('div');
            holder2.className = 'athHolder3';
            holder2.innerHTML = 'Add Text'
            holder2.texts = this.texts;
            holder2.onclick = function() {
                this.texts.texts.push(
                        {
                            text: "Hello World",
                            emoticon: {
                                family: selectedCell.type.charAt(0) + selectedCell.type.substring(1,selectedCell.length),
                                id: selectedCell.id,
                                yPos: 0,
                                xPos: 0,
                                size: 1
                            },
                            teleport: false,
                            style: {
                                fontSize: 25,
                                fontFamily: "Arial",
                                fontColor: "#000000",
                                backgroundColor: "#ffffff",
                            }
                        },
                )
                generateChats();
                newSave();
            }

            //Create Other Options
            let hold = this.body.create('div');
            hold.className = 'atHold';
            
           
            let type = hold.create('div');
            type.className = 'atSelect';
            type.innerHTML = 'Order Type: ';
            let select = hold.create('select');
            select.className = 'atSelect';
            select.upText = this.texts;
            select.onchange = function() {
                this.upText.type = this.value;
                newSave();
            }
            let option;
            option = select.create('option');
            option.value = 'random';
            option.innerHTML = 'Random';

            option = select.create('option');
            option.value = 'ordered';
            option.innerHTML = 'Ordered';

            select.value = this.texts.type;

            //Create All Text Options
            for (let i = 0; i < this.texts.texts.length; i++) {
                let holder = this.body.create('div');
                holder.className = 'athHolder';

                let title = holder.create('div');
                title.className = 'athTitle';
                title.text = this.texts.texts[i];
                title.all = this.texts.texts;
                title.i = i;
                title.innerHTML = 'Text ' + (i+1) + ' - ' + this.texts.texts[i].text.substring(0,20);
                title.id = 'notIt2';
                title.onclick = function() {
                    for (let i = 0; i < $('.athTitle').length; i++) {
                        $('.athTitle')[i].id = 'notIt2';
                        $('.athTitle')[i].body.innerHTML = "";
                    }
                    this.id = 'isIt2';

                    //Create Delete Bar
                    let holder2 = this.body.create('div');
                    holder2.className = 'athHolder2';
                    holder2.innerHTML = 'Delete Text'
                    holder2.text = this.text;
                    holder2.all = this.all;
                    holder2.i = this.i;
                    holder2.onclick = function() {
                        this.all.splice(this.i,1);
                        generateChats();
                        newSave();
                    }
                    //Create Text Options
                    let teleportText = this.body.create('div');
                    teleportText.innerHTML = 'When Finished Teleport To: ';
                    teleportText.className = 'MAText';
                    teleportText.upText = this.text;
                    let teleportInput = this.body.create('button');
                    teleportInput.innerHTML = this.text.teleport;
                    teleportInput.text = this.text;
                    teleportInput.className = 'MAText';
                    teleportInput.onclick = function() {
                        
                        chooseTeleType = 'chat';
                        chooseTeleupText = this.text;
                        chooseTeleButton = this;
                        chooseTele = true;
                        teleOG = currentMap;
                        teleSelectT = selectionTool;
                        teleSelectN = selectionName;
                        $('chatPopUp').style.display = 'none';

                    }

                    this.body.create('br');

                    let textField = this.body.create('textArea');
                    textField.innerHTML = this.text.text;
                    textField.upText = this.text;
                    textField.id = 'deTextArea';
                    textField.oninput = function() {
                        this.upText.text = this.value;
                        newSave();
                    }

                    let leftSide = this.body.create('div');
                    leftSide.id = 'daLeft';
                    let rightSide = this.body.create('div');
                    rightSide.id = 'daRight';

                    let lHead = leftSide.create('div');
                    lHead.id = 'dalHead';
                    lHead.innerHTML = "Emoticon Settings";

                    let chooseEmoticonText = leftSide.create('div');
                    chooseEmoticonText.innerHTML = 'Choose Emoticon: ';
                    chooseEmoticonText.className = 'MAText';
                    let chooseEmoticon = leftSide.create('button');
                    chooseEmoticon.innerHTML = this.text.emoticon.family + this.text.emoticon.id;
                    chooseEmoticon.chosenFamily = this.text.emoticon.family;
                    chooseEmoticon.chosenId = this.text.emoticon.id;
                    chooseEmoticon.className = 'MAText';
                    chooseEmoticon.upText = this.text;
                    chooseEmoticon.onclick = function() {
                        let family = prompt("Family");
                        let id = prompt("ID");
                        this.upText.emoticon.family = family;
                        this.upText.emoticon.id = Number(id); 
                        this.innerHTML = family + id;
                        newSave();
                    }

                    leftSide.create('br');

                    let yPosText = leftSide.create('div');
                    yPosText.innerHTML = "Y Position";
                    yPosText.className = 'MAText';
                    let yPosInput = leftSide.create('input');
                    yPosInput.className = 'MAText';
                    yPosInput.type = 'range';
                    yPosInput.min = -10;
                    yPosInput.max = 10;
                    yPosInput.value = this.text.emoticon.yPos;
                    yPosInput.upText = this.text;
                    yPosInput.oninput = function() {
                        this.upText.emoticon.yPos = this.value;
                        newSave();
                    }

                    leftSide.create('br');

                    let xPosText = leftSide.create('div');
                    xPosText.innerHTML = "X Position";
                    xPosText.className = 'MAText';
                    let xPosInput = leftSide.create('input');
                    xPosInput.className = 'MAText';
                    xPosInput.type = 'range';
                    xPosInput.min = -10;
                    xPosInput.max = 10;
                    xPosInput.value = this.text.emoticon.xPos;
                    xPosInput.upText = this.text;
                    xPosInput.oninput = function() {
                        this.upText.emoticon.xPos = this.value;
                        newSave();
                    }

                    leftSide.create('br');

                    let sizeText = leftSide.create('div');
                    sizeText.innerHTML = "Size";
                    sizeText.className = 'MAText';
                    let sizeInput = leftSide.create('input');
                    sizeInput.className = 'MAText';
                    sizeInput.type = 'range';
                    sizeInput.min = -5;
                    sizeInput.max = 5;
                    sizeInput.value = this.text.emoticon.size;
                    sizeInput.upText = this.text;
                    sizeInput.oninput = function() {
                        this.upText.emoticon.size = this.value;
                        newSave();
                    }

                    //Right Side

                    let rHead = rightSide.create('div');
                    rHead.id = 'darHead';
                    rHead.innerHTML = 'Text Style Settings'

                    rightSide.create('br');

                    let fontSizeText = rightSide.create('div');
                    fontSizeText.innerHTML = "Font Size";
                    fontSizeText.className = 'MAText';
                    let fontSizeInput = rightSide.create('input');
                    fontSizeInput.className = 'MAText';
                    fontSizeInput.value = this.text.style.fontSize;
                    fontSizeInput.upText = this.text;
                    fontSizeInput.oninput = function() {
                        this.upText.style.fontSize = this.value;
                        newSave();
                    }

                    rightSide.create('br');

                    let fontFamilyText = rightSide.create('div');
                    fontFamilyText.innerHTML = "Font Family";
                    fontFamilyText.className = 'MAText';
                    let fontFamilyInput = rightSide.create('input');
                    fontFamilyInput.className = 'MAText';
                    fontFamilyInput.value = this.text.style.fontFamily;
                    fontFamilyInput.upText = this.text;
                    fontFamilyInput.oninput = function() {
                        this.upText.style.fontFamily = this.value;
                        newSave();
                    }

                    rightSide.create('br');

                    let fontColorText = rightSide.create('div');
                    fontColorText.innerHTML = "Font Color";
                    fontColorText.className = 'MAText';
                    let fontColorInput = rightSide.create('input');
                    fontColorInput.className = 'MAText';
                    fontColorInput.type = 'color';
                    fontColorInput.value = this.text.style.fontColor;
                    fontColorInput.upText = this.text;
                    fontColorInput.oninput = function() {
                        this.upText.style.fontColor = this.value;
                        newSave();
                    }

                    rightSide.create('br');

                    let backgroundColorText = rightSide.create('div');
                    backgroundColorText.innerHTML = "Background Color";
                    backgroundColorText.className = 'MAText';
                    let backgroundColorInput = rightSide.create('input');
                    backgroundColorInput.className = 'MAText';
                    backgroundColorInput.type = 'color';
                    backgroundColorInput.value = this.text.style.backgroundColor;
                    backgroundColorInput.upText = this.text;
                    backgroundColorInput.oninput = function() {
                        this.upText.style.backgroundColor = this.value;
                        newSave();
                    }

                    
                }

                let body = holder.create('div');
                body.id = 'daBody';
                title.body = body;
            }
            //Create Delete Button
            let holder = this.body.create('div');
            holder.className = 'athHolder2';
            holder.innerHTML = 'Delete Chat'
            holder.i = this.i;
            holder.onclick = function() {
                selectedCell.chat_texts.splice(this.i,1);
                generateChats();
                newSave();
            }
        }

        let body = holder.create('div');
        body.className = 'atBody';

        title.body = body;

    }
}
function hideLayer(type) {
    if (type == 'tile') {
        showTiles = showTiles ? false : true;
        $('extBot1').className = 'extBot ' + (showTiles ? "extBotShow" : "extBotHide");
    }
    if (type == 'space') {
        showSpaces = showSpaces ? false : true;
        $('extBot2').className = 'extBot ' + (showSpaces ? "extBotShow" : "extBotHide");
    }
    if (type == 'top') {
        showTops = showTops ? false : true;
        $('extBot3').className = 'extBot ' + (showTops ? "extBotShow" : "extBotHide");
    }
    if (type == 'mech') {
        showMechs = showMechs ? false : true;
        $('extBot4').className = 'extBot ' + (showMechs ? "extBotShow" : "extBotHide");
    }
    createMap(findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data);
}
function checkAttributes() {
    let trueCell = structuredClone(selectedCell);

    if (selectedCell.walkable !== undefined) trueCell.walkable = checkATR('Walkable');
    if (selectedCell.speed !== undefined) trueCell.speed = checkATR('Speed');
    if (selectedCell.teleport !== undefined) trueCell.teleport = checkATR('Teleport');

    if (selectedCell.hideWhenOn !== undefined) trueCell.hideWhenOn = checkATR('Hide_When_On');
    if (selectedCell.hwoID !== undefined) trueCell.hwoID = checkATR('HWO_ID');
    if (selectedCell.hwoMyID !== undefined) trueCell.hwoMyID = checkATR('HWO_My_ID');

    if (selectedCell.render !== undefined) trueCell.render = checkATR('Render');

    return trueCell;
}
function checkATR(type) {
    let value = $('atr' + type).innerHTML;
    if (value == 'false') value = false;
    if (value == 'true') value = true;
    if (!isNaN(value) && value !== false && value !== true) value = Number(value);
    return value;
}
function checkAttributesFromID(type,ogs,ne) {
    let og = returnObj(type,ogs);
    let string = '';

    if (ne.walkable !== undefined) if(og.walkable !== ne.walkable) string += "[00w<>" + ne.walkable + ']';
    if (ne.speed !== undefined) if(og.speed !== ne.speed) string += "[00s<>" + ne.speed + ']';
    if (ne.teleport !== undefined) if(og.teleport !== ne.teleport) string += "[0t0<>" + ne.teleport + ']';
    if (ne.hideWhenOn !== undefined) if(og.hideWhenOn !== ne.hideWhenOn) string += "[00h<>" + ne.hideWhenOn + ']';
    if (ne.hwoID !== undefined) if(og.hwoID !== ne.hwoID) string += "[0h0<>" + ne.hwoID + ']';
    if (ne.hwoMyID !== undefined) if(og.hwoMyID !== ne.hwoMyID) string += "[0hh<>" + ne.hwoMyID + ']';
    if (ne.render !== undefined) if(og.render !== ne.render) string += "[00r<>" + ne.render + ']';

    return string;
}
function createMap(map) {
    fixMapSize();
    htmlMap.innerHTML = '';
    for (let i = 0; i < map.length; i++) {
        let tr = htmlMap.insertRow(0);
        for (let j = 0; j < map[0].length; j++) {
            let tile = map[i][j];
            let cell = tr.insertCell(0);

            cell.tile = tile.tile;
            cell.space = tile.space;
            cell.mech = tile.mech;
            cell.top = tile.top;

            cell.id = 'i' + i + 'j' + j;
            if (cell.id == selectionName) cell.style.outline = '2px solid red';
            cell.i = i;
            cell.j = j;

            loadTile(i,j);
            
            cell.onmousedown = function(e) {
                if (chooseTele) return;
                if (e.button !== 0) return;
                if (!selectedCell) return;

                let specialAtrCell = checkAttributes();


                if (selectedCell.type == 'tile') this.tile = specialAtrCell;
                if (selectedCell.type == 'space') this.space = specialAtrCell;
                if (selectedCell.type == 'mech') this.mech = specialAtrCell;
                if (selectedCell.type == 'top') this.top = specialAtrCell;

                if (selectedCell.chat === true) {
                    this.mech.chat_texts[0].texts[0].emoticon.family = this.space.type.charAt(0).toUpperCase() + this.space.type.substring(1,this.space.type.length);
                    this.mech.chat_texts[0].texts[0].emoticon.id = this.space.id;
                }

                loadTile(this.i,this.j)
                findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data = converTableToAMap();
                
                newSave()

                //drawEverything($("rsbrCanvas"),findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data,false,false,false,true,false,false)
                //drawEverything($("canvas" + fixNameForID(currentMap)),findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data,false,false,false,true,false,false)
            }
            cell.onmouseup = function() {
                
                if (chooseTele) {
                    let teleList = false;
                    if (multipleTeleSelected) {
                        teleList = [];
                        if (selectionTool.pos.i == selectionTool.pos2.i) {
                            for (let i = 0; i < selectionTool.cells.length; i++) {
                                if ($("i" + this.i + "j" + (this.j-i))) teleList.push(currentMap + "♣" +  $("i" + this.i + "j" + (this.j-i)).id);
                            }
                        }
                        if (selectionTool.pos.j == selectionTool.pos2.j) {
                            for (let i = 0; i < selectionTool.cells.length; i++) {
                                if ($("i" + (this.i-i) + "j" + this.j)) teleList.push(currentMap + "♣" +  $("i" + (this.i-i) + "j" + this.j).id);
                            }
                        }
                    }
                    chooseTele = currentMap + "♣" +  this.id;

                    currentMap = teleOG;
                    loadMaps();
                    selectionName = teleSelectN;
                    selectionTool = teleSelectT;

                    if (chooseTeleType == 'att') {
                        if (teleList) {
                            $('atrTeleport').innerHTML = "Multiple Selected";
                            for (let i = 0; i < selectionTool.cells.length; i++) {
                                if (teleList[i]) $("i" + selectionTool.cells[(selectionTool.cells.length-1) - i].i + "j" + selectionTool.cells[(selectionTool.cells.length-1) - i].j).mech.teleport = teleList[i];
                            }
                        } else {
                            $('atrTeleport').innerHTML = chooseTele;
                            selectedCell.teleport = chooseTele;
                            createOptions();
                        }
                        
                    }
                    if (chooseTeleType == 'chat') {
                        $('chatPopUp').style.display = 'block';
                        chooseTeleupText.teleport = chooseTele;
                        chooseTeleButton.innerHTML = chooseTele;
                        if (selectionName) $(selectionName).style.outline = '2px solid red';
                    }
                    chooseTele = false;
                    multipleTeleSelected = false;
                    
                    newSave();
                    return;
                }

                if (mouseKey != 'middle') return;
                if (shiftDown) {
                    selectionTool.tile2 = this.tile;
                    selectionTool.space2 = this.space;
                    selectionTool.top2 = this.top;
                    selectionTool.mech2 = this.mech;
                    selectionTool.pos2 =  {
                        i: this.i,
                        j: this.j,
                    }
                    selectionTool.cells = [];

                    let lowi = selectionTool.pos.i < selectionTool.pos2.i ? selectionTool.pos.i : selectionTool.pos2.i;
                    let highi = selectionTool.pos.i > selectionTool.pos2.i ? selectionTool.pos.i : selectionTool.pos2.i;
                    let lowj = selectionTool.pos.j < selectionTool.pos2.j ? selectionTool.pos.j : selectionTool.pos2.j;
                    let highj = selectionTool.pos.j > selectionTool.pos2.j ? selectionTool.pos.j : selectionTool.pos2.j;

                    for (let i = 0; i < map.length; i++) {
                        for (let j = 0; j < map[0].length; j++) {
                            let ignore = true;
                            if (selectionTool.pos.i == selectionTool.pos2.i) {
                                if (j <= highj && j >= lowj && i === selectionTool.pos.i) {
                                    selectionTool.cells.push({i: i, j: j});
                                    $('i' + i + 'j' + j).style.outline = '1px solid red';
                                    ignore = false;
                                }
                            }
                            if (selectionTool.pos.j == selectionTool.pos2.j) {
                                if (i <= highi && i >= lowi && j === selectionTool.pos.j) {
                                    selectionTool.cells.push({i: i, j: j});
                                    $('i' + i + 'j' + j).style.outline = '1px solid red';
                                    ignore = false;
                                }
                            }
                            if (ignore) {
                                $('i' + i + 'j' + j).style.outline = 'none';
                            }
                        }
                    }
                    createOptions();
                    return;
                }

                selectionTool = {
                    tile: this.tile,
                    space: this.space,
                    top: this.top,
                    mech: this.mech,
                    pos: {
                        i: this.i,
                        j: this.j,
                    }
                }
                selectionName = this.id;
                for (let i = 0; i < map.length; i++) {
                    for (let j = 0; j < map[0].length; j++) {
                        $('i' + i + 'j' + j).style.outline = 'none';
                    }
                }

                this.style.outline = '2px solid red';
                createOptions();
            }
            cell.onmouseover = function(e) { 
                if (chooseTele) return;
                if (!mouseDown) return;
                if (mouseKey !== 'left') return;
                if (!selectedCell) return;

                let specialAtrCell = checkAttributes();

                if (selectedCell.type == 'tile') this.tile = specialAtrCell;
                if (selectedCell.type == 'space') this.space = specialAtrCell;
                if (selectedCell.type == 'mech') this.mech = specialAtrCell;
                if (selectedCell.type == 'top') this.top = specialAtrCell;

                findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data = converTableToAMap();
                loadTile(this.i,this.j)
                newSave()

                //drawEverything($("rsbrCanvas"),findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data,false,false,false,true,false,false)
                //drawEverything($("canvas" + fixNameForID(currentMap)),findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data,false,false,false,true,false,false)
            }
        }
    }
    findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data = converTableToAMap();
}
function fixNameForID(name) {
    let goodCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newName = '';
    for (let i = 0; i < name.length; i++) {
        if (goodCharacters.includes(name.charAt(i))) {
            newName += name.charAt(i);
        } else newName += 'azu';
    }
    return newName;
}
function loadTile(y,x) {
    let cell = $('i' + y + 'j' + x);
    let tile = cell.tile;
    let space = cell.space;
    let top = cell.top;
    let mech = cell.mech;

    let text = '';
    let otherText = '';
    if (mech.img && showMechs) {
        text += 'url(img/' + mech.img + '.png)';
        otherText += ', center center';
    }
    if (top.img && showTops) {
        text += ', url(img/' + top.img + '.png)';
        otherText += ', center center';
    }
    if (space.img && showSpaces) {

        text += ', url(img/' + space.img + '.png)';
        otherText += ', center center';
    }
    if (tile.img && showTiles) {
        text += ', url(img/' + tile.img + '.png)';
        otherText += 'center center';
    }

    //Fix Text In Case Mechs Are Hidden
    if (text.charAt(0) == ',') text = text.substring(2,text.length);
    
    cell.style.background = text;
    cell.style.backgroundPosition = otherText;
}

function makeMap(cols,rows) {
    let returnMap = [];
    for (let i = 0; i < rows; i++) {
        let returnRow = [];
        for (let j = 0; j < cols; j++) {
            returnRow.push({
                tile: tiles[2], //Grass
                space: spaces[0], //Air - Item/Space on Tile
                mech: mechs[0],
                top: tops[0],
            })
        }
        returnMap.push(returnRow);
    }
    return returnMap;
}


function save() {
    findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data = converTableToAMap();
    newSave()
    loadMaps();
}

function switchTab(type) {
    let layer = 1;
    $('allTiles').style.display = 'none';
    $('allSpaces').style.display = 'none';
    $('allTops').style.display = 'none';
    $('allMechs').style.display = 'none';

    for (let i = 1; i < 5; i++) {
        $('header' + i).className = 'header plain';
    }
    if (type == "Tiles") layer = 1;
    if (type == "Spaces") layer = 2;
    if (type == "Tops") layer = 3;
    if (type == "Mechs") layer = 4;

    $('layer').innerHTML = 'Layer ' + layer + (selectionTool ? " - " + selectionName : "");

    if (type == 'Tiles') {
        $('allTiles').style.display = 'block';
        $('header1').className = 'header cool';
        if (selectionTool) $('allTiles').$('optholder').trigger();
    }
    if (type == 'Spaces') {
        $('allSpaces').style.display = 'block';
        $('header2').className = 'header cool';
        if (selectionTool) $('allSpaces').$('optholder').trigger();
    }
    if (type == 'Tops') {
        $('allTops').style.display = 'block';
        $('header3').className = 'header cool';
        if (selectionTool) $('allTops').$('optholder').trigger();
    }
    if (type == 'Mechs') {
        $('allMechs').style.display = 'block';
        $('header4').className = 'header cool';
        if (selectionTool) $('allMechs').$('optholder').trigger();
    }
}

function fixMapSize() {
    let htmlMap = $('map');
    let width = tileSize*findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.width;
    let height = tileSize*findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.height;

    htmlMap.style.height = height + 'px';
    htmlMap.style.width = width + 'px';

    htmlMap.style.left = (($('body').offsetWidth - htmlMap.offsetWidth) / 2) + 'px';
    htmlMap.style.top = (($('body').offsetHeight - htmlMap.offsetHeight) / 2) + 'px';

}
function loadMaps() {
    $('savesList').innerHTML = '';
    for (let i = 0; i < findGameByName(currentGame,games).scenes.length; i++) {
        let scene = findGameByName(currentGame,games).scenes[i];
        let holder = $('savesList').create('div');
        holder.id = 'savesHolder';
        holder.name = scene.name;

        if (currentMap == scene.name)
        holder.id = 'SelectedHolder';

        let canvas = holder.create('canvas');
        canvas.className = 'savesCanvas';
        canvas.id = 'canvas' + fixNameForID(scene.name);
        canvas.height = 40;
        canvas.width = 40;
        canvas.style.height = '40px';
        canvas.style.width = '40px';
        //drawEverything(canvas,scene.data,false,false,false,true,false,false)

        let name = holder.create('div');
        name.id = 'savesName';
        name.innerHTML = scene.name;
        name.name = scene.name;
        holder.onclick = function() {
            if (!multipleTeleSelected) {
                selectionName = false;
                selectionTool = false;

            }
            currentMap = this.name;
            loadMaps();
            
            let number = findMapByName(currentMap);
            createMap(findGameByName(currentGame,games).scenes[number].data);
            createOptions();
        }

    }
    //Save All Maps
    newSave()
    //Load Insport
    loadMapInspector('map');
    //Create Big Map
    let number = findMapByName(currentMap);
    createMap(findGameByName(currentGame,games).scenes[number].data);
    
    ls.save('scCurrentGame',currentGame);
    ls.save('scCurrentMap',currentMap);
}
function renameMap() {
    let newName = prompt('New Name');
    if (newName === null || newName === '') return;

    let list = displayingSaves ? findGameByName(currentGame,games).scenes : games;

    let number2 = 1;
    let display = '';
    for (let i = 0; i < list.length; i++) {
        if (list[i].name === newName + display) {
            number2++;
            display = ' ' + number2;
            i = 0;
        }
    } 
    if (number2 > 1) newName = newName + ' ' + number2;

    let found;
    for (let i = 0; i < games.length; i++) {
        if (games[i].name == currentGame) found = i;
    }

    displayingSaves ? findGameByName(currentGame,games).scenes[findMapByName(currentMap)].name = newName : games[found].name = newName;
    displayingSaves ? currentMap = newName : currentGame = newName;
    displayingSaves ? loadMaps() : loadGames();
    
    newSave()
}
function newMap() {
    let name = prompt('Name Of New Map')
    if (name === null) return;
    
    let width = prompt("New Scene Width");
    if (isNaN(width) || width < minWorldWidth || width > maxWorldWidth) return;
    width = Number(width);
    let height = prompt("New Scene Height");
    if (isNaN(height) || height < minWorldHeight || height > maxWorldHeight) return;
    height = Number(height);

    let number = 1;
    let number2 = 1;
    for (let i = 0; i < findGameByName(currentGame,games).scenes.length; i++) {
        if (findGameByName(currentGame,games).scenes[i].name.includes("Untitled")) number++;
        if (findGameByName(currentGame,games).scenes[i].name === name) number2++;
    } 
    if (name === '') name = "Untitled " + number;
    if (number2 > 1) name = name + ' ' + number2;
    findGameByName(currentGame,games).scenes.push({
        name: name,
        data: makeMap(width,height),
        settings: {
            width: width,
            height: height,
        }
    });

    currentMap = name;
    loadMaps();
}

//Hard Save Single/Current Map
function saveMap() { 
    convertTableToMap();

    console.log(convertTableToMap());
}
function fillTiles() {
    for (let i = 0; i < findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.height; i++) {
        for (let j = 0; j < findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.width; j++) {
            let cell = $('i' + i + 'j' + j);
            cell.tile = checkAttributes();
            loadTile(i,j)
        }
    }
    
    findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data = converTableToAMap();
    newSave()
    loadMaps();
}
function converTableToAMap() {
    let map = [];
    for (let i = 0; i < findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.height; i++) {
        let row = [];
        for (let j = 0; j < findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.width; j++) {
            let cell = $('i' + i + 'j' + j);
            row.push({
                tile: cell.tile,
                space: cell.space,
                top: cell.top,
                mech: cell.mech,
            })
        }
        map.push(row)
    }
    return map;
}
function convertTableToMap() {
    //Convert Table to a map
    let string = '';
    for (let i = 0; i < findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.height; i++) {
        for (let j = 0; j < findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.width; j++) {
            let cell = $('i' + i + 'j' + j);

            string += cell.tile.id + checkAttributesFromID('tile',cell.tile.id,cell.tile);
            string += '-';
            string += cell.space.id + checkAttributesFromID('space',cell.space.id,cell.space);
            string += '-';
            string += cell.top.id + checkAttributesFromID('top',cell.top.id,cell.top);
            string += '-';
            string += cell.mech.id + checkAttributesFromID('mech',cell.mech.id,cell.mech);
            if (j < findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.width-1) string += ',';
        }
        if (i < findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.height-1) string += "/"
    }
    return string;
}
function convertSaveObjectToString(save) {
    let string = '';
    for (let i = 0; i < save.length; i++) {
        for (let j = 0; j < save[0].length; j++) {
            let cell = save[i][j];
            string += cell.tile.id + checkAttributesFromID('tile',cell.tile.id,cell.tile);
            string += '-';
            string += cell.space.id + checkAttributesFromID('space',cell.space.id,cell.space);
            string += '-';
            string += cell.top.id + checkAttributesFromID('top',cell.top.id,cell.top);
            string += '-';
            string += cell.mech.id + checkAttributesFromID('mech',cell.mech.id,cell.mech);
            if (j < save[0].length-1) string += ',';
        }
        if (i < save.length-1) string += "/"
    }
    return string;
}
function saveAll() {
    let fullString = '';
    //Name {{{ Scenes }}} Name {{{ Scenes 
    for (let j = 0; j < games.length; j++) {
        fullString += games[j].name + "{{{";
        for (let i = 0; i < games[j].scenes.length; i++) {
            fullString += games[j].scenes[i].name + "}{|" + convertSaveObjectToString(games[j].scenes[i].data);
            fullString += "}{|" + games[j].scenes[i].settings.width + "}{|" + games[j].scenes[i].settings.height;
            if (i < games[j].scenes.length - 1) fullString += '|{]';
        }
        fullString += "{{{" + "Test";
        if (j < games.length - 1) fullString += '}}}';
    }
    
    return fullString;
}
function loadWorlds() {
    let string = prompt("Paste Worlds Save Here:")
    if (string === null || string === '') return;

    let worlds = decodeAll(string);
    maps = worlds;

    loadMaps();
    let number = findMapByName(currentMap);
    createMap(findGameByName(currentGame,games).scenes[number].data);
    newSave()
}
function loadFile(file) {
    createMap(decodeFile(file));
    
    newSave()
    
    loadMaps();
    
}
function deleteSave(name) {
    if (displayingSaves) {
        findGameByName(currentGame,games).scenes.splice(findMapByName(name), 1);
        if (findGameByName(currentGame,games).scenes.length < 1) {
            findGameByName(currentGame,games).scenes.push({
                name: "Untitled 1",
                data: makeMap(20,20),
                settings: {
                    width: 20,
                    height: 20,
                }
            });
            currentMap = 'Untitled 1';
        }
        if (currentMap === name) currentMap = findGameByName(currentGame,games).scenes[0].name;
        
        let number = findMapByName(currentMap);
        createMap(findGameByName(currentGame,games).scenes[number].data);
        loadMaps();
        newSave()
    } else {
        if (prompt('Write World Name') !== currentGame) return;
        let found = false;
        for (let i = 0; i < games.length; i++) {
            if (games[i].name == currentGame) found = i;
        }
        games.splice(found,1);
        if (games.length < 1) {
            games.push({
                name: "Untitled 1",
                settings: {},
                scenes: [],
            });
            games[0].scenes.push({
                name: "Untitled 1",
                data: makeMap(20,20),
                settings: {
                    width: 20,
                    height: 20,
                }
                
            })
            currentGame = "Untitled 1";
            currentMap = 'Untitled 1';
        }
        currentGame = games[0].name;
        currentMap = games[0].scenes[0].name;

        createMap(findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data);
        loadGames();
        newSave()
    }

}
function testPlay() {
    ls.save('scTestPlayer',JSON.stringify(converTableToAMap()));
    ls.save('scCurrentMap',currentMap);
    ls.save('scGame',currentGame);
    let testPlayer = window.open("./testPlay.html","_self")
}
function loadTileInspector(multipleSelected = false,layer) {
    if (!multipleSelected) {
        $('rsblIMG').style.background = 'white'; 
        $('rsblIMG').src = 'img/' + selectedCell.img + '.png';
        $('rsblMapName').innerHTML = selectedCell.name
    } else {
        $('rsblIMG').style.background = 'red'; 
        $('rsblIMG').src = 'img/transparent.png';
        $('rsblMapName').innerHTML = "Layer " + layer;
    }

    loadAttributes(multipleSelected);
}
function loadMapInspector() {
    if (displayingSaves) {
        let map = findGameByName(currentGame,games).scenes[findMapByName(currentMap)];
        let canvas = $('rsbrCanvas');
        $('rsbrMapName').innerHTML = map.name;
        $('rsbrFillTiles').style.display = 'block';
        $('rsbrClone').style.display = 'block';
        
        canvas.height = 40;
        canvas.width = 40;
        canvas.style.height = '40px';
        canvas.style.width = '40px';
        //drawEverything(canvas,map.data,false,false,false,true,false,false)
    }
    if (!displayingSaves) {
        $('rsbrMapName').innerHTML = currentGame;
        $('rsbrFillTiles').style.display = 'none';
        $('rsbrClone').style.display = 'none';
        
    }

    
}
function cloneMap() {
    let name = currentMap + ' clone';
    let number2 = 1;
    for (let i = 0; i < findGameByName(currentGame,games).scenes.length; i++) {
        if (findGameByName(currentGame,games).scenes[i].name === name) number2++;
    } 
    if (number2 > 1) name = name + ' ' + number2;
    findGameByName(currentGame,games).scenes.push({
        name: name,
        data: findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data,
        settings: {
            width: findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.width,
            height: findGameByName(currentGame,games).scenes[findMapByName(currentMap)].settings.height,
        }
    });
    
    currentMap = name;
    loadMaps();
}

function resizeAll() {
    
    //Fix Map Size
    fixMapSize();
}
function loadGames() {
    $('gamesList').innerHTML = '';
    for (let i = 0; i < games.length; i++) {
        let holder = $('gamesList').create('div');
        holder.id = 'savesHolder';
        holder.name = games[i].name;

        if (currentGame == games[i].name)
        holder.id = 'SelectedHolder';

        let name = holder.create('div');
        name.id = 'savesName';
        name.innerHTML = games[i].name;
        name.name = games[i].name;
        holder.onclick = function() {
            selectionName = false;
            selectionTool = false;
            currentGame = this.name;
            currentMap = findGameByName(currentGame,games).scenes[0].name;
            
            let number = findMapByName(currentMap);
            createMap(findGameByName(currentGame,games).scenes[number].data);

            
            ls.save('scCurrentGame',currentGame);
            ls.save('scCurrentMap',currentMap);

            loadGames();
        }

    }
    
    loadMapInspector('games');
    ls.save('scCurrentGame',currentGame);
    ls.save('scCurrentMap',currentMap);
}
function newGame() {
    let name = prompt('New Game Name');
    if (name == undefined) return;

    let number = 1;
    let number2 = 1;
    for (let i = 0; i < games.length; i++) {
        if (games[i].name.includes("Untitled")) number++;
        if (games[i].name === name) number2++;
    } 
    if (name === '') name = "Untitled " + number;
    if (number2 > 1) name = name + ' ' + number2;
    games.push({
        name: name,
        settings: {
        },
        scenes: [],
    });

    currentGame = name;

    findGameByName(currentGame,games).scenes.push({
        name: "Untitled 1",
        data: makeMap(20,20),
        settings: {
            width: 20,
            height: 20,
        }
    });
    currentMap = 'Untitled 1';
    
    ls.save('scCurrentGame',currentGame);
    ls.save('scCurrentMap',currentMap);
    newSave();
    loadGames();
    createMap(findGameByName(currentGame,games).scenes[0].data);
}
function loadSavesMenu() {
    $('worldWorld').style.display = 'none';
    $('saveSave').style.display = 'block';
    $('.bottomOfSaves').innerHTML = 'View Worlds';
    $('savesHeader')[0].innerHTML = currentGame + ' -  Scenes';
    loadMaps();
}
function loadWorldsMenu() {
    $('saveSave').style.display = 'none';
    $('worldWorld').style.display = 'block';
    $('.bottomOfSaves').innerHTML = 'View Scenes';
    $('savesHeader')[1].innerHTML = 'Games';
    loadGames();
}

function switchSavesWorlds() {
    displayingSaves = displayingSaves ? false : true;
    if (displayingSaves) loadSavesMenu();
    else loadWorldsMenu();
    loadMapInspector();
}
function hardLoadGames() {
    let a = prompt("String");
    games = JSON.parse(a);


    
    //Set Current Map
    currentGame = games[0].name;
    currentMap = games[0].scenes[0].name;

    //Loads Saved Maps
    loadMaps();

    //Draw Map
    let number = findMapByName(currentMap);
    createMap(findGameByName(currentGame,games).scenes[number].data);

    //Create Tile Options
    createOptions();

    //Switch to correct Tab
    switchTab('Tiles');

    //Load Inspecor
    loadTileInspector();

    //Fix Map Size
    fixMapSize();
}

function newSave() {
    ls.save('SCmaps',JSON.stringify(games))
}

///////////////////
// End Functions //
///////////////////
//////////////////////////
//  Interative Actions  //
////////////////////////// 

window.addEventListener('mousedown',function(e) {
    mouseDown = true;
    if (e.button == 0) mouseKey = 'left';
    if (e.button == 1) mouseKey = 'middle';
    if (e.button == 2) mouseKey = 'right';
})
window.addEventListener('mouseup',function(e) {
    mouseDown = false;
    mouseKey = false;
})
window.addEventListener('keydown',function(e) {
    let key = e.key;
    let lkey = e.key.toLowerCase(); //Key but in lowercase no matter what 

    if (lkey == 'q') {
        showGrid = showGrid ? false : true;
    }
    if (lkey == 'shift') {
        shiftDown = true;
    }
    if (lkey == 'control') {
        controlDown = true;
    }
    if (lkey == 'escape') {
        selectionTool = false;
        selectionName = false;
        for (let i = 0; i < findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data.length; i++) {
            for (let j = 0; j < findGameByName(currentGame,games).scenes[findMapByName(currentMap)].data[0].length; j++) {
                $('i' + i + 'j' + j).style.outline = 'none';
            }
        }
        createOptions();
    }
    if (lkey == 'a') rotation = 'left';
    if (lkey == 'd') rotation = 'right';
    if (lkey == 'w') rotation = 'up';
    if (lkey == 's' && !controlDown) rotation = 'down';
    else if (lkey == 's' && controlDown) {
        e.preventDefault();
        saveMap();
    }
    if (lkey == 'l' && controlDown) {
        e.preventDefault();
        loadFile(prompt());
    }
    if (lkey == 'a' || lkey == 's' || lkey == 'd' || lkey == 'w') createOptions();

    if (controlDown && lkey == 'p') {
        e.preventDefault();
        testPlay();
    }
})
window.addEventListener('keyup',function(e) {
    let key = e.key;
    let lkey = e.key.toLowerCase(); //Key but in lowercase no matter what 

    if (lkey == 'shift') {
        shiftDown = false;
    }
    if (lkey == 'control') {
        controlDown = false;
    }
})
window.addEventListener('resize',resizeAll)

///////////////////////////////
//  End Interactive Actions  //
///////////////////////////////

loadImagesFirst();