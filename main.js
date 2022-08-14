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
const btnEl1 = document.querySelector(`#btn1`);
btnEl1.addEventListener('click', buttonTester1);

const btnEl2 = document.querySelector(`#btn2`);
btnEl2.addEventListener('click', buttonTester2);

const btnEl3 = document.querySelector(`#btn3`);
btnEl3.addEventListener('click', buttonTester3);

const btnEl4 = document.querySelector(`#btn4`);
btnEl4.addEventListener('click', buttonTester4);

const text1 = document.querySelector(`#alert`);
const msgDisplay = document.querySelector(`#msg-display`);

// $(`body`).on("click", () => {console.log("JQuery working")})

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
    text1.innerText = ``;
    msgDisplay.innerText = `Welcome to the Space Battle main menu.`;
    btnEl1.innerText = `New Game`;
    btnEl2.innerText = `ScoreBoard`;
    btnEl3.innerText = ``;
    btnEl4.innerText = `Quit`;
    defaultDisplay();
};

function gameplayPage() {
    page = 1;
    text1.innerText = `Enemy: ${currentEnemy.name} \nLifeforce = ${enemyDamage}\n\nUser: ${user.name}\nHull Integrity = ${user.hull}\nShield Integrity = ${user.shield}\n\nScore = ${user.score}`;
    msgDisplay.innerText = ``;
    btnEl1.innerText = `Pulsebeam`;
    btnEl2.innerText = `Lazercannon`;
    btnEl3.innerText = `Repair`;
    btnEl4.innerText = `Shield`;
    dynamicDisplay();
};

function gameoverPage() {
    page = 2;
    text1.innerText = `Defeat!\n\n${user.name} = ${user.score}`;
    msgDisplay.innerText = ``;
    btnEl1.innerText = `New Game`;
    btnEl2.innerText = `Main Menu`;
    btnEl3.innerText = ``;
    btnEl4.innerText = `Quit`;
    defaultDisplay();
};

function gameWinPage() {
    page = 3;
    text1.innerText = `You Win!\n\n${user.name} = ${user.score}`;
    msgDisplay.innerText = ``;
    btnEl1.innerText = `New Game`;
    btnEl2.innerText = `Main Menu`;
    btnEl3.innerText = ``;
    btnEl4.innerText = `Quit`;
    defaultDisplay();
};

function scoreboardPage() {
    page = 4;
    text1.innerText = `Scoreboard\n\n${scoreBoard[0].name} : ${scoreBoard[0].score}\n${scoreBoard[1].name} : ${scoreBoard[1].score}\n${scoreBoard[2].name} : ${scoreBoard[2].score}\n${scoreBoard[3].name} : ${scoreBoard[3].score}\n${scoreBoard[4].name} : ${scoreBoard[4].score}\n${scoreBoard[5].name} : ${scoreBoard[5].score}\n${scoreBoard[6].name} : ${scoreBoard[6].score}\n${scoreBoard[7].name} : ${scoreBoard[7].score}\n${scoreBoard[8].name} : ${scoreBoard[8].score}\n${scoreBoard[9].name} : ${scoreBoard[9].score}\n`;
    msgDisplay.innerText = ``;
    btnEl1.innerText = `Back`;
    btnEl2.innerText = ``;
    btnEl3.innerText = ``;
    btnEl4.innerText = ``;
    defaultDisplay();
};

//////////////////////////////////DISPLAY/////////////////////////////////
function dynamicDisplay() {
    if (cannonCharge >= 3) {
        btnEl2.style.color = "#dedede";
    } else {
        btnEl2.style.color = "#00000080";
    }
    if (repairCharge >= 10) {
        btnEl3.style.color = "#dedede";
    } else {
        btnEl3.style.color = "#00000080";
    }
    if (shieldCharge >= 5) {
        btnEl4.style.color = "#dedede";
    } else {
        btnEl4.style.color = "#00000080";
    }
};

function defaultDisplay() {
    btnEl1.style.color = "#dedede";
    btnEl2.style.color = "#dedede";
    btnEl3.style.color = "#dedede";
    btnEl4.style.color = "#dedede";
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
        scoreboardPage();
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