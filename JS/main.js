const ussSchwarzeneggar = {
    hull: 20,
    pulsebeam: {firepower: 2, accuracy: .6},
    lazercannon: {firepower: 5, accuracy: .7}
};

const aliens = [
    {name: "Fleetship", hull: 3, firepower: 2, accuracy: .6},
    {name: "Tank", hull: 6, firepower: 2, accuracy: .6},
    {name: "Sentinel", hull: 3, firepower: 2, accuracy: .8},
    {name: "Mothership", hull: 6, firepower: 4, accuracy: .6}
];

let turn;
let cannonCharge;
let repairCharge;
let currentShip;
let enemiesDefeated;

function init() {
    ussSchwarzeneggar.hull = 20;
    turn = 1;
    cannonCharge = 0;
    repairCharge = 0;
    enemiesDefeated = 0;
    newEnemy();
    playerMove();
};
init();

function newEnemy() {
    currentShip = aliens[Math.floor(Math.random() * 3)];
    alert(`A ${currentShip.name} approaches...`);
};

function bossEnemy() {
    currentShip = aliens[3];
};

function turnHandler() {
    turn = turn * -1;
    if (turn === 1) {
        playerMove();
    } else if (turn === -1) {
        alienMove();
    }
};

//fix the negative turns to charge displayed in prompt
function playerMove() {
    let move = prompt(`Enemy type: ${currentShip.name}\n\nAliens Obliterated = ${enemiesDefeated}\nHull integrity = ${ussSchwarzeneggar.hull}\n\nEnter '1' to use a pulsebeam attack\nEnter '2' to use a lazercannon attackLazer (${3 - cannonCharge} turns to charge.)\nEnter '3' to use repair (${10 - repairCharge} turns to charge.)`);
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

function repair() {
    if (ussSchwarzeneggar.hull < 15) {
        ussSchwarzeneggar.hull += 5;
        alert('Ship repaired by 5!');
    } else {
        ussSchwarzeneggar.hull += 20 - ussSchwarzeneggar.hull;
        alert(`Ship repaired by ${20 - ussSchwarzeneggar.hull}!`);
    }
    turnHandler();
};

function pulsebeamAttack() {
    if (Math.random() < ussSchwarzeneggar.pulsebeam.accuracy) {
        currentShip.hull -= ussSchwarzeneggar.pulsebeam.firepower;
        alert(`Pulsebeam attack hit the ${currentShip.name}!`);
        testDeath(1);
    } else {
        alert(`Pulsebeam attack missed the ${currentShip.name}!`);
        turnHandler();
    }
};

function lazercannonAttack() {
    if (Math.random() < ussSchwarzeneggar.pulsebeam.accuracy) {
        currentShip.hull -= ussSchwarzeneggar.lazercannon.firepower;
        alert(`Lazercannon attack hit ${currentShip.name}!`);
        testDeath(1);
    } else {
        alert(`Lazercannon attack missed ${currentShip.name}!`);
        turnHandler();
    }
};

function alienAttack() {
    if (Math.random() < currentShip.accuracy) {
        ussSchwarzeneggar.hull -= currentShip.firepower;
        alert(`${currentShip.name} hit the USS Schwarzeneggar!`);
        testDeath();
    } else {
        alert(`${currentShip.name} missed USS Schwarzeneggar!`);
        turnHandler();
    }
};

function testDeath (x) {
    if (x === 1) {
        if (currentShip.hull <= 0) {
            enemiesDefeated += 1;
            alert("Enemy ship was obliterated!");
            if (enemiesDefeated === 25) {
                bossEnemy();
                playerMove();
            } else {
            newEnemy();
            playerMove();
            }
        } else {
            turnHandler();
        }
    } else {
        if (ussSchwarzeneggar.hull <= 0) {
            gameOverMenu();
        } else {
            turnHandler();
        }
    }
};

function gameOverMenu() {
    let move = prompt(`DEFEAT!\n\nEnter 1 to start over.\nEnter 2 to exit game.`);
    if (move === "1") {
        init();
    } else if (move === "2" {
    } else {
        alert("Invalid input!");
    }
};
