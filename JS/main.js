//////////////////////////////MODULES//////////////////////////////////
import { userShip, aliens, bosses, bossRound } from './modules/dataStructures.js';

///////////////////////STATE VARIABLES////////////////////////////////
let page;

let cannonCharge = 0;
let repairCharge = 0;

let currentShip;
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

/////////////////////////User Data////////////////////////////////////////
function nameEnter() {
    const name = prompt("Enter name");
    if (name === "") {
        alert("Invalid input");
        nameEnter();
    } else if (name.length > 0) {
        userShip.name = name;
    } else {}
};

///////////////////////////EVENT LISTENERS////////////////////////////
const btnEl1 = document.querySelector(`#btn1`);
btnEl1.addEventListener('click', buttonTester1);

const btnEl2 = document.querySelector(`#btn2`);
btnEl2.addEventListener('click', buttonTester2);

const btnEl3 = document.querySelector(`#btn3`);
btnEl3.addEventListener('click', buttonTester3);

const btnEl4 = document.querySelector(`#btn4`);
btnEl4.addEventListener('click', buttonTester4);

const alertEl = document.querySelector(`#alert`);
const promptEl = document.querySelector(`#prompt`);


/////////////////////////INITIALIZATION/////////////////////////////////
function init() {
    userShip.hull = 25;
    userShip.score = 0;
    page = 0;
    cannonCharge = 0;
    repairCharge = 0;
    enemiesDefeated = 0;
    bossCount = 0;
    btnEl1.innerText = `default btn1`;
    btnEl2.innerText = `default btn2`;
    btnEl3.innerText = `default btn3`;
    promptEl.innerText = `default prompt`;
    alertEl.innerText = `default alert`;
    mainPage();
};
init();

/////////////////////////GAME PAGE////////////////////////////////////////
function mainPage() {
    page = 0;
    alertEl.innerText = `Welcome to the Space Battle main menu.`;
    btnEl1.innerText = `New Game`;
    btnEl2.innerText = `ScoreBoard`;
    btnEl3.innerText = ``;
    btnEl4.innerText = ``;
    promptEl.innerText = ``;
};

function gameplayPage() {
    page = 1;
    alertEl.innerText = ``;
    btnEl1.innerText = `Pulsebeam`;
    btnEl2.innerText = `Lazercannon`;
    btnEl3.innerText = `Repair`;
    btnEl4.innerText = ``;
    alertEl.innerText = `Enemy: ${currentShip.name} \nLifeforce = ${enemyDamage}`;
    promptEl.innerText = `User: ${userShip.name}\nHull Integrity = ${userShip.hull}\n\nScore = ${userShip.score}`;
    winTest();
};

function gameoverPage() {
    page = 2;
    alertEl.innerText = `Defeat!\n\n${userShip.name} = ${userShip.score}`;
    btnEl1.innerText = `New Game`;
    btnEl2.innerText = `Main Menu`;
    btnEl3.innerText = ``;
    btnEl4.innerText = ``;
    promptEl.innerText = ``;
};

function gameWinPage() {
    page = 3;
    alertEl.innerText = `You Win!\n\n${userShip.name} = ${userShip.score}`;
    btnEl1.innerText = `New Game`;
    btnEl2.innerText = `Main Menu`;
    btnEl3.innerText = ``;
    btnEl4.innerText = ``;
    promptEl.innerText = ``;
}

function scoreboardPage() {
    page = 4;
    alertEl.innerText = `Scoreboard\n\n${scoreBoard[0].name} : ${scoreBoard[0].score}\n${scoreBoard[1].name} : ${scoreBoard[1].score}\n${scoreBoard[2].name} : ${scoreBoard[2].score}\n${scoreBoard[3].name} : ${scoreBoard[3].score}\n${scoreBoard[4].name} : ${scoreBoard[4].score}\n${scoreBoard[5].name} : ${scoreBoard[5].score}\n${scoreBoard[6].name} : ${scoreBoard[6].score}\n${scoreBoard[7].name} : ${scoreBoard[7].score}\n${scoreBoard[8].name} : ${scoreBoard[8].score}\n${scoreBoard[9].name} : ${scoreBoard[9].score}\n`;
    btnEl1.innerText = `Back`;
    btnEl2.innerText = ``;
    btnEl3.innerText = ``;
    btnEl4.innerText = ``;
    promptEl.innerText = ``;
}

//////////////////////////////////TESTS///////////////////////////////////////////
function testDeath (x) {
    if (x === 1) {
        if (enemyDamage <= 0) {
            enemiesDefeated += 1;
            userShip.score += currentShip.score;
            alert("Alien obliterated!");
            bossTest();
        } else {
            alienAttack();
        }
    } else {
        if (userShip.hull <= 0) {
            gameoverPage();
        } else {
            gameplayPage();
        }
    }
};

function winTest() {
    if (enemiesDefeated === bossRound[bossRound.length - 1] + 1) {
        gameWinPage();
    }
}

function bossTest() {
    let bool = true;
    if (enemiesDefeated === bossRound[bossRound.length - 1] + 1) {
        gameWinPage();
    } else {
        for (let i = 0; i < bossRound.length; i++) {
            if (enemiesDefeated === bossRound[i]) {
                bool = false;
                userShip.hull = 25;
                newBossEnemy();
                gameplayPage();
            } else if (enemiesDefeated === bossRound[i] + 1) {
                bool = false;
                userShip.hull = 25;
                newEnemy();
                gameplayPage();
            }
        }
    }
    if (bool === true) {
        newEnemy();
        gameplayPage();
    }
}

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
        scoreboardPage();
    } else if (page === 1) {
        lazercannonAttack();
    } else if (page === 2) {
        mainPage();
    } else if (page === 3) {
        mainPage();
    }
};
function buttonTester3() {
    if (page === 0) {
    } else if (page === 1) {
        repair();
    } else if (page === 2) {
    } else if (page === 3) {
    }
};
function buttonTester4() {
    if (page === 0) {
    } else if (page === 1) {
    } else if (page === 2) {
    } else if (page === 3) {
    }
};

/////////////////////////ENEMY GENERATORS///////////////////////////////
function newEnemy() {
    currentShip = aliens[Math.floor(Math.random() * aliens.length)];
    enemyDamage = currentShip.hull;
    alert(`A ${currentShip.name} approaches...`);
};

function newBossEnemy() {
    currentShip = bosses[bossCount];
    enemyDamage = currentShip.hull;
    bossCount += 1;
    alert(`BOSS FIGHT!\n\nThe ${currentShip.name} approaches...`);
};

////////////////////////////DEFENSIVE MOVES////////////////////////////////////////
function repair() {
    if (repairCharge >= 10) {
        cannonCharge += 1;
        repairCharge = 0;
        if (userShip.hull < 20) {
            userShip.hull += 5;
            alert('Ship repaired by 5!');
        } else {
            alert(`Ship repaired by ${25 - userShip.hull}!`);
            userShip.hull += 25 - userShip.hull;
        }
        alienAttack();
    } else {
        alert(`repair: ${10 - repairCharge} turns to charge`);
    }
};

//////////////////////////////OFFENSIVE MOVES///////////////////////////////////////
function pulsebeamAttack() {
    cannonCharge += 1;
    repairCharge += 1;
    if (Math.random() < userShip.pulsebeam.accuracy) {
        enemyDamage -= userShip.pulsebeam.firepower;
        alert(`Pulsebeam attack hit the ${currentShip.name}!`);
        testDeath(1);
    } else {
        alert(`Pulsebeam attack missed the ${currentShip.name}!`);
        alienAttack();
    }
};

function lazercannonAttack() {
    if (cannonCharge >= 3) {
        repairCharge += 1;
        cannonCharge = 0;
        if (Math.random() < userShip.pulsebeam.accuracy) {
            enemyDamage -= userShip.lazercannon.firepower;
            alert(`Lazercannon attack hit ${currentShip.name}!`);
            testDeath(1);
        } else {
            alert(`Lazercannon attack missed ${currentShip.name}!`);
            alienAttack();
            gameplayPage();
        }
    } else {
        alert(`lazercannon needs ${3 - cannonCharge} turns to charge.`);
        gameplayPage();
    }
};

function alienAttack() {
    if (Math.random() < currentShip.accuracy) {
        userShip.hull -= currentShip.firepower;
        alert(`${currentShip.name} hit ${userShip.name}!`);
        testDeath();
    } else {
        alert(`${currentShip.name} missed ${userShip.name}!`);
        gameplayPage();
    }
};