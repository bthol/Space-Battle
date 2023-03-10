//////////////////////////////MODULES//////////////////////////////////
import { user, aliens, bosses, bossRound } from './JS-Modules/dataStructures.js';

import { stateVars } from './JS-Modules/stateVariables.js';
let { page, cannonCharge, shieldCharge, repairCharge, currentEnemy, enemiesDefeated, bossCount } = stateVars;

import { btnEl1, btnEl2, btnEl3, btnEl4, msgDisplay, scoreDisplay, playerDisplay, enemyDisplay } from './JS-Modules/DOM.js';

/////////////////////////INITIALIZATION/////////////////////////////////

// Set screen dimensions to usable screen
if (navigator.userAgent.indexOf('MSIE') > - 1 || navigator.userAgent.indexOf('Trident') > - 1) {
    // Internet Explorer
    $(`#layout-wrap`).css("height", "document.documentElement.clientHeight");
} else {
    // All other browsers
    $(`#layout-wrap`).css("height", "window.innerHeight");
}

let currentEnemyHealth;

function init() {
    user.health = 200;
    user.shield = 50;
    user.score = 0;
    page = 0;
    cannonCharge = 3;
    shieldCharge = 5;
    repairCharge = 10;
    enemiesDefeated = 0;
    bossCount = 0;
};
init();
pageHandler(0);

let scoreBoard = [
    {name: "player", score: 100},
    {name: "player", score: 100},
    {name: "player", score: 100},
    {name: "player", score: 100},
    {name: "player", score: 100},
    {name: "player", score: 100},
    {name: "player", score: 100},
    {name: "player", score: 100},
    {name: "player", score: 100},
    {name: "player", score: 100},
];
function requestData() {
    for (let i = 0; i < 10; i++){
        $.get(`https://space-battle-api.herokuapp.com/scoreboard/listindex/${i}`, function(data, status) {
            scoreBoard[i].name = data.datum.userName;
            scoreBoard[i].score = data.datum.userScore;
        });
    }
};
requestData();

function rankScore(score) {
    let rank;
    for (let i = scoreBoard.length - 1; i >= 0; i--) {
        if (score >= scoreBoard[i].score) {
            rank = i;
        } else {
            i = -1;
        }
    }
    return rank;
}

function saveScore(name = user.name, score = user.score, rank = rankScore(user.score)) {
    if (rank != null) {
        const promise = new Promise((resolve) => {
            resolve(
                $.ajax({
                    type: 'PATCH',
                    url: `https://space-battle-api.herokuapp.com/scoreboard/listindex/${rank}`,
                    data: {"userName": `${name}`, "userScore": `${score}`}
                })
            )
        })
        promise.then(() => {
            requestData();
        });
    }
}

// $.ajax({
//     type: 'PATCH',
//     url: `https://space-battle-api.herokuapp.com/scoreboard/listindex/${7}`,
//     data: {"userName": `solor`}
// });

/////////////////////////USER NAME ENTER////////////////////////////////////////
function nameEnter() {
    const name = prompt("Enter Name (Must be 5 characters in length.)");
    if (name.length !== 5) {
        alert("Invalid: Character name must be 5 characters in length.");
        nameEnter();
    } else if (name.length === 5) {
        user.name = name;
    }
};

/////////////////////////GAME PAGES///////////////////////////////////////
function mainPage() {
    page = 0;

    // MESSAGE
    msgDisplay.text(`Welcome to the Space Battle main menu.`);
    // CONTROLS
    btnEl1.text(`New Game`);
    btnEl2.text(`ScoreBoard`);
    btnEl3.text(`Quit`);
    btnEl4.text(``);
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
    playerDisplay.append(`<div class="page-1-node">${user.name}</div>`);
    playerDisplay.append(`<div class="page-1-node"><div class="bar-back"><div id="player-health-bar"></div><div id="player-shield-bar"></div></div></div>`);
    // ENEMY
    enemyDisplay.append(`<div class="page-1-node">${currentEnemy.name}</div>`);
    enemyDisplay.append(`<div class="page-1-node"><div class="bar-back"><div id="enemy-health-bar"></div></div></div>`);
    // CONTROLS
    btnEl1.text(`Pulsebeam`);
    btnEl2.text(`Lazercannon`);
    btnEl3.text(`Repair`);
    btnEl4.text(`Shield`);
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
        btnEl1.text(`New Game`);
        btnEl2.text(`Main Menu`);
        btnEl3.text(`Quit`);
        btnEl4.text(``);
        defaultDisplay();
    })
};

function gameWinPage() {
    page = 3;
    const promise = new Promise((resolve) => {
        resolve(saveScore())
    })
    promise.then(() => {
        // MESSAGE
        if (rankScore(user.score) != null) {
            msgDisplay.text(`You Win! New High Score!`)
        } else {
            msgDisplay.text(`You Win!`);
        }
        // SCORE
        scoreDisplay.text(`${user.name} = ${user.score}`)
        // CONTROLS
        btnEl1.text(`New Game`);
        btnEl2.text(`Main Menu`);
        btnEl3.text(``);
        btnEl4.text(`Quit`);
        defaultDisplay();
    })
};

function scoreboardPage() {
    page = 4;

    // MESSAGE
    requestData();
    msgDisplay.text(`SCOREBOARD`);
    for (let i = 0; i < scoreBoard.length; i++) {
        msgDisplay.append(`<p class="page-4-node">${i + 1}.) ${scoreBoard[i].name} : ${scoreBoard[i].score}</p>`)
    }
    // CONTROLS
    btnEl1.text(`Back`);
    btnEl2.text(``);
    btnEl3.text(``);
    btnEl4.text(``);
    defaultDisplay();
};

//////////////////////////////////DISPLAY/////////////////////////////////
function dynamicButton() {
    if (cannonCharge >= user.lazercannon.overCharge) {
        btnEl2.css("color", "#ca141e");
        btnEl2.css("border", "1px solid #ca141e");
        btnEl2.css("fontSize", "5vmin");
    } else if (cannonCharge >= user.lazercannon.baseCharge) {
        btnEl2.css("color", "#dedede");
        btnEl2.css("fontSize", "4.5vmin");
    } else {
        btnEl2.css("color", "#00000080");
        btnEl2.css("fontSize", "4vmin");
        btnEl2.css("border", "1px solid black");
    }
    if (repairCharge >= 10) {
        btnEl3.css("color", "#dedede");
        btnEl3.css("fontSize", "5vmin");
    } else {
        btnEl3.css("color", "#00000080");
        btnEl3.css("fontSize", "4vmin");
    }
    if (shieldCharge >= 5) {
        btnEl4.css("color", "#dedede");
        btnEl4.css("fontSize", "5vmin");
    } else {
        btnEl4.css("color", "#00000080");
        btnEl4.css("fontSize", "4vmin");
    }
};

function dynamicBar() {
    $(`#enemy-health-bar`).css("width", `${(currentEnemyHealth / currentEnemy.health) * 100}%`);
    $(`#player-health-bar`).css("width", `${(user.health / 20) * 100}%`);
    $(`#player-shield-bar`).css("width", `${(user.shield / 5) * 100}%`);
};

function defaultDisplay() {
    btnEl1.css("color", "#dedede");
    btnEl2.css("color", "#dedede");
    btnEl2.css("fontSize", "5vmin");
    btnEl3.css("color", "#dedede");
    btnEl3.css("fontSize", "5vmin");
    btnEl4.css("color", "#dedede");
    btnEl4.css("fontSize", "5vmin");
}

////////////////////////////////CONTROLS//////////////////////////////////////////
function pageHandler(p) {
    msgDisplay.text(``);
    scoreDisplay.text(``);
    if (p === 0) {
        mainPage();
    }
    if (p === 1) {
        gameplayPage();
    } else {
        $(`.page-1-node`).remove();
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
};

btnEl1.on('click', buttonTester1);
function buttonTester1() {
    if (page === 0) {
        init();
        nameEnter();
        newEnemy();
        pageHandler(1);
    } else if (page === 1) {
        pulsebeamAttack();
    } else if (page === 2) {
        init();
        nameEnter();
        newEnemy();
        pageHandler(1);
    } else if (page === 3) {
        init();
        nameEnter();
        newEnemy();
        pageHandler(1);
    } else if (page === 4) {
        pageHandler(0);
    }
};

btnEl2.on('click', buttonTester2);
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
    }
};

btnEl3.on('click', buttonTester3);
function buttonTester3() {
    if (page === 0) {
        window.close();
    } else if (page === 1) {
        repair();
    } else if (page === 2) {
        window.close();
    } else if (page === 3) {
    } else if (page === 4) {
    }
};

btnEl4.on('click', buttonTester4);
function buttonTester4() {
    if (page === 0) {
    } else if (page === 1) {
        shield();
    } else if (page === 2) {
    } else if (page === 3) {
        window.close();
    } else if (page === 4) {
    }
};

////////////////////////////DEFENSIVE MOVES////////////////////////////////////////
function repair() {
    if (repairCharge >= 10) {
        repairCharge = 0;
        cannonCharge += 1;
        shieldCharge += 1;
        if (user.health < 20) {
            user.health += 5;
            alert('Ship repaired by 5!');
        } else {
            alert(`Ship repaired by ${25 - user.health}!`);
            user.health += 25 - user.health;
        }
        enemyAttack();
    } else {
        scoreDisplay.text(``);
        msgDisplay.text(`${10 - repairCharge} turns to charge repair`);
        setTimeout(() => {
            msgDisplay.text(``);
            scoreDisplay.text(`Score: ${user.score}`);
        }, 1200);
    }
};

function shield() {
    if (shieldCharge >= 5) {
        if (user.shield < 5) {
            shieldCharge = 0;
            if (user.shield > 3) {
                alert(`Shield regenerated by ${5 - user.shield}`);
                user.shield += 5 - user.shield;
            } else {
                user.shield += 2;
                alert(`Shield regenerated by 2`);
            }
            if (user.shield > 5) {
                user.shield = 5;
            }
            enemyAttack();
        } else {
            scoreDisplay.text(``);
            msgDisplay.text(`shield fully regenerated`);
            setTimeout(() => {
                msgDisplay.text(``);
                scoreDisplay.text(`Score: ${user.score}`);
            }, 1200);
        }
    } else {
        scoreDisplay.text(``);
        msgDisplay.text(`${5 - shieldCharge} turns to charge shield`);
        setTimeout(() => {
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
        msgDisplay.text(`${user.lazercannon.baseCharge - cannonCharge} turns to charge lazercannon.`);
        setTimeout(() => {
            msgDisplay.text(``);
            scoreDisplay.text(`Score: ${user.score}`);
        }, 1200);
    }
};

function enemyAttack() {
    if (Math.random() < currentEnemy.accuracy) {
        let damage;
        if (user.shield > 0) {
            if (currentEnemy.damage - user.shield > 0) {
                damage = currentEnemy.damage - user.shield;
            } else {
                damage = 0;
            }
            user.shield -= currentEnemy.damage;
            if (user.shield < 0) {
                user.shield = 0;
            }
        } else {
            damage = currentEnemy.damage;
        }
        user.health -= damage;
        alert(`${currentEnemy.name} hit ${user.name} for ${currentEnemy.damage} damage!`);
        testDeath();
    } else {
        alert(`${currentEnemy.name} missed ${user.name}!`);
        gameplayPage();
    }
};

/////////////////////////ENEMY GENERATORS///////////////////////////////
function newEnemy() {
    currentEnemy = aliens[Math.floor(Math.random() * aliens.length)];
    currentEnemyHealth = currentEnemy.health;
    enemyAlert(0);
};

function newBossEnemy() {
    currentEnemy = bosses[bossCount];
    currentEnemyHealth = currentEnemy.health;
    bossCount += 1;
    enemyAlert(1);
};

function enemyAlert(x) {
    if (x === 0) {
        alert(`A ${currentEnemy.name} approaches...`);
    }
    if (x === 1) {
        alert(`BOSS FIGHT!\n\nThe ${currentEnemy.name} approaches...`);
    }
};

//////////////////////////////////TESTS///////////////////////////////////////////
function testDeath (x) {
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
        if (user.health <= 0) {
            pageHandler(2);
        } else {
            gameplayPage();
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
                user.health = 20;
                user.shield = 5;
                newBossEnemy();
                gameplayPage();
            } else if (enemiesDefeated === bossRound[i] + 1) {
                bool = false;
                user.health = 20;
                user.shield = 5;
                newEnemy();
                gameplayPage();
            }
        }
    }
    if (bool === true) {
        newEnemy();
        gameplayPage();
    }
};