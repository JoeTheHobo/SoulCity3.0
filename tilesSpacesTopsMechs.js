let tiles = [];
tiles.push({
    type: 'tile',
    color: '#444',
    img: 'transparent',
    name: 'Empty',
    walkable: false, //[00w,true/false]
    id: 1,
    speed: 1, //(1)
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: false,
})
tiles.push({
    type: 'tile',
    color: '#875139',
    name: 'Path',
    walkable: true,
    speed: 1,
    img: 'path',
    id: 2,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
})
tiles.push({
    type: 'tile',
    color: '#7C8A35',
    name: 'Grass',
    walkable: true,
    speed: 0.9,
    img: 'grass',
    id: 3,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
})
tiles.push({
    type: 'tile',
    color: '#2773C4',
    name: 'Water',
    walkable: true,
    img: 'water',
    speed: 0.1,
    id: 4,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
})
tiles.push({
    type: 'tile',
    color: '#D9B43E',
    name: 'Sand',
    walkable: true,
    speed: 0.5,
    img: 'sand',
    id: 5,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
})
tiles.push({
    type: 'tile',
    color: '#515056',
    name: 'Stone Brick',
    walkable: false,
    speed: 1, //(1)
    img: 'stoneBrick',
    id: 6,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
})
tiles.push({
    type: 'tile',
    color: 'white',
    name: 'Snow',
    walkable: true,
    speed: 0.5,
    img: 'snow',
    id: 7,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
})
tiles.push({
    type: 'tile',
    color: '#827C84',
    name: 'Gravel',
    walkable: true,
    speed: 1,
    img: 'gravel',
    id: 8,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
})
tiles.push({
    type: 'tile',
    color: 'brown',
    name: 'Wood Floor',
    walkable: true,
    speed: 1,
    img: 'woodfloor',
    id: 9,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
})
let selectedCell = tiles[1];










let spaces = [];
spaces.push({
    type: 'space',
    walkable: true,
    name: 'Air',
    img: 'transparent',
    color: 'white',
    id: 1,
    teleport: false,
    draw: false, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: false,
});
spaces.push({
    type: 'space',
    walkable: true,
    name: 'Chect',
    img: 'chest',
    color: 'white',
    id: 2,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
});
spaces.push({
    type: 'space',
    walkable: true,
    name: 'Bone Fish',
    img: 'boneFish',
    color: 'white',
    id: 3,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
});
spaces.push({
    type: 'space',
    walkable: true,
    name: 'Palm Tree',
    img: 'palmTree',
    color: 'white',
    id: 4,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
});
spaces.push({
    type: 'space',
    walkable: true,
    name: 'Lamp',
    img: 'Lamp',
    color: 'white',
    id: 5,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
});
spaces.push({
    type: 'space',
    walkable: true,
    name: 'Teleporter Blue',
    img: 'teleportA',
    color: 'white',
    id: 6,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
});
spaces.push({
    type: 'space',
    walkable: true,
    name: 'Teleporter Red',
    img: 'teleportB',
    color: 'white',
    id: 7,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
});
spaces.push({
    type: 'space',
    walkable: true,
    name: 'Teleporter Yellow',
    img: 'teleportC',
    color: 'white',
    id: 8,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
});
spaces.push({
    type: 'space',
    walkable: true,
    name: 'NPC1',
    img: 'npc1',
    color: 'white',
    id: 9,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
});
spaces.push({
    type: 'space',
    walkable: true,
    name: 'NPC2',
    img: 'npc2',
    color: 'white',
    id: 10,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
});
spaces.push({
    type: 'space',
    walkable: true,
    name: 'NPC3',
    img: 'gaurd',
    color: 'white',
    id: 11,
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
});















let tops = []; //Tops set on top of everything, the player walks below it
tops.push({
    type: 'top',
    name: 'Air',
    img: 'transparent',
    color: 'white',
    id: 1,
    walkable: true, //Default Value
    teleport: false,
    draw: false, //Draw On Mini Canvas In Map Editor
    hideWhenOn: false, //Hide When Player Is On Cell
    hwoID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 0, //Hide all tiles with HWOID (hideWhenOnID);
    render: false,
});
tops.push({
    type: 'top',
    name: 'Roof',
    img: 'roof',
    color: 'white',
    id: 2,
    walkable: true, //Default Value
    teleport: false,
    draw: false, //Draw On Mini Canvas In Map Editor
    hideWhenOn: true, //Hide When Player Is On Cell
    hwoID: 1, //Hide all tiles with HWOID (hideWhenOnID);
    hwoMyID: 1, //Hide all tiles with HWOID (hideWhenOnID);
    render: true,
});


let mechs = []; //Mechs aren't visible to the player, but perform actions
mechs.push({
    type: 'mech',
    name: 'Air',
    img: 'transparent',
    color: 'white',
    id: 1,
    walkable: true, //Default Value
    testPlayFromHere: false,
    teleport: false,
    draw: false, //Draw On Mini Canvas In Map Editor
    render: false,
});
mechs.push({
    type: 'mech',
    name: 'Portal',
    img: 'portal',
    color: 'white',
    id: 2,
    walkable: true, //Default Value
    testPlayFromHere: false,
    teleport: true,//[]
    draw: true, //Draw On Mini Canvas In Map Editor
    render: true,
});
mechs.push({
    type: 'mech',
    name: 'Player',
    img: 'player',
    color: 'white',
    id: 3,
    testPlayFromHere: true,
    speed: 1,
    walkable: true, //Default Value
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    render: true,
});
mechs.push({
    type: 'mech',
    name: 'Chat',
    img: 'chat',
    color: 'white',
    id: 4,
    testPlayFromHere: false,
    speed: 1,
    walkable: true, //Default Value
    teleport: false,
    draw: true, //Draw On Mini Canvas In Map Editor
    render: true,

    chat: true,
    chat_startChatDistance: 3,
    chat_interactionKey: 'e',
    chat_canInteractColor: '#0000ff',
    chat_cantInteractColor: "#ff0000",
    chat_yPos: 1, //Blocks Up
    chat_xPos: 0, //Blocks To The Right
    chat_currentText: 0,
    chat_texts: 
    [
        {
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
        },
    ],
    chat_exitChatDistance: 3,
    chat_repeat: true,  //False, 1 time, True Infinite, Whole Number - That Many Times

});