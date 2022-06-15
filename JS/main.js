///////////////////////GLOBAL VARIABLES////////////////////////////////
let page;

let cannonCharge = 0;
let repairCharge = 0;

let currentShip;
let enemyDamage;
let enemiesDefeated = 0;
let bossCount = 0;

const bossRound = [2, 4, 6, 8, 10];

/////////////////////data structures (Characters)/////////////////////////////////
const userShip = {
    name: "User",
    score: 0,
    hull: 25,
    pulsebeam: {firepower: 2, accuracy: .6},
    lazercannon: {firepower: 5, accuracy: .8}
};

const aliens = [
    {name: "Subort", hull: 2, score: 100, firepower: 1, accuracy: .4},
    {name: "Tanker", hull: 6, score: 300, firepower: 2, accuracy: .4},
    {name: "Sentinel", hull: 4, score: 200, firepower: 1, accuracy: .8}
];

const bosses = [
    {name: "Morphuos", hull: 11, score: 2000, firepower: 3, accuracy: .5},
    {name: "Mantlebrot", hull: 16, score: 2000, firepower: 4, accuracy: .4},
    {name: "Grotek", hull: 13, score: 2000, firepower: 6, accuracy: .3},
    {name: "Harvester", hull: 19, score: 2000, firepower: 4, accuracy: .5},
    {name: "Liminal", hull: 23, score: 2000, firepower: 5, accuracy: .5}
];

////////////////////////DOM Element Selectors////////////////////////
const btnEl1 = document.querySelector(`#btn1`);
const btnEl2 = document.querySelector(`#btn2`);
const btnEl3 = document.querySelector(`#btn3`);
const btnEl4 = document.querySelector(`#btn4`);
const promptEl = document.querySelector(`#prompt`);
const alertEl = document.querySelector(`#alert`);

////////////////////////Event Listeners///////////////////////////////
btnEl1.addEventListener('click', buttonTester1);
btnEl2.addEventListener('click', buttonTester2);
btnEl3.addEventListener('click', buttonTester3);
btnEl4.addEventListener('click', buttonTester4);

/////////////////////////initilization/////////////////////////////////
function init() {
    userShip.hull = 25;
    turn = -1;
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
    mainMenu();
};
init();

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

/////////////////////////GAME PAGE////////////////////////////////////////
function mainMenu() {
    page = 0;
    alertEl.innerText = `Welcome to the Space Battle main menu.`;
    btnEl1.innerText = `Play`;
    btnEl2.innerText = `Restart`;
    btnEl3.innerText = `Quit`;
    btnEl4.innerText = ``;
    promptEl.innerText = ``;
};

function gameplayMenu() {
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

function gameOverMenu() {
    page = 2;
    alertEl.innerText = `Defeat!`;
    btnEl1.innerText = `New Game`;
    btnEl2.innerText = `Quit`;
    btnEl3.innerText = ``;
    btnEl4.innerText = ``;
    promptEl.innerText = ``;
    if (move === "1") {
        init();
    } else if (move === "2") {
    } else {
        alert("Invalid input!");
        gameOverMenu();
    }
};

function gameWinMenu() {
    page = 3;
    alertEl.innerText = `You Win!\n\n${userShip.name} = ${userShip.score}`;
    btnEl1.innerText = `New Game`;
    btnEl2.innerText = ``;
    btnEl3.innerText = ``;
    btnEl4.innerText = ``;
    promptEl.innerText = ``;
}

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
            gameplayMenu();
        }
    } else {
        alert(`lazercannon needs ${3 - cannonCharge} turns to charge.`);
        gameplayMenu();
    }
};

function alienAttack() {
    if (Math.random() < currentShip.accuracy) {
        userShip.hull -= currentShip.firepower;
        alert(`${currentShip.name} hit ${userShip.name}!`);
        testDeath();
    } else {
        alert(`${currentShip.name} missed ${userShip.name}!`);
        gameplayMenu();
    }
};

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
            gameOverMenu();
        } else {
            gameplayMenu();
        }
    }
};

function winTest() {
    if (enemiesDefeated === bossRound[bossRound.length - 1] + 1) {
        gameWinMenu();
    }
}

function bossTest() {
    let bool = true;
    for (let i = 0; i < bossRound.length; i++) {
        if (enemiesDefeated === bossRound[i]) {
            bool = false;
            userShip.hull = 25;
            newBossEnemy();
            gameplayMenu();
        } else if (enemiesDefeated === bossRound[i] + 1) {
            bool = false;
            userShip.hull = 25;
            newEnemy();
            gameplayMenu();
        }
    }
    if (bool === true) {
        newEnemy();
        gameplayMenu();
    }
}

function buttonTester1() {
    if (page === 0) {
        nameEnter();
        newEnemy();
        gameplayMenu();
    } else if (page === 1) {
        pulsebeamAttack();
    } else if (page === 2) {
        init();
    } else if (page === 3) {
        init();
    }
};
function buttonTester2() {
    if (page === 0) {
        init();
    } else if (page = 1) {
        lazercannonAttack();
    } else if (page === 2) {
        alertEl.innerText = `The game has been quit.`;
    } else if (page === 3) {
    }
};
function buttonTester3() {
    if (page === 0) {
        alertEl.innerText = `The game has been quit.`;
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