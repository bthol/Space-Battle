////////////////////////event listeners////////////////
// document.querySelector(`#text1`).innerText = `${msg}`;
let testElement = $(`#text1`).innerHtml = `${msg}`;
let msg = "test text";
console.log(testElement);
document.querySelector(`#btn1`);





/////////////////////data structures/////////////////////////////////
const userShip = {
    name: "user",
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
    {name: "Mothership", hull: 20, firepower: 4, accuracy: .5}
];

///////////////////////GLOBAL VARIABLES////////////////////////////////
let turn;

let cannonCharge;
let repairCharge;

let currentShip;
let enemiesDefeated;
let bossCount = 0;

/////////////////////////initilization/////////////////////////////////
function init() {
    userShip.hull = 25;
    turn = 1;
    cannonCharge = 0;
    repairCharge = 0;
    enemiesDefeated = 0;
    bossCount = 0;
    gameStart();
};
init();

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

/////////////////////////GAME PAGE CONTROL//////////////////////////////////////
function gameStart() {
    let move = prompt(`Welcome to Space Battle.\n\nEnter ship name to start, or enter q to quit.`);
    if (move === "q") {
    } else {
        userShip.name = move
        newEnemy();
        playerMove();
    }
};

function gameOverMenu() {
    let move = prompt(`DEFEAT!\n\nEnter 1 to start over.\nEnter 2 to exit game.`);
    if (move === "1") {
        init();
    } else if (move === "2") {
    } else {
        alert("Invalid input!");
    }
};

/////////////////////////////MOVE CONTROL///////////////////////////////////
//fix the negative turns to charge displayed in prompt
function playerMove() {
    let move = prompt(`${userShip.name}\nEnemy type: ${currentShip.name}\n\nAliens Obliterated = ${enemiesDefeated}\nHull integrity = ${userShip.hull}\n\nEnter '1' to use a pulsebeam attack\nEnter '2' to use a lazercannon attackLazer (${3 - cannonCharge} turns to charge.)\nEnter '3' to use repair (${10 - repairCharge} turns to charge.)`);
    if (move === "1") {
        cannonCharge += 1;
        repairCharge += 1;
        pulsebeamAttack();
    } else if (move === '2') {
        if (cannonCharge >= 3) {
            repairCharge += 1;
            cannonCharge = 0;
            lazercannonAttack();
        } else {
            alert(`lazercannon needs ${3 - cannonCharge} turns to charge.`);
            playerMove();
        }
    } else if (move === '3') {
        if (repairCharge >= 10) {
            cannonCharge += 1;
            repairCharge = 0;
            repair();
        } else {
            alert(`repair needs ${10 - repairCharge} turns to charge`)
            playerMove();
        }
    } else {
        alert("Invalid input!");
        playerMove();
    }
};

function alienMove() {
    alienAttack()
};

////////////////////////////////ALIEN MOVE///////////////////////////////////////
function alienAttack() {
    if (Math.random() < currentShip.accuracy) {
        userShip.hull -= currentShip.firepower;
        alert(`${currentShip.name} hit ${userShip.name}!`);
        testDeath();
    } else {
        alert(`${currentShip.name} missed ${userShip.name}!`);
        turnHandler();
    }
};

////////////////////////////DEFENSIVE MOVES////////////////////////////////////////
function repair() {
    if (userShip.hull < 20) {
        userShip.hull += 5;
        alert('Ship repaired by 5!');
    } else {
        alert(`Ship repaired by ${25 - userShip.hull}!`);
        userShip.hull += 25 - userShip.hull;
    }
    turnHandler();
};

//////////////////////////////OFFENSIVE MOVES///////////////////////////////////////
function pulsebeamAttack() {
    if (Math.random() < userShip.pulsebeam.accuracy) {
        currentShip.hull -= userShip.pulsebeam.firepower;
        alert(`Pulsebeam attack hit the ${currentShip.name}!`);
        testDeath(1);
    } else {
        alert(`Pulsebeam attack missed the ${currentShip.name}!`);
        turnHandler();
    }
};

function lazercannonAttack() {
    if (Math.random() < userShip.pulsebeam.accuracy) {
        currentShip.hull -= userShip.lazercannon.firepower;
        alert(`Lazercannon attack hit ${currentShip.name}!`);
        testDeath(1);
    } else {
        alert(`Lazercannon attack missed ${currentShip.name}!`);
        turnHandler();
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
            turnHandler();
        }
    } else {
        if (userShip.hull <= 0) {
            gameOverMenu();
        } else {
            turnHandler();
        }
    }
};

function bossTest() {
    if (enemiesDefeated === 25 || enemiesDefeated === 50 || enemiesDefeated === 75) {
        bossEnemy();
        playerMove();
    }
}

function turnHandler() {
    turn = turn * -1;
    if (turn === 1) {
        playerMove();
    } else if (turn === -1) {
        alienMove();
    }
};

