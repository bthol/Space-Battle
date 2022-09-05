//////////////////////////////MODULES//////////////////////////////////
import { user, aliens, bosses, bossRound, scoreBoard } from './JS-Modules/dataStructures.js';

import { stateVars } from './JS-Modules/stateVariables.js';
let { page, cannonCharge, shieldCharge, repairCharge, currentEnemy, enemiesDefeated, bossCount } = stateVars;

import { btnEl1, btnEl2, btnEl3, btnEl4, msgDisplay, scoreDisplay, playerDisplay, enemyDisplay } from './JS-Modules/DOM.js';

/////////////////////////INITIALIZATION/////////////////////////////////
let currentEnemyHealth;

function init() {
    user.hull = 25;
    user.shield = 4;
    user.score = 0;
    page = 0;
    cannonCharge = 0;
    repairCharge = 0;
    enemiesDefeated = 0;
    bossCount = 0;
    mainPage();
};
init();

/////////////////////////USER NAME ENTER////////////////////////////////////////
function nameEnter() {
    const name = prompt("Enter name");
    if (name === "") {
        alert("Invalid input");
        nameEnter();
    } else if (name.length > 0) {
        user.name = name;
    } else {}
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
    playerDisplay.append(`<div class="page-1-node">${user.hull} ${user.shield} <div class="bar-back"><div class="player-health-bar"></div><div class="player-shield-bar"></div></div></div>`);
    // ENEMY
    enemyDisplay.append(`<div class="page-1-node">${currentEnemy.name}</div>`);
    enemyDisplay.append(`<div class="page-1-node">${currentEnemyHealth} <div class="bar-back"><div class="enemy-health-bar"></div></div></div>`);
    // CONTROLS
    btnEl1.text(`Pulsebeam`);
    btnEl2.text(`Lazercannon`);
    btnEl3.text(`Repair`);
    btnEl4.text(`Shield`);
    dynamicDisplay();
};

function gameoverPage() {
    page = 2;

    // MESSAGE
    msgDisplay.text(`Defeat!`);
    // SCORE
    scoreDisplay.text(`${user.name} = ${user.score}`);
    // CONTROLS
    btnEl1.text(`New Game`);
    btnEl2.text(`Main Menu`);
    btnEl3.text(`Quit`);
    btnEl4.text(``);
    defaultDisplay();
};

function gameWinPage() {
    page = 3;

    // MESSAGE
    msgDisplay.text(`You Win!`);
    // SCORE
    scoreDisplay.text(`${user.name} = ${user.score}`)
    // CONTROLS
    btnEl1.text(`New Game`);
    btnEl2.text(`Main Menu`);
    btnEl3.text(``);
    btnEl4.text(`Quit`);
    defaultDisplay();
};

function scoreboardPage() {
    page = 4;

    // MESSAGE
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
function dynamicDisplay() {
    if (cannonCharge >= 3) {
        btnEl2.css("color", "#dedede");
        btnEl2.css("fontSize", "5vmin");
    } else {
        btnEl2.css("color", "#00000080");
        btnEl2.css("fontSize", "4vmin");
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

function defaultDisplay() {
    btnEl1.css("color", "#dedede");
    btnEl2.css("color", "#dedede");
    btnEl3.css("color", "#dedede");
    btnEl4.css("color", "#dedede");
}

function pageHandler(p) {
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

////////////////////////////////CONTROLS//////////////////////////////////////////
btnEl1.on('click', buttonTester1);
function buttonTester1() {
    if (page === 0) {
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
        if (user.hull < 20) {
            user.hull += 5;
            alert('Ship repaired by 5!');
        } else {
            alert(`Ship repaired by ${25 - user.hull}!`);
            user.hull += 25 - user.hull;
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
        if (user.shield < 4) {
            shieldCharge = 0;
            user.shield += 2;
            if (user.shield > 4) {
                user.shield = 4;
            }
            alert(`Shield regenerated by 2`);
        } else {
            alert(`shield fully regenerated`);
        }
        enemyAttack();
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
        currentEnemyHealth -= user.pulsebeam.firepower;
        alert(`Pulsebeam attack hit the ${currentEnemy.name}!`);
        testDeath(1);
    } else {
        alert(`Pulsebeam attack missed the ${currentEnemy.name}!`);
        enemyAttack();
    }
};

function lazercannonAttack() {
    if (cannonCharge >= 3) {
        cannonCharge = 0;
        repairCharge += 1;
        shieldCharge += 1;
        if (Math.random() < user.pulsebeam.accuracy) {
            currentEnemyHealth -= user.lazercannon.firepower;
            alert(`Lazercannon attack hit ${currentEnemy.name}!`);
            testDeath(1);
        } else {
            alert(`Lazercannon attack missed ${currentEnemy.name}!`);
            enemyAttack();
            gameplayPage();
        }
    } else {
        scoreDisplay.text(``);
        msgDisplay.text(`${3 - cannonCharge} turns to charge lazercannon.`);
        setTimeout(() => {
            msgDisplay.text(``);
            scoreDisplay.text(`Score: ${user.score}`);
            pageHandler(1);
        }, 1200);
    }
};

function enemyAttack() {
    if (Math.random() < currentEnemy.accuracy) {
        let damage;
        if (user.shield > 0) {
            if (currentEnemy.firepower - user.shield > 0) {
                damage = currentEnemy.firepower - user.shield;
            } else {
                damage = 0;
            }
            user.shield -= currentEnemy.firepower;
            if (user.shield < 0) {
                user.shield = 0;
            }
        } else {
            damage = currentEnemy.firepower;
        }
        user.hull -= damage;
        alert(`${currentEnemy.name} hit ${user.name}!`);
        testDeath();
    } else {
        alert(`${currentEnemy.name} missed ${user.name}!`);
        gameplayPage();
    }
};

/////////////////////////ENEMY GENERATORS///////////////////////////////
function newEnemy() {
    currentEnemy = aliens[Math.floor(Math.random() * aliens.length)];
    currentEnemyHealth = currentEnemy.hull;
    enemyAlert(0);
};

function newBossEnemy() {
    currentEnemy = bosses[bossCount];
    currentEnemyHealth = currentEnemy.hull;
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
        if (user.hull <= 0) {
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
                user.hull = 25;
                user.shield = 4;
                newBossEnemy();
                gameplayPage();
            } else if (enemiesDefeated === bossRound[i] + 1) {
                bool = false;
                user.hull = 25;
                user.shield = 4;
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