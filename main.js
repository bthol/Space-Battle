//////////////////////////////MODULES//////////////////////////////////
import { user, aliens, bosses, bossRound } from './JS-Modules/dataStructures.js';

import { stateVars } from './JS-Modules/stateVariables.js';
let { page, cannonCharge, shieldCharge, repairCharge, currentEnemy, enemiesDefeated, bossCount } = stateVars;

import { controlSpace, msgDisplay, scoreDisplay, playerDisplay, enemyDisplay } from './JS-Modules/DOM.js';

/////////////////////////INITIALIZATION/////////////////////////////////

let currentEnemyHealth;

let scoreDisplayCache;

let scoreBoard = [
    {name: "name loading...", score: "score loading...", rank: "rank loading..."},
    {name: "name loading...", score: "score loading...", rank: "rank loading..."},
    {name: "name loading...", score: "score loading...", rank: "rank loading..."},
    {name: "name loading...", score: "score loading...", rank: "rank loading..."},
    {name: "name loading...", score: "score loading...", rank: "rank loading..."},
    {name: "name loading...", score: "score loading...", rank: "rank loading..."},
    {name: "name loading...", score: "score loading...", rank: "rank loading..."},
    {name: "name loading...", score: "score loading...", rank: "rank loading..."},
    {name: "name loading...", score: "score loading...", rank: "rank loading..."},
    {name: "name loading...", score: "score loading...", rank: "rank loading..."},
];

function init() {
    user.health.level = 200;
    user.shield.level = 50;
    user.score = 0;
    page = 0;
    cannonCharge = 5;
    shieldCharge = 5;
    repairCharge = 10;
    enemiesDefeated = 0;
    bossCount = 0;
};

/////////////////////////DATA////////////////////////////////////////

function sortScoreBoard(board) {
    let x = [];
    let b = board;
    while (b.length !== 0) {
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
};


async function requestData() {
    // get data collection
    await $.get(`https://space-battle-api.herokuapp.com/`, function(obj) {
        // iterate over collection to assign to structure
        for (let i = 0; i < 10; i++) {
            const x = scoreBoard[i];
            const o = obj.data[i];
            x.name = o.userName;
            x.score = o.userScore;
            x.rank = o.userRank;
        }
    });
    sortScoreBoard(scoreBoard);
    return true;
};

function rankScore(score) {
    console.log(score);
    let rank = null;
    for (let i = 0; i <= 9; i++) {
        console.log(scoreBoard[i].score);
        if (score >= scoreBoard[i].score) {
            rank = i;
        }
    }
    return rank;
};

function saveScore(name = user.name, score = user.score, rank = rankScore(user.score)) {
    if (rank != null) {
        const promise = new Promise((resolve) => {
            resolve(
                $.ajax({
                    type: 'PATCH',
                    url: `https://space-battle-api.herokuapp.com/scoreboard/rank:${rank}`,
                    data: {"userName": `${name}`, "userScore": `${score}`}
                })
            )
        })
        promise.then(() => {
            requestData();
        });
    }
};

// for direct scoreboard writing
// $.ajax({
//     type: 'PATCH',
//     url: `https://space-battle-api.herokuapp.com/scoreboard/rank:${1}`,
//     data: {"userName": `Athen`, "userScore": `61250`}
// });
// for direct scoreboard reading
// const idForGet = 0;
// $.get(`https://space-battle-api.herokuapp.com/scoreboard/rank:${idForGet}`, function(data) {
//     console.log(data.data[idForGet].userName);
//     console.log(data.data[idForGet].userScore);
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
};

function gameplayPage() {
    page = 1;
    
    //NODE RESET
    $(`.page-1-node`).remove();
    // MESSAGE
    msgDisplay.text(``);
    // SCORE
    scoreDisplay.text(`Score: ${user.score}`);
    // PLAYER
    playerDisplay.append(`<div class="page-1-node user-name">${user.name}</div>`);
    playerDisplay.append(`<div class="page-1-node"><div class="bar-back"><div id="player-health-bar"></div><div id="player-shield-bar"></div></div></div>`);
    // ENEMY
    enemyDisplay.append(`<div class="page-1-node enemy-name">${currentEnemy.name}</div>`);
    enemyDisplay.append(`<div class="page-1-node"><div class="bar-back"><div id="enemy-health-bar"></div></div></div>`);
    // CONTROLS
    const btn1 = $('<button></button>');
    btn1.addClass("page-1-node");
    btn1.addClass("btn1");
    btn1.addClass("button");
    btn1.text(`Pulsebeam`);
    controlSpace.append(btn1);
    
    const btn2 = $('<button></button>');
    btn2.addClass("page-1-node");
    btn2.addClass("btn2");
    btn2.addClass("button");
    btn2.text(`Lazercannon`);
    controlSpace.append(btn2);
    
    const btn3 = $('<button></button>');
    btn3.addClass("page-1-node");
    btn3.addClass("btn3");
    btn3.addClass("button");
    btn3.text(`Repair`);
    controlSpace.append(btn3);
    
    const btn4 = $('<button></button>');
    btn4.addClass("page-1-node");
    btn4.addClass("btn4");
    btn4.addClass("button");
    btn4.text(`Shield`);
    controlSpace.append(btn4);
    
    defaultDisplay();
    dynamicBar();
    dynamicButton();
};

function gameoverPage() {
    page = 2;
    const promise = new Promise((resolve) => {
        resolve(saveScore())
    })
    promise.then(() => {
        // MESSAGE
        if (rankScore(user.score) != null) {
            msgDisplay.text(`Defeat! New High Score!`)
        } else {
            msgDisplay.text(`Defeat!`);
        }
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
    })
};

function gameWinPage() {
    page = 3;
    const promise = new Promise((resolve) => {
        resolve(saveScore())
    })
    promise.then(() => {
        // MESSAGE
        if (rankScore(user.score) !== null) {
            msgDisplay.text(`You Win! New High Score!`)
        } else {
            msgDisplay.text(`You Win!`);
        }
        // SCORE
        scoreDisplay.text(`${user.name} = ${user.score}`)
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
    })
};

function scoreboardPage() {
    page = 4;

    const gotData = new Promise((resolve) => {
        resolve(requestData())
    });
    gotData.then((loaded) => {
        // console.log(scoreBoard);
        // MESSAGE
        msgDisplay.text(`Scoreboard`);
        for (let i = 0; i < scoreBoard.length; i++) {
            const name = scoreBoard[i].name;
            const score = scoreBoard[i].score;
            msgDisplay.append(`<p class="page-4-node">${i + 1}.) ${name} : ${score}</p>`);
        }
        // CONTROLS
        const btn1 = $('<button></button>');
        btn1.addClass("page-4-node");
        btn1.attr("id", "fillspace");
        btn1.addClass("btn1");
        btn1.addClass("button");
        btn1.css("color", "#dedede");
        btn1.text(`Back`);
        controlSpace.append(btn1);
    
        defaultDisplay();
        controlListenOff();
        controlListenOn();
    })
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
    // DESCRIPTION
    msgDisplay.append('<p>Format: must be 5 characters in length and contain only letters.</p>');
    
    // DISPLAY CONTROLS
    controlSpace.append(`
    <form id="inform" class="page-8-node">
        <input name="data" type="text" pattern="[0-0]{5}" maxLength="5" class="data-input" placeholder="name" required/>
        <button type="submit" class="form-button" >Enter</button>
        <button type="button" id="name-page-back-btn" class="form-button" >Back</button>
    </form>`);
    $(`#name-page-back-btn`).on("click", () => {pageHandler(0)});
    const form = $('#inform');
    form[0].data.focus();
    form.on('submit', (e) => {
        e.preventDefault();
        const nameText = form[0].data.value.toLowerCase();
        const name = nameText.slice(0, 1).toUpperCase() + nameText.slice(1, nameText.length);
        user.name = name;
        pageHandler(1);
        newEnemy();
    });
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
function removePageNodes() {
    $(`.page-${page}-node`).remove();
};

function dynamicButton() {
    if (cannonCharge >= user.lazercannon.overCharge) {
        $('.btn2').css("color", "#ca141e");
        $('.btn2').css("backgroundColor", "#101014");
        $('.btn2').css("border", "1px solid #ca141e");
    } else if (cannonCharge >= user.lazercannon.baseCharge) {
        $('.btn2').css("color", "#dedede");
    } else {
        $('.btn2').css("color", "#00000080");
        $('.btn2').css("border", "1px solid black");
    }
    if (repairCharge >= 10) {
        $('.btn3').css("color", "#dedede");
    } else {
        $('.btn3').css("color", "#00000080");
    }
    if (shieldCharge >= user.shield.rechargeTime) {
        $('.btn4').css("color", "#dedede");
    } else {
        $('.btn4').css("color", "#00000080");
    }
};

function dynamicBar() {
    $(`#enemy-health-bar`).css("width", `${(currentEnemyHealth / currentEnemy.maxHealth) * 100}%`);
    $(`#player-health-bar`).css("width", `${(user.health.level / user.health.maxLevel) * 100}%`);
    $(`#player-shield-bar`).css("width", `${(user.shield.level / user.shield.maxLevel) * 100}%`);
};

function defaultDisplay() {
    $('.btn1').css("color", "#dedede");
    $('.btn1').css("fontSize", "5vmin");
    $('.btn1').css("border", "1px solid black");

    $('.btn2').css("color", "#dedede");
    $('.btn2').css("fontSize", "5vmin");
    $('.btn2').css("border", "1px solid black");
    
    $('.btn3').css("color", "#dedede");
    $('.btn3').css("fontSize", "5vmin");
    $('.btn3').css("border", "1px solid black");

    $('.btn4').css("color", "#dedede");
    $('.btn4').css("fontSize", "5vmin");
    $('.btn4').css("border", "1px solid black");
};

////////////////////////////////SYSTEM-CONTROLS//////////////////////////////////////////
function newGame() {
    init();
    pageHandler(8);
};

////////////////////////////////PLAYER-CONTROLS//////////////////////////////////////////

// BUTTON 1
function buttonTester1() {
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
    }
};

// BUTTON 2
function buttonTester2() {
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
    }
};

// BUTTON 3
function buttonTester3() {
    if (page === 0) {
        window.close();
    } else if (page === 1) {
        repair();
    } else if (page === 2) {
        window.close();
    } else if (page === 3) {
    } else if (page === 4) {
    } else if (page === 5) {
    } else if (page === 6) {
        resetKeyBinding();
        pageHandler(6);
    } else if (page === 7) {
        keyBind(3);
    }
};

// BUTTON 4
function buttonTester4() {
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
            e.preventDefault();
            buttonTester1();
        }
        if (e.key === btn2key) {
            e.preventDefault();
            buttonTester2();
        }
        if (e.key === btn3key) {
            e.preventDefault();
            buttonTester3();
        }
        if (e.key === btn4key) {
            e.preventDefault();
            buttonTester4();
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
            shieldCharge = 0;
            if ((user.shield.maxLevel - user.shield.level) < user.shield.rechargeAmmount) {
                alert(`Shield regenerated by ${user.shield.maxLevel - user.shield.level}`);
                user.shield.level += user.shield.maxLevel - user.shield.level;
            } else {
                user.shield.level += user.shield.rechargeAmmount;
                alert(`Shield regenerated by ${user.shield.rechargeAmmount}`);
            }
            if (user.shield.level > user.shield.maxLevel) {
                user.shield.level = user.shield.maxLevel;
            }
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
        msgDisplay.text(`${5 - shieldCharge} turns to charge shield`);
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
        if (Math.random() < user.pulsebeam.accuracy) {
            currentEnemyHealth -= user.lazercannon.overDamage;
            alert(`Lazercannon attack hit ${currentEnemy.name} for ${user.lazercannon.overDamage} damage!`);
            testDeath(1);
        } else {
            alert(`Lazercannon attack missed ${currentEnemy.name}!`);
            enemyAttack();
            pageHandler(1);
        }
    } else if (cannonCharge >= user.lazercannon.baseCharge) {
        cannonCharge = 0;
        repairCharge += 1;
        shieldCharge += 1;
        if (Math.random() < user.pulsebeam.accuracy) {
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
        let damage;
        if (user.shield.level > user.shield.minLevel) {
            if (currentEnemy.damage - user.shield.level > 0) {
                damage = currentEnemy.damage - user.shield.level;
            } else {
                damage = 0;
            }
            user.shield.level -= currentEnemy.damage;
            if (user.shield.level < user.shield.minLevel) {
                user.shield.level = user.shield.minLevel;
            }
        } else {
            damage = currentEnemy.damage;
        }
        user.health.level -= damage;
        alert(`${currentEnemy.name} hit ${user.name} for ${currentEnemy.damage} damage!`);
        testDeath();
    } else {
        alert(`${currentEnemy.name} missed ${user.name}!`);
        pageHandler(1);
    }
};

/////////////////////////ENEMY GENERATORS///////////////////////////////
function newEnemy() {
    currentEnemy = aliens[Math.floor(Math.random() * aliens.length)];
    currentEnemyHealth = currentEnemy.maxHealth;
    enemyAlert(0);
};

function newBossEnemy() {
    currentEnemy = bosses[bossCount];
    currentEnemyHealth = currentEnemy.maxHealth;
    bossCount += 1;
    enemyAlert(1);
};

function enemyAlert(x) {
    if (x === 0) {
        scoreDisplay.text(`A ${currentEnemy.name} approaches...`);
        $('.enemy-name').text(`${currentEnemy.name}`);
        clearTimeout(scoreDisplayCache);
        scoreDisplayCache = setTimeout(() => {
            scoreDisplay.text(`Score: ${user.score}`);
        }, 1200)
    }
    if (x === 1) {
        scoreDisplay.text(`BOSS FIGHT!\n\nThe ${currentEnemy.name} approaches...`);
        $('.enemy-name').text(`${currentEnemy.name}`);
        clearTimeout(scoreDisplayCache);
        scoreDisplayCache = setTimeout(() => {
            scoreDisplay.text(`Score: ${user.score}`);
        }, 1200)
    }
    dynamicBar();
};

//////////////////////////////////TESTS///////////////////////////////////////////
function testDeath(x) {
    if (x === 1) {
        if (currentEnemyHealth <= 0) {
            enemiesDefeated += 1;
            user.score += currentEnemy.score;
            alert("Alien obliterated!");
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
        bool = false;
        pageHandler(3);
    } else {
        for (let i = 0; i < bossRound.length; i++) {
            if (enemiesDefeated === bossRound[i]) {
                bool = false;
                user.health.level = user.health.maxLevel;
                user.shield.level = user.shield.maxLevel;
                newBossEnemy();
                gameplayPage();
            } else if (enemiesDefeated === bossRound[i] + 1) {
                bool = false;
                user.health.level = user.health.maxLevel;
                user.shield.level = user.shield.maxLevel;
                newEnemy();
                gameplayPage();
            }
        }
    }
    if (bool === true) {
        pageHandler(1);
        newEnemy();
    }
};

function start() {
    // Get data from remote
    requestData();
    // Serve start page
    pageHandler(0);
    // Turn on controls
    controlListenOn();
};
start();