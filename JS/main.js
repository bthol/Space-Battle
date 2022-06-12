///////////////////////GLOBAL VARIABLES////////////////////////////////
let page;

let cannonCharge = 0;
let repairCharge = 0;

let currentShip;
let enemiesDefeated = 0;
let bossCount = 0;

const bossRound = [2, 4, 6, 8, 10];

/////////////////////data structures/////////////////////////////////
const userShip = {
    name: "User",
    hull: 25,
    pulsebeam: {firepower: 2, accuracy: .6},
    lazercannon: {firepower: 5, accuracy: .8}
};

const aliens = [
    {name: "Subort", hull: 2, score: 100, firepower: 1, accuracy: .4},
    {name: "Hust", hull: 2, score: 100, firepower: 2, accuracy: .3},
    {name: "", hull: 6, score: 300, firepower: 2, accuracy: .5},
    {name: "Sentinel", hull: 4, score: 200, firepower: 2, accuracy: .8}
];

const bosses = [
    {name: "Morphuos", hull: 11, score: 1000, firepower: 3, accuracy: .5},
    {name: "Mantlebrot", hull: 16, score: 1000, firepower: 4, accuracy: .4},
    {name: "Grotek", hull: 13, score: 1000, firepower: 6, accuracy: .3},
    {name: "The Harvester", hull: 19, score: 1000, firepower: 4, accuracy: .5},
    {name: "The Liminal", hull: 23, score: 1000, firepower: 5, accuracy: .5}
];

////////////////////////DOM Element Selectors////////////////////////
const btnEl1 = document.querySelector(`#btn1`);
const btnEl2 = document.querySelector(`#btn2`);
const btnEl3 = document.querySelector(`#btn3`);
const promptEl = document.querySelector(`#prompt`);
const alertEl = document.querySelector(`#alert`);

////////////////////////Event Listeners///////////////////////////////
btnEl1.addEventListener('click', buttonTester1)
btnEl2.addEventListener('click', buttonTester2)
btnEl3.addEventListener('click', buttonTester3)

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
    promptEl.innerText = ``;
};

function gameplayMenu() {
    page = 1;
    alertEl.innerText = ``;
    btnEl1.innerText = `Pulsebeam`;
    btnEl2.innerText = `Lazercannon`;
    btnEl3.innerText = `Repair`;
    alertEl.innerText = `Enemy: ${currentShip.name} \nLifeforce = ${currentShip.hull}`;
    promptEl.innerText = `User: ${userShip.name}\nHull Integrity = ${userShip.hull}\n\nScore = ${enemiesDefeated}`;
};

function gameOverMenu() {
    page = 2;
    alertEl.innerText = `Defeat!`;
    btnEl1.innerText = `retry`;
    btnEl2.innerText = `quit`;
    btnEl3.innerText = ``;
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
    alertEl.innerText = `Welcome to the Space Battle main menu.`;
    btnEl1.innerText = `Play`;
    btnEl2.innerText = `Restart`;
    btnEl3.innerText = `Quit`;
    promptEl.innerText = ``;
}

/////////////////////////ENEMY GENERATORS///////////////////////////////
function newEnemy() {
    currentShip = aliens[Math.floor(Math.random() * aliens.length)];
    alert(`A ${currentShip.name} approaches...`);
};

function newBossEnemy() {
    currentShip = bosses[bossCount];
    alert(`BOSS FIGHT!\n\nThe ${currentShip.name} approaches...`);
    bossCount += 1;
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
        gameplayMenu();
    } else {
        alert(`repair: ${10 - repairCharge} turns to charge`)
    }
};

//////////////////////////////OFFENSIVE MOVES///////////////////////////////////////
function pulsebeamAttack() {
    cannonCharge += 1;
    repairCharge += 1;
    if (Math.random() < userShip.pulsebeam.accuracy) {
        currentShip.hull -= userShip.pulsebeam.firepower;
        alert(`Pulsebeam attack hit the ${currentShip.name}!`);
        testDeath(1);
    } else {
        alert(`Pulsebeam attack missed the ${currentShip.name}!`);
        alienAttack();
        gameplayMenu();
    }
};

function lazercannonAttack() {
    if (cannonCharge >= 3) {
        repairCharge += 1;
        cannonCharge = 0;
        if (Math.random() < userShip.pulsebeam.accuracy) {
            currentShip.hull -= userShip.lazercannon.firepower;
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
    }
};

//////////////////////////////////TESTS///////////////////////////////////////////
function testDeath (x) {
    if (x === 1) {
        if (currentShip.hull <= 0) {
            enemiesDefeated += 1;
            alert("Enemy ship obliterated!");
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

function bossTest() {
    if (enemiesDefeated === bossRound[0] || enemiesDefeated === bossRound[1] || enemiesDefeated === bossRound[2] || enemiesDefeated === bossRound[3]) {
        userShip.hull = 25;
        newBossEnemy();
        gameplayMenu();
    } else if (enemiesDefeated === bossRound[0] + 1 || enemiesDefeated === bossRound[1] + 1 || enemiesDefeated === bossRound[2] + 1 || enemiesDefeated === bossRound[3] + 1) {
        userShip.hull = 25;
        newEnemy();
        gameplayMenu();
    } else {
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
    }
};
function buttonTester2() {
    if (page === 0) {
        init();
    } else if (page = 1) {
        lazercannonAttack();
    } else if (page === 2) {
        alertEl.innerText = `The game has been quit.`;
    }
};
function buttonTester3() {
    if (page === 0) {
        alertEl.innerText = `The game has been quit.`;
    } else if (page === 1) {
        repair();
    } else {
    }
};