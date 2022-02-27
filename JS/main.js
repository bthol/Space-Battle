///////////////////////GLOBAL VARIABLES////////////////////////////////
let page;

let cannonCharge = 0;
let repairCharge = 0;

let currentShip;
let enemiesDefeated = 0;
let bossCount = 0;

/////////////////////data structures/////////////////////////////////
const userShip = {
    name: "User1",
    hull: 25,
    pulsebeam: {firepower: 2, accuracy: .6},
    lazercannon: {firepower: 5, accuracy: .75}
};

const aliens = [
    {name: "Fleetship", hull: 3, firepower: 2, accuracy: .6},
    {name: "Tanker", hull: 5, firepower: 1, accuracy: .6},
    {name: "Sentinel", hull: 4, firepower: 2, accuracy: .8}
];

const bosses = [
    {name: "Commandship", hull: 10, firepower: 4, accuracy: .5},
    {name: "Commandship", hull: 10, firepower: 4, accuracy: .5},
    {name: "Commandship", hull: 10, firepower: 4, accuracy: .5},
    {name: "Mothership", hull: 20, firepower: 4, accuracy: .5}
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

/////////////////////////GAME PAGE//////////////////////////////////////////////
function mainMenu() {
    page = 0;
    alertEl.innerText = `Welcome to the Space Battle main menu.`;
    btnEl1.innerText = `Play`;
    btnEl2.innerText = `Restart`;
    btnEl3.innerText = `Quit`;
    promptEl.innerText = ``;
};

function playerMove() {
    page = 1;
    alertEl.innerText = ``;
    btnEl1.innerText = `Pulsebeam`;
    btnEl2.innerText = `Lazercannon`;
    btnEl3.innerText = `Repair`;
    alertEl.innerText = `${currentShip.name}`;
    promptEl.innerText = `User name: ${userShip.name}\nHull integrity = ${userShip.hull}\n\nAliens Obliterated = ${enemiesDefeated}\n\nLazercannon: ${3 - cannonCharge} turns to charge.\nRepair: ${10 - repairCharge} turns to charge.`;
};

function gameOverMenu() {
    page = 2;
    let move = prompt(`DEFEAT!\n\nEnter 1 to start over.\nEnter 2 to exit game.`);
    if (move === "1") {
        init();
    } else if (move === "2") {
    } else {
        alert("Invalid input!");
        gameOverMenu();
    }
};

/////////////////////////ENEMY GENERATORS///////////////////////////////
function newEnemy() {
    currentShip = aliens[Math.floor(Math.random() * aliens.length)];
    alert(`A ${currentShip.name} approaches...`);
};

function bossEnemy() {
    userShip.hull = 25;
    currentShip = bosses[bossCount];
    alert(`BOSS FIGHT!\n\n${currentShip.name} approaches...`);
    bossCount += 1;
};

////////////////////////////////ALIEN MOVE///////////////////////////////////////
function alienAttack() {
    if (Math.random() < currentShip.accuracy) {
        userShip.hull -= currentShip.firepower;
        alert(`${currentShip.name} hit ${userShip.name}!`);
        testDeath();
    } else {
        alert(`${currentShip.name} missed ${userShip.name}!`);
    }
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
        }
    } else {
        alert(`lazercannon needs ${3 - cannonCharge} turns to charge.`);
        playerMove();
    }
};

//////////////////////////////////TESTS///////////////////////////////////////////
function testDeath (x) {
    if (x === 1) {
        if (currentShip.hull <= 0) {
            enemiesDefeated += 1;
            alert("Enemy ship was obliterated!");
            bossTest();
        } else {
            alienAttack();
        }
    } else {
        if (userShip.hull <= 0) {
            gameOverMenu();
        }
    }
};

function bossTest() {
    if (enemiesDefeated === 25 || enemiesDefeated === 50 || enemiesDefeated === 75 || enemiesDefeated === 100) {
        bossEnemy();
        playerMove();
    }
}

function buttonTester1() {
    if (page === 0) {
        newEnemy();
        playerMove();
    } else if (page === 1) {
        pulsebeamAttack();
    } else {
    }
};
function buttonTester2() {
    if (page === 0) {
        init();
    } else if (page = 1) {
        lazercannonAttack();
    } else {
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

