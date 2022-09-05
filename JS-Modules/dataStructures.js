const user = {
    name: "User",
    score: 0,
    hull: 20,
    shield: 4,
    pulsebeam: {firepower: 2, accuracy: .6},
    lazercannon: {firepower: 5, accuracy: .8}
};

const aliens = [
    {name: "Subort", hull: 2, score: 100, firepower: 1, accuracy: .4},
    {name: "Tankbug", hull: 6, score: 300, firepower: 2, accuracy: .4},
    {name: "Sentinel", hull: 4, score: 200, firepower: 1, accuracy: .8}
];

const bosses = [
    {name: "Morphuos", hull: 11, score: 2000, firepower: 3, accuracy: .4},
    {name: "Grotek", hull: 13, score: 2000, firepower: 6, accuracy: .2},
    {name: "Mantlebrot", hull: 16, score: 2000, firepower: 4, accuracy: .4},
    {name: "Harvester", hull: 19, score: 2000, firepower: 4, accuracy: .5},
    {name: "Liminal", hull: 23, score: 5000, firepower: 5, accuracy: .5}
];

const bossRound = [10, 20, 30, 40, 50];

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

export {
    user,
    aliens,
    bosses,
    bossRound,
    scoreBoard
};