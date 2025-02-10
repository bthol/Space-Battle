//////////////////////////////MODULES//////////////////////////////////
import { user, aliens, bosses, bossRound } from './JS-Modules/dataStructures.js';

import { stateVars } from './JS-Modules/stateVariables.js';
let { page, cannonCharge, shieldCharge, repairCharge, currentEnemy, enemiesDefeated, bossCount } = stateVars;

import { controlSpace, msgDisplay, scoreDisplay, playerDisplay, enemyDisplay } from './JS-Modules/DOM.js';

/////////////////////////INITIALIZATION/////////////////////////////////

let currentEnemyHealth;

let scoreDisplayCache;

let shieldRegenerating = false;

let scoreBoard = [
    {name: "name loading...", score: "score loading...", dataAddress: ""},
    {name: "name loading...", score: "score loading...", dataAddress: ""},
    {name: "name loading...", score: "score loading...", dataAddress: ""},
    {name: "name loading...", score: "score loading...", dataAddress: ""},
    {name: "name loading...", score: "score loading...", dataAddress: ""},
    {name: "name loading...", score: "score loading...", dataAddress: ""},
    {name: "name loading...", score: "score loading...", dataAddress: ""},
    {name: "name loading...", score: "score loading...", dataAddress: ""},
    {name: "name loading...", score: "score loading...", dataAddress: ""},
    {name: "name loading...", score: "score loading...", dataAddress: ""},
];

function init() {
    user.name = "";
    user.health.level = 200;
    user.shield.level = 50;
    user.score = 0;

    cannonCharge = 5;
    shieldCharge = 10;
    repairCharge = 10;
    
    page = 0;
    enemiesDefeated = 0;
    bossCount = 0;
};

/////////////////////////DATA////////////////////////////////////////
function sortScoreBoard(board) {
    let x = [];
    let b = board;
    let itr = 0;
    while (itr < 12 && b.length !== 0) {
        itr += 1;
        let scoreArr = [];
        b.forEach((item) => {
            scoreArr.push(item.score);
        });
        const max = Math.max(...scoreArr);
        scoreArr.forEach((item, index) => {
            if (item === max) {
                x.push(b[index]);
                b = b.slice(0, index).concat(b.slice(index + 1, b.length));
            }
        });
    }
    scoreBoard = x;
    // console.log(`sorted scoreboard: ${JSON.stringify(scoreBoard)}`);
};

async function requestData() {
    // get data collection
    await $.get(`https://space-battle-api.herokuapp.com/scoreboard`, function(obj) {
        // iterate over collection to assign to structure
        for (let i = 0; i < obj.data.length; i++) {
            const x = scoreBoard[i];
            const o = obj.data[i];
            x.name = o.userName;
            x.score = o.userScore;
            x.dataAddress = o.userRank;
        }
    });
    sortScoreBoard(scoreBoard);
    return true;
};

function rankScore(score) {
    let rank = null;
    for (let i = 9; i >= 0; i--) {
        if (score > scoreBoard[i].score) {
            rank = i;
        } else if (score === scoreBoard[i].score) {
            score -= 1;
            rank = i;
        }
    }
    return rank;
};

async function saveScore() {
    // first update scoreboard from database + sort scoreboard
    await requestData();
    // determine rank using sorted scoreboard
    const rank = rankScore(user.score);
    // console.log(`address: ${rank}`);
    // console.log(`user score: ${user.score}`);
    // if new high score, then update database
    if (rank !== null) {
        // update scoreboard with new high score for display
        scoreBoard[rank].name = user.name;
        scoreBoard[rank].score = user.score;
        // update database with new high score
        await $.ajax({
            type: 'PATCH',
            url: `https://space-battle-api.herokuapp.com/scoreboard/rank:${scoreBoard[rank].dataAddress}`,
            data: {"userName": `${user.name}`, "userScore": `${user.score}`},
        });
        return true;
    } else {
        return false;
    }
};

// for direct database writing
// $.ajax({
//     type: 'PATCH',
//     url: `https://space-battle-api.herokuapp.com/scoreboard/rank:${9}`,
//     data: {"userName": `Gandr`, "userScore": `800`}
// });

// $.ajax({
//     type: 'PATCH',
//     url: `https://space-battle-api.herokuapp.com/scoreboard/rank:${9}`,
//     data: {"userName": `Purpl`, "userScore": `100`}
// });

// for direct database reading
// const idForGet = 9;
// $.get(`https://space-battle-api.herokuapp.com/scoreboard/rank:${idForGet}`, function(data) {
//     console.log(data.datum);
//     console.log(data.datum.userName);
//     console.log(data.datum.userScore);
// });

/////////////////////////GAME PAGES///////////////////////////////////////
function mainPage() {
    page = 0;

    // MESSAGE
    msgDisplay.text(`Main Menu`);

    // CONTROLS
    const btn1 = $('<button></button>');
    btn1.addClass("page-0-node");
    btn1.addClass("btn1");
    btn1.addClass("button");
    btn1.text(`New Game`);
    controlSpace.append(btn1);
    
    const btn2 = $('<button></button>');
    btn2.addClass("page-0-node");
    btn2.addClass("btn2");
    btn2.addClass("button");
    btn2.text(`Scoreboard`);
    controlSpace.append(btn2);
    
    const btn3 = $('<button></button>');
    btn3.addClass("page-0-node");
    btn3.addClass("btn3");
    btn3.addClass("button");
    btn3.text(`Quit`);
    controlSpace.append(btn3);
    
    const btn4 = $('<button></button>');
    btn4.addClass("page-0-node");
    btn4.addClass("btn4");
    btn4.addClass("button");
    btn4.text(`Settings`);
    controlSpace.append(btn4);

    defaultDisplay();
    
    // setTimeout(() => {
    //     console.log("ran");
    //     // saveScore();
    // }, 5000)
};

function gameplayPage() {
    page = 1;
    // CHANGE COLOR THEME
    document.body.classList.remove("style-default");
    document.body.classList.add("style-game");
    // MESSAGE
    msgDisplay.text(``);
    // SCORE
    scoreDisplay.text(`Score: ${user.score}`);
    // PLAYER
    playerDisplay.append(`<div class="page-1-node user-name names">${user.name}</div>`);
    playerDisplay.append(`<div class="page-1-node"><div class="bar-back"><div id="player-health-bar"></div><div id="player-shield-bar"></div></div></div>`);
    // ENEMY
    enemyDisplay.append(`<div class="page-1-node enemy-name names">${currentEnemy.name}</div>`);
    enemyDisplay.append(`<div class="page-1-node"><div class="bar-back"><div id="enemy-health-bar"></div></div></div>`);
    // CONTROLS
    // PULSEBEAM
    const btn1 = $('<button></button>');
    btn1.addClass("page-1-node");
    btn1.addClass("btn1");
    btn1.addClass("button");
    btn1.text(`Pulsebeam`);
    controlSpace.append(btn1);
    
    // LAZERCANNON
    const btn2 = $('<button></button>');
    btn2.addClass("page-1-node");
    btn2.addClass("btn2");
    btn2.addClass("button");
    btn2.text(`Lazercannon`);
    controlSpace.append(btn2);
    
    // REPAIR
    const btn3 = $('<button></button>');
    btn3.addClass("page-1-node");
    btn3.addClass("btn3");
    btn3.addClass("button");
    btn3.text(`Repair`);
    controlSpace.append(btn3);
    
    // SHEILD
    const btn4 = $('<button></button>');
    btn4.addClass("page-1-node");
    btn4.addClass("btn4");
    btn4.addClass("button");
    btn4.text(`Shield`);
    controlSpace.append(btn4);
    
    gameDisplay();
    dynamicBar();
    dynamicButton();
};

async function gameoverPage() {
    page = 2;
    // CHANGE COLOR THEME
    document.body.classList.remove("style-game");
    document.body.classList.add("style-default");
    // MESSAGE
    msgDisplay.text(`Defeat!\n\ntesting score...`);
    // SCORE
    scoreDisplay.text(`${user.name} = ${user.score}`);
    // CONTROLS
    const btn1 = $('<button></button>');
    btn1.addClass("page-2-node");
    btn1.addClass("btn1");
    btn1.addClass("button");
    btn1.text(`New Game`);
    controlSpace.append(btn1);
    
    const btn2 = $('<button></button>');
    btn2.addClass("page-2-node");
    btn2.addClass("btn2");
    btn2.addClass("button");
    btn2.text(`Main Menu`);
    controlSpace.append(btn2);
    
    const btn3 = $('<button></button>');
    btn3.attr("id", "fillspace");
    btn3.addClass("page-2-node");
    btn3.addClass("btn3");
    btn3.addClass("button");
    btn3.css("color", "#dedede");
    btn3.text(`Quit`);
    controlSpace.append(btn3);

    defaultDisplay();
    controlListenOff();
    controlListenOn();

    const res = await saveScore();
    if (res === true) {
        msgDisplay.text(`Defeat! New High Score!`);
    } else {
        msgDisplay.text(`Defeat!`);
    }
};

async function gameWinPage() {
    page = 3;
    // CHANGE COLOR THEME
    document.body.classList.remove("style-game");
    document.body.classList.add("style-default");
    // MESSAGE
    msgDisplay.text(`You Win!\n\ntesting score...`);
    // SCORE
    scoreDisplay.text(`${user.name} = ${user.score}`);
    // CONTROLS
    const btn1 = $('<button></button>');
    btn1.addClass("page-3-node");
    btn1.addClass("btn1");
    btn1.addClass("button");
    btn1.text(`New Game`);
    controlSpace.append(btn1);
    
    const btn2 = $('<button></button>');
    btn2.addClass("page-3-node");
    btn2.addClass("btn2");
    btn2.addClass("button");
    btn2.text(`Main Menu`);
    controlSpace.append(btn2);
    
    const btn3 = $('<button></button>');
    btn3.attr("id", "fillspace");
    btn3.addClass("page-3-node");
    btn3.addClass("btn3");
    btn3.addClass("button");
    btn3.css("color", "#dedede");
    btn3.text(`Quit`);
    controlSpace.append(btn3);

    defaultDisplay();
    controlListenOff();
    controlListenOn();
    
    const res = await saveScore();
    if (res === true) {
        msgDisplay.text(`You Win! New High Score!`);
    } else {
        msgDisplay.text(`You Win!`);
    }
};

function scoreboardPage() {
    page = 4;

    msgDisplay.text(`Scoreboard`);
    // CONTROLS
    const btn1 = $('<button></button>');
    btn1.addClass("page-4-node");
    btn1.attr("id", "fillspace");
    btn1.addClass("btn1");
    btn1.addClass("button");
    btn1.css("color", "#dedede");
    btn1.text(`Back`);
    controlSpace.append(btn1);

    // display placeholder until data returns
    for (let i = 0; i < scoreBoard.length; i++) {
        msgDisplay.append(`<p class="page-4-node scoreboard">${i + 1}.) ${scoreBoard[i].name} : ${scoreBoard[i].score}</p>`);
    }
    
    defaultDisplay();

    const gotData = new Promise((resolve) => {
        resolve(requestData());
    });
    gotData
        .then(() => {
            if (page === 4) {
                // remove placeholder
                $(`.scoreboard`).remove();
                // display returned data
                for (let i = 0; i < scoreBoard.length; i++) {
                    msgDisplay.append(`<p class="page-4-node scoreboard">${i + 1}.)\t${scoreBoard[i].name}\t:\t${scoreBoard[i].score}</p>`);
                }
            }
        },
        (error) => {
            console.log(error);
        });
};

function settingsPage() {
    page = 5;

    // MESSAGE
    msgDisplay.text(`Settings Menu`);
    // CONTROLS
    const btn1 = $('<button></button>');
    btn1.addClass("page-5-node");
    btn1.addClass("btn1");
    btn1.addClass("button");
    btn1.text(`Back`);
    controlSpace.append(btn1);
    
    const btn2 = $('<button></button>');
    btn2.addClass("page-5-node");
    btn2.addClass("btn2");
    btn2.addClass("button");
    btn2.text(`Controls`);
    controlSpace.append(btn2);

    defaultDisplay();   
};

function controlsPage() {
    page = 6;

    // MESSAGE
    msgDisplay.text(`Controls`);

    // DISPLAY CONTROLS
    msgDisplay.append(`<p class="page-6-node">Button 1 : ${btn1key}</p>`)
    msgDisplay.append(`<p class="page-6-node">Button 2 : ${btn2key}</p>`)
    msgDisplay.append(`<p class="page-6-node">Button 3 : ${btn3key}</p>`)
    msgDisplay.append(`<p class="page-6-node">Button 4 : ${btn4key}</p>`)

    // CONTROLS
    const btn1 = $('<button></button>');
    btn1.addClass("page-6-node");
    btn1.addClass("btn1");
    btn1.addClass("button");
    btn1.text(`Back`);
    controlSpace.append(btn1);
    
    const btn2 = $('<button></button>');
    btn2.addClass("page-6-node");
    btn2.addClass("btn2");
    btn2.addClass("button");
    btn2.text(`Customize`);
    controlSpace.append(btn2);
    
    const btn3 = $('<button></button>');
    btn3.attr("id", "fillspace");
    btn3.addClass("page-6-node");
    btn3.addClass("btn3");
    btn3.addClass("button");
    btn3.css("color", "#dedede");
    btn3.text(`Reset`);
    controlSpace.append(btn3);

    defaultDisplay();
};

function controlsPageCustomize() {
    page = 7;

    // MESSAGE
    msgDisplay.text(`Controls`);

    // DISPLAY CONTROLS
    msgDisplay.append(`<p class="page-7-node">Click the button to which you'd like to assign a new keybinding, and press the key you like to bind to that button.</p>`)

    // CONTROLS
    const btn1 = $('<button></button>');
    btn1.addClass("page-7-node");
    btn1.addClass("btn1");
    btn1.addClass("button");
    btn1.text(`Button 1`);
    controlSpace.append(btn1);
    
    const btn2 = $('<button></button>');
    btn2.addClass("page-7-node");
    btn2.addClass("btn2");
    btn2.addClass("button");
    btn2.text(`Button 2`);
    controlSpace.append(btn2);
    
    const btn3 = $('<button></button>');
    btn3.addClass("page-7-node");
    btn3.addClass("btn3");
    btn3.addClass("button");
    btn3.text(`Button 3`);
    controlSpace.append(btn3);
    
    const btn4 = $('<button></button>');
    btn4.addClass("page-7-node");
    btn4.addClass("btn4");
    btn4.addClass("button");
    btn4.text(`Button 4`);
    controlSpace.append(btn4);

    defaultDisplay();   
};

function userNamePage() {
    page = 8;
    
    // TITLE
    msgDisplay.text(`Player Name`);
    
    // DISPLAY CONTROLS
    controlSpace.append(`
    <form id="inform" class="page-8-node">
        <input name="data" type="text" pattern="[a-zA-Z]{5,6}" maxLength="5" class="data-input" placeholder="name" title="must be 5 characters in length and contain only letters" style="width:4.5em;" required/>
        <button type="submit" class="form-button btn2" >Begin</button>
        <button type="button" class="form-button btn3" >Back</button>
    </form>`);
    const form = $('#inform');
    form[0].data.focus();
    form.on("submit", (e) => {
        e.preventDefault();
        const nameText = form[0].data.value.toLowerCase();
        const name = nameText.slice(0, 1).toUpperCase() + nameText.slice(1, nameText.length);
        user.name = name;
        pageHandler(1);
        newEnemy();
    })
};

function removePageNodes() {
    $(`.page-${page}-node`).remove();
};

function pageHandler(p) {
    // turn off listeners for old page
    controlListenOff();
    // remove nodes from last page
    removePageNodes();

    // clear text content
    msgDisplay.text(``);
    scoreDisplay.text(``);

    // render new page
    if (p === 0) {
        mainPage();
    }
    if (p === 1) {
        gameplayPage();
    }
    if (p === 2) {
        gameoverPage();
    }
    if (p === 3) {
        gameWinPage();
    }
    if (p === 4) {
        scoreboardPage();
    }
    if (p === 5) {
        settingsPage();
    }
    if (p === 6) {
        controlsPage();
    }
    if (p === 7) {
        controlsPageCustomize();
    }
    if (p === 8) {
        userNamePage();
    }

    // turn on listeners for new page
    controlListenOn();
};

//////////////////////////////////DISPLAY/////////////////////////////////

const colors = {
    uncharged: "#00000040",
    btnText:"#515151",
    btnTextGame:"#e5e5e5",
    btnBorder: "1.5px solid #c8c4ac",
    indicatorBorderColor: "#c8c4ac",
    lazerColor: "#ca141e",
    lazerBackground: "#101014",
};

function dynamicButton() {
    // lazercannon charge
    if (cannonCharge >= user.lazercannon.overCharge) {
        // SUPERCHARGED
        $('.btn2').css("color", `${colors.lazerColor}`);
        $('.btn2').css("backgroundColor", "#101014");
        $('.btn2').css("border", "none");
        $('.btn2').css("outline", `4px solid ${colors.lazerColor}`);
    } else if (cannonCharge === user.lazercannon.overCharge - 1) {
        // SUPERCHARGING 1
        $('.btn2').css("outline", `3px solid ${colors.lazerColor}`);
        // ADD CORNER INDICATOR
        const crnr = $('<div></div>');
        crnr.addClass("lazercannon-indicator");
        crnr.css("outline", `1px solid ${colors.lazerColor}`);
        crnr.css("color", `${colors.lazerColor}`);
        crnr.text(`1`);
        $('.btn2').append(crnr);
    } else if (cannonCharge === user.lazercannon.overCharge - 2) {
        // SUPERCHARGING 2
        $('.btn2').css("outline", `2px solid ${colors.lazerColor}`);
        // ADD CORNER INDICATOR
        const crnr = $('<div></div>');
        crnr.addClass("lazercannon-indicator");
        crnr.css("outline", `1px solid ${colors.lazerColor}`);
        crnr.css("color", `${colors.lazerColor}`);
        crnr.text(`2`);
        $('.btn2').append(crnr);
    } else if (cannonCharge >= user.lazercannon.baseCharge) {
        // BASECHARGED
        $('.btn2').css("color", `${colors.btnTextGame}`);
        // ADD CORNER INDICATOR
        const crnr = $('<div></div>');
        crnr.addClass("lazercannon-indicator");
        crnr.css("outline", `1px solid ${colors.indicatorBorderColor}`);
        crnr.css("color", `${colors.btnTextGame}`);
        crnr.text(`3`);
        $('.btn2').append(crnr);
    } else {
        // UNCHARGED
        $('.btn2').css("color", `${colors.uncharged}`);
        $('.btn2').css("border", `${colors.btnBorder}`);
    }
    // repair charge
    if (repairCharge >= 10) {
        $('.btn3').css("color", `${colors.btnTextGame}`);
    } else {
        $('.btn3').css("color", `${colors.uncharged}`);
    }
    // shield charge
    if (shieldCharge >= user.shield.rechargeTime) {
        $('.btn4').css("color", `${colors.btnTextGame}`);
    } else {
        $('.btn4').css("color", `${colors.uncharged}`);
    }
};

function dynamicBar() {
    $(`#enemy-health-bar`).css("width", `${(currentEnemyHealth / currentEnemy.maxHealth) * 100}%`);
    $(`#player-health-bar`).css("width", `${(user.health.level / user.health.maxLevel) * 100}%`);
    $(`#player-shield-bar`).css("width", `${(user.shield.level / user.shield.maxLevel) * 100}%`);
};

function defaultDisplay() {
    $('.btn1').css("color", `${colors.btnText}`);
    $('.btn1').css("fontSize", "5vmin");
    $('.btn1').css("border", `${colors.btnBorder}`);

    $('.btn2').css("color", `${colors.btnText}`);
    $('.btn2').css("fontSize", "5vmin");
    $('.btn2').css("border", `${colors.btnBorder}`);

    $('.btn3').css("color", `${colors.btnText}`);
    $('.btn3').css("fontSize", "5vmin");
    $('.btn3').css("border", `${colors.btnBorder}`);

    $('.btn4').css("color", `${colors.btnText}`);
    $('.btn4').css("fontSize", "5vmin");
    $('.btn4').css("border", `${colors.btnBorder}`);
};

function gameDisplay() {
    $('.btn1').css("color", `${colors.btnTextGame}`);
    $('.btn1').css("fontSize", "5vmin");
    $('.btn1').css("border", `${colors.btnBorder}`);

    $('.btn2').css("color", `${colors.btnTextGame}`);
    $('.btn2').css("fontSize", "5vmin");
    $('.btn2').css("border", `${colors.btnBorder}`);

    $('.btn3').css("color", `${colors.btnTextGame}`);
    $('.btn3').css("fontSize", "5vmin");
    $('.btn3').css("border", `${colors.btnBorder}`);

    $('.btn4').css("color", `${colors.btnTextGame}`);
    $('.btn4').css("fontSize", "5vmin");
    $('.btn4').css("border", `${colors.btnBorder}`);
};

////////////////////////////////SYSTEM-CONTROLS//////////////////////////////////////////
function newGame() {
    removePageNodes();
    init();
    pageHandler(8);
};

////////////////////////////////PLAYER-CONTROLS//////////////////////////////////////////

// BUTTON 1
function buttonTester1(e) {
    if (page === 0) {
        newGame();
    } else if (page === 1) {
        pulsebeamAttack();
    } else if (page === 2) {
        newGame();
    } else if (page === 3) {
        newGame();
    } else if (page === 4) {
        pageHandler(0);
    } else if (page === 5) {
        pageHandler(0);
    } else if (page === 6) {
        pageHandler(5);
    } else if (page === 7) {
        keyBind(1);
    } else if (page === 8) {
        const form = $('#inform');
        form[0].data.focus();
    }
};

// BUTTON 2
function buttonTester2(e) {
    if (page === 0) {
        pageHandler(4);
    } else if (page === 1) {
        lazercannonAttack();
    } else if (page === 2) {
        pageHandler(0);
    } else if (page === 3) {
        pageHandler(0);
    } else if (page === 4) {
    } else if (page === 5) {
        pageHandler(6);
    } else if (page == 6) {
        pageHandler(7);
    } else if (page === 7) {
        keyBind(2);
    } else if (page === 8) {
        const form = $('#inform');
        const name = form[0].data.value;
        if (name.length === 5) {
            const digits = /\d/;
            // const alphabet = /[a-zA-Z]/g;
            if (!digits.test(name)) {
                const nameText = form[0].data.value.toLowerCase();
                const name = nameText.slice(0, 1).toUpperCase() + nameText.slice(1, nameText.length);
                user.name = name;
                pageHandler(1);
                newEnemy();
            } else {
                scoreDisplay.text(`Name Must not contain numbers.`);
                clearTimeout(scoreDisplayCache);
                scoreDisplayCache = setTimeout(() => {
                    scoreDisplay.text(``);
                }, 2400);
            }
        } else {
            scoreDisplay.text(`Name Must have 5 characters.`);
            clearTimeout(scoreDisplayCache);
            scoreDisplayCache = setTimeout(() => {
                scoreDisplay.text(``);
            }, 2400);
        }
    }
};

// BUTTON 3
function buttonTester3(e) {
    if (page === 0) {
        window.close();
    } else if (page === 1) {
        repair();
    } else if (page === 2) {
        window.close();
    } else if (page === 3) {
        window.close();
    } else if (page === 4) {
    } else if (page === 5) {
    } else if (page === 6) {
        resetKeyBinding();
        pageHandler(6);
    } else if (page === 7) {
        keyBind(3);
    } else if (page === 8) {
        pageHandler(0);
    }
};

// BUTTON 4
function buttonTester4(e) {
    if (page === 0) {
        pageHandler(5)
    } else if (page === 1) {
        shield();
    } else if (page === 2) {
    } else if (page === 3) {
        window.close();
    } else if (page === 4) {
    } else if (page === 5) {
    } else if (page === 6) {
    } else if (page === 7) {
        keyBind(4);
    }
};

// KEYBINDING
let btn1key = "1";
let btn2key = "2";
let btn3key = "3";
let btn4key = "4";

function resetKeyBinding() {
    btn1key = "1";
    btn2key = "2";
    btn3key = "3";
    btn4key = "4";
};

function keyBind(btn) {
    function bind(e) {
        if (e.key == btn1key || e.key == btn2key || e.key == btn3key || e.key == btn4key) {
            msgDisplay.text(`Double binding is not permitted!`);
            setTimeout(() => {
                pageHandler(6);
            }, 1200);
        } else {
            if (btn === 1) {
                btn1key = e.key;
            } else if (btn === 2) {
                btn2key = e.key;
            } else if (btn === 3) {
                btn3key = e.key;
            } else if (btn === 4) {
                btn4key = e.key;
            }
            pageHandler(6);
        }
    };
    controlListenOff();
    document.body.addEventListener('keypress', (e) => {
        bind(e);
        controlListenOn();
    }, {once: true});
};

function controlListenOff() {
    $('.btn1').off('click', buttonTester1);
    $('.btn2').off('click', buttonTester2);
    $('.btn3').off('click', buttonTester3);
    $('.btn4').off('click', buttonTester4);
    $(`body`).off('keypress');
};

function controlListenOn() {
    controlListenOff();
    $('.btn1').on('click', buttonTester1);
    $('.btn2').on('click', buttonTester2);
    $('.btn3').on('click', buttonTester3);
    $('.btn4').on('click', buttonTester4);
    $(`body`).on('keypress', (e) => {
        if (e.key === btn1key) {
            buttonTester1(e);
        }
        if (e.key === btn2key) {
            buttonTester2(e);
        }
        if (e.key === btn3key) {
            buttonTester3(e);
        }
        if (e.key === btn4key) {
            buttonTester4(e);
        }
    })
};

////////////////////////////DEFENSIVE MOVES////////////////////////////////////////
function repair() {
    if (repairCharge >= user.repair.rechargeTime) {
        if (user.health.level < user.health.maxLevel) {
            repairCharge = 0;
            cannonCharge += 1;
            shieldCharge += 1;
            if ((user.health.maxLevel - user.health.level) < user.repair.rechargeAmmount) {
                alert(`Ship repaired by ${user.repair.rechargeAmmount - ((user.health.level + user.repair.rechargeAmmount) - user.health.maxLevel)}!`);
                user.health.level += user.repair.rechargeAmmount - (user.health.maxLevel - user.health.level);
            } else {
                user.health.level += user.repair.rechargeAmmount;
                alert(`Ship repaired by ${user.repair.rechargeAmmount}!`);
            }
            if (user.health.level > user.health.maxLevel) {
                user.health.level = user.health.maxLevel;
            }
            enemyAttack();
        } else {
            scoreDisplay.text(``);
            msgDisplay.text(`Health already full`);
            clearTimeout(scoreDisplayCache);
            scoreDisplayCache = setTimeout(() => {
                msgDisplay.text(``);
                scoreDisplay.text(`Score: ${user.score}`);
            }, 1200);
        }
    } else {
        scoreDisplay.text(``);
        msgDisplay.text(`${user.repair.rechargeTime - repairCharge} turns to charge repair`);
        clearTimeout(scoreDisplayCache);
        scoreDisplayCache = setTimeout(() => {
            msgDisplay.text(``);
            scoreDisplay.text(`Score: ${user.score}`);
        }, 1200);
    }
};

function shield() {
    if (shieldCharge >= user.shield.rechargeTime) {
        if (user.shield.level < user.shield.maxLevel) {
            // restart shield charge
            shieldCharge = 0;
            // enable shield regeneration
            shieldRegenerating = true;
            alert(`Shield regeneration initialized.`);
            enemyAttack();
        } else {
            scoreDisplay.text(``);
            msgDisplay.text(`shield fully regenerated`);
            clearTimeout(scoreDisplayCache);
            scoreDisplayCache = setTimeout(() => {
                msgDisplay.text(``);
                scoreDisplay.text(`Score: ${user.score}`);
            }, 1200);
        }
    } else {
        scoreDisplay.text(``);
        msgDisplay.text(`${user.shield.rechargeTime - shieldCharge} turns to charge shield`);
        clearTimeout(scoreDisplayCache);
        scoreDisplayCache = setTimeout(() => {
            msgDisplay.text(``);
            scoreDisplay.text(`Score: ${user.score}`);
        }, 1200);
    }
};

//////////////////////////////OFFENSIVE MOVES///////////////////////////////////////
function pulsebeamAttack() {
    cannonCharge += 1;
    repairCharge += 1;
    shieldCharge += 1;
    if (Math.random() < user.pulsebeam.accuracy) {
        currentEnemyHealth -= user.pulsebeam.damage;
        alert(`Pulsebeam attack hit the ${currentEnemy.name} for ${user.pulsebeam.damage} damage!`);
        testDeath(1);
    } else {
        alert(`Pulsebeam attack missed the ${currentEnemy.name}!`);
        enemyAttack();
    }
};

function lazercannonAttack() {
    if (cannonCharge >= user.lazercannon.overCharge) {
        cannonCharge = 0;
        repairCharge += 1;
        shieldCharge += 1;
        currentEnemyHealth -= user.lazercannon.overDamage;
        alert(`Lazercannon attack hit ${currentEnemy.name} for ${user.lazercannon.overDamage} damage!`);
        testDeath(1);
    } else if (cannonCharge >= user.lazercannon.baseCharge) {
        cannonCharge = 0;
        repairCharge += 1;
        shieldCharge += 1;
        if (Math.random() < user.lazercannon.accuracy) {
            currentEnemyHealth -= user.lazercannon.baseDamage;
            alert(`Lazercannon attack hit ${currentEnemy.name} for ${user.lazercannon.baseDamage} damage!`);
            testDeath(1);
        } else {
            alert(`Lazercannon attack missed ${currentEnemy.name}!`);
            enemyAttack();
            pageHandler(1);
        }
    } else {
        scoreDisplay.text(``);
        msgDisplay.text(`${user.lazercannon.baseCharge - cannonCharge} turns to base charge.`);
        clearTimeout(scoreDisplayCache);
        scoreDisplayCache = setTimeout(() => {
            msgDisplay.text(``);
            scoreDisplay.text(`Score: ${user.score}`);
        }, 1200);
    }
};

function enemyAttack() {
    if (Math.random() < currentEnemy.accuracy) {
        // determine damage
        let damage;
        if (user.shield.level > user.shield.minLevel) {
            // test for shield damage absorbtion
            if (currentEnemy.damage - user.shield.level > 0) {
                damage = currentEnemy.damage - user.shield.level;
            } else {
                damage = 0;
            }
            // addjust damage to reflect absorbtion
            user.shield.level -= currentEnemy.damage;
            if (user.shield.level < user.shield.minLevel) {
                // prevent shield level from negative
                user.shield.level = user.shield.minLevel;
            }
        } else {
            damage = currentEnemy.damage;
        }
        // display message
        if (shieldRegenerating) {
            alert(`Shield regeneration interrupted. ${currentEnemy.name} hit ${user.name} for ${currentEnemy.damage} damage!`);
            shieldRegenerating = false;
        } else {
            alert(`${currentEnemy.name} hit ${user.name} for ${currentEnemy.damage} damage!`);
        }
        // apply damage
        user.health.level -= damage;
        testDeath();
    } else {
        alert(`${currentEnemy.name} missed ${user.name}!`);
        if (shieldRegenerating) {
            // continue shield regeneration process
            if ((user.shield.maxLevel - user.shield.level) > user.shield.regenerate) {
                user.shield.level += user.shield.regenerate;
                alert(`Shield regenerated by ${user.shield.regenerate}`);
            } else {
                // calculate regeneration ammount
                alert(`Shield fully regenerated by ${user.shield.maxLevel - user.shield.level}`);
                user.shield.level += user.shield.maxLevel - user.shield.level;
            }
            if (user.shield.level >= user.shield.maxLevel) {
                // cap shield level at maximum
                user.shield.level = user.shield.maxLevel;
                // disable regeneration
                shieldRegenerating = false;
            }
        }
        pageHandler(1);
    }
};

/////////////////////////ENEMY GENERATORS///////////////////////////////
function newEnemy() {
    // get new enemy
    currentEnemy = aliens[Math.floor(Math.random() * aliens.length)];
    currentEnemyHealth = currentEnemy.maxHealth;

    // rerender game page with new enemy information
    pageHandler(1);
    scoreDisplay.text(`${currentEnemy.name} approaches...`);
    $('.enemy-name').text(`${currentEnemy.name}`);
    
    // display score after delay
    clearTimeout(scoreDisplayCache);
    scoreDisplayCache = setTimeout(() => {
        pageHandler(1);
        scoreDisplay.text(`Score: ${user.score}`);
    }, 1250)
};

function newBossEnemy() {
    currentEnemy = bosses[bossCount];
    currentEnemyHealth = currentEnemy.maxHealth;
    bossCount += 1;
    scoreDisplay.text(`BOSS FIGHT!\n\nEnter the ${currentEnemy.name}`);
    $('.enemy-name').text(`${currentEnemy.name}`);
    clearTimeout(scoreDisplayCache);
    scoreDisplayCache = setTimeout(() => {
        scoreDisplay.text(`Score: ${user.score}`);
        pageHandler(1);
    }, 2400)
    dynamicBar();
};

//////////////////////////////////TESTS///////////////////////////////////////////
function testDeath(x) {
    if (x === 1) {
        if (currentEnemyHealth <= 0) {
            enemiesDefeated += 1;
            user.score += currentEnemy.score;
            alert(`${currentEnemy.name} obliterated! +${currentEnemy.score} points`);
            bossTest();
        } else {
            enemyAttack();
        }
    } else {
        if (user.health.level <= 0) {
            pageHandler(2);
        } else {
            pageHandler(1);
        }
    }
};

function bossTest() {
    let bool = true;
    if (enemiesDefeated === bossRound[bossRound.length - 1] + 1) {
        // game win
        bool = false;
        pageHandler(3);
    } else {
        for (let i = 0; i < bossRound.length; i++) {
            if (enemiesDefeated === bossRound[i]) {
                // boss round before
                bool = false;
                user.health.level = user.health.maxLevel;
                user.shield.level = user.shield.maxLevel;
                newBossEnemy();
            } else if (enemiesDefeated === bossRound[i] + 1) {
                // boss round after
                bool = false;
                user.health.level = user.health.maxLevel;
                user.shield.level = user.shield.maxLevel;
                newEnemy();
            }
        }
    }
    if (bool === true) {
        // next regular enemy
        newEnemy();
    }
};

function start() {
    // Initalize State
    init();
    
    // Serve start page
    pageHandler(0);
};
start();