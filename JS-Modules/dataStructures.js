const user = {
    name: "User",
    score: 0,
    health: {level: 200, maxLevel: 200, minLevel: 0},
    repair: {rechargeAmmount: 50, rechargeTime: 10},
    shield: {level: 50, maxLevel: 50, minLevel: 0, rechargeAmmount: 50, rechargeTime: 5},
    pulsebeam: {damage: 20, accuracy: .6},
    lazercannon: {baseDamage: 30, baseCharge: 5, overDamage: 50, overCharge: 3, accuracy: 1}
};

const aliens = [
    {name: "Subort", maxHealth: 20, score: 100, damage: 10, accuracy: .4},
    {name: "Tankbug", maxHealth: 80, score: 300, damage: 20, accuracy: .3},
    {name: "Sentinel", maxHealth: 60, score: 200, damage: 15, accuracy: .8}
];

const bosses = [
    {name: "Morphuos", maxHealth: 100, score: 5000, damage: 30, accuracy: .3},
    {name: "Grotek", maxHealth: 130, score: 5000, damage: 50, accuracy: .2},
    {name: "Harvester", maxHealth: 150, score: 10000, damage: 45, accuracy: .4},
    {name: "Mantlebrot", maxHealth: 200, score: 10000, damage: 40, accuracy: .4},
    {name: "Liminal", maxHealth: 250, score: 20000, damage: 60, accuracy: .4}
];

const bossRound = [10, 20, 30, 40, 50];

export {
    user,
    aliens,
    bosses,
    bossRound
};