const user = {
    name: "User",
    score: 0,
    health: 200,
    shield: 50,
    pulsebeam: {damage: 20, accuracy: .6},
    lazercannon: {baseDamage: 40, baseCharge: 3, overDamage: 80, overCharge: 10, accuracy: .8}
};

const aliens = [
    {name: "Subort", health: 20, score: 100, damage: 10, accuracy: .4},
    {name: "Tankbug", health: 70, score: 300, damage: 20, accuracy: .4},
    {name: "Sentinel", health: 60, score: 200, damage: 15, accuracy: .8}
];

const bosses = [
    {name: "Morphuos", health: 100, score: 2000, damage: 30, accuracy: .3},
    {name: "Grotek", health: 130, score: 2000, damage: 50, accuracy: .2},
    {name: "Mantlebrot", health: 150, score: 2000, damage: 45, accuracy: .4},
    {name: "Harvester", health: 200, score: 2000, damage: 40, accuracy: .4},
    {name: "Liminal", health: 250, score: 5000, damage: 60, accuracy: .4}
];

const bossRound = [15];
// const bossRound = [10, 20, 30, 40, 50];

export {
    user,
    aliens,
    bosses,
    bossRound
};