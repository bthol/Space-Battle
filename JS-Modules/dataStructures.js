const user = {
    name: "User",
    score: 0,
    health: {level: 200, maxLevel: 200, minLevel: 0},
    repair: {rechargeAmmount: 100, rechargeTime: 10},
    shield: {level: 50, maxLevel: 50, minLevel: 0, rechargeAmmount: 50, rechargeTime: 10},
    pulsebeam: {damage: 25, accuracy: .6},
    lazercannon: {baseDamage: 50, baseCharge: 5, overDamage: 100, overCharge: 8, accuracy: .9},
};

const aliens = [
    {name: "Subort", maxHealth: 25, score: 100, damage: 10, accuracy: .5},
    {name: "Crawler", maxHealth: 50, score: 200, damage: 10, accuracy: .4},
    {name: "Taurack", maxHealth: 75, score: 300, damage: 10, accuracy: .3},
    {name: "Sentinel", maxHealth: 100, score: 500, damage: 15, accuracy: .7},
    {name: "Abdominan", maxHealth: 125, score: 500, damage: 20, accuracy: .2},
];

const bosses = [
    {name: "Morphuos", maxHealth: 200, score: 5000, damage: 20, accuracy: .3},
    {name: "Grotek", maxHealth: 200, score: 5000, damage: 50, accuracy: .2},
    {name: "Harvester", maxHealth: 200, score: 10000, damage: 45, accuracy: .3},
    {name: "Mantlebrot", maxHealth: 200, score: 10000, damage: 40, accuracy: .4},
    {name: "Liminal", maxHealth: 250, score: 50000, damage: 75, accuracy: .3},
];

// const bossRound = [10, 20, 30, 40, 50];
const bossRound = [1];

export {
    user,
    aliens,
    bosses,
    bossRound
};