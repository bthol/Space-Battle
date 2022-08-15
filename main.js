//////////////////////////////MODULES//////////////////////////////////
import { user, aliens, bosses, bossRound } from './JS-Modules/dataStructures.js';

///////////////////////STATE VARIABLES////////////////////////////////
let page;

let cannonCharge = 0;
let repairCharge = 0;
let shieldCharge = 0;

let currentEnemy;
let enemyDamage;
let enemiesDefeated = 0;
let bossCount = 0;

const scoreBoard = [
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

///////////////////////////EVENT LISTENERS///////////////////////////////
const btnEl1 = $(`#btn1`);
btnEl1.on('click', buttonTester1);

const btnEl2 = $(`#btn2`);
btnEl2.on('click', buttonTester2);

const btnEl3 = $(`#btn3`);
btnEl3.on('click', buttonTester3);

const btnEl4 = $(`#btn4`);
btnEl4.on('click', buttonTester4);

const msgDisplay = $(`#msg-display`);

/////////////////////////INITIALIZATION/////////////////////////////////
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

/////////////////////////User Data////////////////////////////////////////
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

    msgDisplay.text(`Welcome to the Space Battle main menu.`);
    btnEl1.text(`New Game`);
    btnEl2.text(`ScoreBoard`);
    btnEl3.text(``);
    btnEl4.text(`Quit`);
    defaultDisplay();
};

function gameplayPage() {
    page = 1;

    //NODE RESET
    $(`.page-1-node`).remove();
    // PLAYER
    $(`#player-display`).append(`<p class="page-1-node">Player: ${user.name}</p>`);
    $(`#player-display`).append(`<p class="page-1-node">Hull Integrity: ${user.hull}</p>`);
    $(`#player-display`).append(`<p class="page-1-node">Shield Level: ${user.shield}</p>`);
    $(`#player-display`).append(`<p class="page-1-node">Score: ${user.score}</p>`);
    //ENEMY
    $(`#enemy-display`).append(`<p class="page-1-node">Enemy Type: ${currentEnemy.name}</p>`);
    $(`#enemy-display`).append(`<p class="page-1-node">Lifeforce: ${enemyDamage}</p>`);
    // MESSAGE
    msgDisplay.text(``);
    // CONTROLS
    btnEl1.text(`Pulsebeam`);
    btnEl2.text(`Lazercannon`);
    btnEl3.text(`Repair`);
    btnEl4.text(`Shield`);
    dynamicDisplay();
};

function gameoverPage() {
    page = 2;

    msgDisplay.innerText = `Defeat!\n\n${user.name} = ${user.score}`;
    btnEl1.text(`New Game`);
    btnEl2.text(`Main Menu`);
    btnEl3.text(``);
    btnEl4.text(`Quit`);
    defaultDisplay();
};

function gameWinPage() {
    page = 3;

    msgDisplay.text(`You Win!\n\n${user.name} = ${user.score}`);
    btnEl1.text(`New Game`);
    btnEl2.text(`Main Menu`);
    btnEl3.text(``);
    btnEl4.text(`Quit`);
    defaultDisplay();
};

function scoreboardPage() {
    page = 4;

    for (let i = 0; i < scoreBoard.length; i++) {
        msgDisplay.append(`<p class="page-4-node">${scoreBoard[i].name} : ${scoreBoard[i].score}</p>`)
    }
    btnEl1.text(`Back`);
    btnEl2.text(``);
    btnEl3.text(``);
    btnEl4.text(``);
    defaultDisplay();
};

function pageHanlder(p) {
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

//////////////////////////////////DISPLAY/////////////////////////////////
function dynamicDisplay() {
    if (cannonCharge >= 3) {
        btnEl2.css("color", "#dedede");
        btnEl2.css("fontSize", "x-large");
    } else {
        btnEl2.css("color", "#00000080");
        btnEl2.css("fontSize", "medium");
    }
    if (repairCharge >= 10) {
        btnEl3.css("color", "#dedede");
        btnEl3.css("fontSize", "x-large");
    } else {
        btnEl3.css("color", "#00000080");
        btnEl3.css("fontSize", "medium");
    }
    if (shieldCharge >= 5) {
        btnEl4.css("color", "#dedede");
        btnEl4.css("fontSize", "x-large");
    } else {
        btnEl4.css("color", "#00000080");
        btnEl4.css("fontSize", "medium");
    }
};

function defaultDisplay() {
    btnEl1.css("color", "#dedede");
    btnEl2.css("color", "#dedede");
    btnEl3.css("color", "#dedede");
    btnEl4.css("color", "#dedede");
}

////////////////////////////////CONTROLS//////////////////////////////////////////
function buttonTester1() {
    if (page === 0) {
        nameEnter();
        newEnemy();
        gameplayPage();
    } else if (page === 1) {
        pulsebeamAttack();
    } else if (page === 2) {
        init();
        nameEnter();
        newEnemy();
        gameplayPage();
    } else if (page === 3) {
        init();
        nameEnter();
        newEnemy();
        gameplayPage();
    } else if (page === 4) {
        mainPage();
    }
};
function buttonTester2() {
    if (page === 0) {
        pageHanlder(4);
    } else if (page === 1) {
        lazercannonAttack();
    } else if (page === 2) {
        mainPage();
    } else if (page === 3) {
        mainPage();
    } else if (page === 4) {
    }
};
function buttonTester3() {
    if (page === 0) {
    } else if (page === 1) {
        repair();
    } else if (page === 2) {
    } else if (page === 3) {
    } else if (page === 4) {
    }
};
function buttonTester4() {
    if (page === 0) {
        window.close();
    } else if (page === 1) {
        shield();
    } else if (page === 2) {
        window.close();
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
        alert(`repair: ${10 - repairCharge} turns to charge`);
    }
};

function shield() {
    if (shieldCharge >= 5) {
        shieldCharge = 0;
        user.shield += 2;
        alert(`Shield regenerated by 2`);
        enemyAttack();
    } else {
        alert(`shield: ${5 - shieldCharge} turns to charge`);
    }
};

//////////////////////////////OFFENSIVE MOVES///////////////////////////////////////
function pulsebeamAttack() {
    cannonCharge += 1;
    repairCharge += 1;
    shieldCharge += 1;
    if (Math.random() < user.pulsebeam.accuracy) {
        enemyDamage -= user.pulsebeam.firepower;
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
            enemyDamage -= user.lazercannon.firepower;
            alert(`Lazercannon attack hit ${currentEnemy.name}!`);
            testDeath(1);
        } else {
            alert(`Lazercannon attack missed ${currentEnemy.name}!`);
            enemyAttack();
            gameplayPage();
        }
    } else {
        alert(`lazercannon needs ${3 - cannonCharge} turns to charge.`);
        gameplayPage();
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
    enemyDamage = currentEnemy.hull;
    enemyAlert(0);
};

function newBossEnemy() {
    currentEnemy = bosses[bossCount];
    enemyDamage = currentEnemy.hull;
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
        if (enemyDamage <= 0) {
            enemiesDefeated += 1;
            user.score += currentEnemy.score;
            alert("Alien obliterated!");
            bossTest();
        } else {
            enemyAttack();
        }
    } else {
        if (user.hull <= 0) {
            gameoverPage();
        } else {
            gameplayPage();
        }
    }
};

function bossTest() {
    let bool = true;
    if (enemiesDefeated === bossRound[bossRound.length - 1] + 1) {
        bool = false;
        gameWinPage();
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