const user = {
    name: "User",
    score: 0,
    hull: 20,
    shield: 5,
    pulsebeam: {damage: 2, accuracy: .6},
    lazercannon: {baseDamage: 4, baseCharge: 3, overDamage: 8, overCharge: 10, accuracy: .8}
};

const aliens = [
    {name: "Subort", hull: 2, score: 100, damage: 1, accuracy: .4},
    {name: "Tankbug", hull: 7, score: 300, damage: 2, accuracy: .4},
    {name: "Sentinel", hull: 6, score: 200, damage: 1, accuracy: .8}
];

const bosses = [
    {name: "Morphuos", hull: 11, score: 2000, damage: 3, accuracy: .3},
    {name: "Grotek", hull: 13, score: 2000, damage: 6, accuracy: .2},
    {name: "Mantlebrot", hull: 16, score: 2000, damage: 4, accuracy: .4},
    {name: "Harvester", hull: 19, score: 2000, damage: 4, accuracy: .4},
    {name: "Liminal", hull: 23, score: 5000, damage: 5, accuracy: .4}
];

const bossRound = [10];
// const bossRound = [10, 20, 30, 40, 50];

export {
    user,
    aliens,
    bosses,
    bossRound
};