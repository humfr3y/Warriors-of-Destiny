
const defaultProfile = {
    nickname: "Player",
    avatar: "./images/avatar_default.png",
    level: 1,
    exp: 0,
    maxExp: 100
};

const rarityOrder = ["Common", "Uncommon", "Rare", "Superrare", "Epic", "Mythic", "Legendary"];
const rarityColors = {
    "Common": "#e0e0e0", "Uncommon": "#b6ffb6", "Rare": "#ffd27e",
    "Superrare": "#4d7aff", "Epic": "#b84dff", "Mythic": "#ff4d4d", "Legendary": "#ffa751", "Special": "#4de4ff"
};
const rarityColors2 = {
    "Common": "rarity-common", "Uncommon": "rarity-uncommon", "Rare": "rarity-rare",
    "Superrare": "rarity-superrare", "Epic": "rarity-epic", "Mythic": "rarity-mythic", "Legendary": "rarity-legendary", "Special": "rarity-special"
};

let characters = [
    {
        name: "Speedy",
        code: "Speedy",
        speed: 13.5,
        health: 55,
        maxHealth: 55,
        defense: 0,
        damage: 13,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Uncommon',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: true,
        sound: "speed"
    },
    {
        name: "Slowy",
        code: "Slowy",
        speed: 4.05,
        health: 150,
        maxHealth: 150,
        defense: 10,
        damage: 30,
        element: 'Earth',
        damagetype: 'Damage',
        rarity: 'Uncommon',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: true,
        sound: "heavy"
    },
    {
        name: "Peasant",
        code: "Peasant",
        speed: 8.85,
        health: 70,
        maxHealth: 70,
        defense: 0,
        damage: 15,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Common',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: true,
        description: "A peasant who has worked the land all his life. The only thing he knows is how to swing a pitchfork.",
        sound: "light_swing"
    },
    {
        name: "Lightningbearer",
        code: "Lightning",
        speed: 17.5,
        health: 40,
        maxHealth: 40,
        defense: 0,
        damage: 8,
        element: 'Electric',
        damagetype: 'Ranged Damage',
        rarity: 'Rare',
        ability: "Attacks twice.",
        level: 1,
        canBeCrafted: false,
        sound: "speed"
    },
    {
        name: "Berserker",
        code: "Berserker",
        speed: 7.5,
        health: 70,
        maxHealth: 70,
        defense: 0,
        damage: function () {
            return 25 + ((70 - this.health) / 2);
        },
        element: 'Fire',
        damagetype: 'Damage',
        rarity: 'Mythic',
        ability: "Increases damage as health decreases.",
        level: 1,
        canBeCrafted: false,
        description: "Berserker is the embodiment of rage and madness. He has seen many horrors before falling into bloody despair.",
        sound: "heavy_swing"
    },
    {
        name: "Hero",
        code: "Hero",
        speed: 7.5,
        health: 85,
        maxHealth: 85,
        defense: 10,
        damage: 20,
        element: 'Light',
        damagetype: 'Damage',
        rarity: 'Legendary',
        ability: "After attacking, increases own damage by 5 and defense by 2%.",
        level: 1,
        canBeCrafted: false,
        description: "\"Oh, glorious hero, light in the darkness! May your sword protect us from evil, and your name be sung through the ages.\"",
        sound: "hero"
    },
    {
        name: "Brute",
        code: "Brute",
        speed: 3.33,
        health: 200,
        maxHealth: 200,
        defense: 10,
        damage: 50,
        element: 'Dark',
        damagetype: 'Damage',
        rarity: 'Superrare',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        sound: "heavy"
    },
    {
        name: "Mage",
        code: "Mage",
        speed: 7,
        health: 65,
        maxHealth: 65,
        defense: 0,
        damage: 18,
        element: 'Water',
        damagetype: 'Magic Damage',
        rarity: 'Rare',
        ability: "Attacks ignore enemy defense.",
        level: 1,
        canBeCrafted: false,
        description: "A graduate of the magic academy, skilled in bypassing enemy defenses with magic.",
        sound: "magic"
    },
    {
        name: "Archer",
        code: "Archer",
        speed: 7.5,
        health: 70,
        maxHealth: 70,
        defense: 0,
        damage: 15,
        element: 'Neutral',
        damagetype: 'Ranged Damage',
        rarity: 'Uncommon',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        description: "A master of ranged combat, trained to shoot a bow and defend his village from bandits.",
        sound: "arrow"
    },
    {
        name: "Warrior",
        code: "Warrior",
        speed: 6.33,
        health: 90,
        maxHealth: 90,
        defense: 5,
        damage: 20,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Uncommon',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        description: "A village guardian, able to strike the enemy's heart without hesitation.",
        sound: "swing"
    },
    {
        name: "Killer",
        code: "Killer",
        speed: 9.5,
        health: 40,
        maxHealth: 40,
        defense: 0,
        damage: 40,
        element: 'Dark',
        damagetype: 'Damage',
        rarity: 'Epic',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: true,
        description: "A master of his craft, born to inflict pain even on the most harmless creatures. His heart knows no fear or regret.",
        sound: "light_swing"
    },
    {
        name: "Tank",
        code: "Tank",
        speed: 3.03,
        health: 300,
        maxHealth: 300,
        defense: 10,
        damage: 30,
        element: 'Earth',
        damagetype: 'Damage',
        rarity: 'Rare',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        sound: "heavy"
    },
    {
        name: "Cavalier",
        code: "Cavalier",
        speed: 8,
        health: 75,
        maxHealth: 75,
        defense: 10,
        damage: 15,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Mythic',
        ability: "After attacking, increases damage by 5 and acts first at the start of battle.",
        level: 1,
        canBeCrafted: false,
        description: "A master of horseback riding and elegant combat. His spear and horse are all he needs to protect order in the capital.",
        sound: "spear"
    },
    {
        name: "Infantry",
        code: "Infantry",
        speed: 7.25,
        health: 75,
        maxHealth: 75,
        defense: 5,
        damage: 15,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Common',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        description: "A regular soldier fighting on the front lines. His spear is his loyal companion in battle.",
        sound: "swing"
    },
    {
        name: "Cannoneer",
        code: "Cannoneer",
        speed: 4.25,
        health: 100,
        maxHealth: 100,
        defense: 10,
        damage: 20,
        element: 'Neutral',
        damagetype: 'Area Damage',
        rarity: 'Epic',
        ability: "Can deal heavy damage to 3 targets at once.",
        level: 1,
        canBeCrafted: true,
        description: "A master of artillery, dealing devastating damage with his portable cannon. His cannon is his pride and strength.",
        sound: "cannon"
    },
    {
        name: "Hexadrone",
        code: "Hexadrone",
        speed: 12,
        health: 50,
        maxHealth: 50,
        defense: 0,
        damage: 9,
        element: 'Fire',
        damagetype: 'Area Damage',
        rarity: 'Superrare',
        ability: "Hexadrone can deal damage to 3 targets at once.",
        level: 1,
        canBeCrafted: false,
        sound: "drone"
    },
    {
        name: "Skeleton King",
        code: "SkeletonKing",
        speed: 3.75,
        health: 220,
        maxHealth: 220,
        defense: 0,
        damage: function () {
            return this.health * 0.15;
        },
        hasResurrected: false,
        element: 'Ice',
        damagetype: 'Damage',
        rarity: 'Mythic',
        ability: "Deals damage equal to 15% of own health and resurrects once with 40% max health after death.",
        level: 1,
        canBeCrafted: false,
        sound: "heavy_swing"
    },
    {
        name: "Shield Bearer",
        code: "ShieldBearer",
        speed: 4.25,
        health: 100,
        maxHealth: 100,
        defense: 50,
        damage: 20,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Rare',
        ability: "Absorbs 50% of enemy damage.",
        level: 1,
        canBeCrafted: true,
        description: "Fully armored to protect allies from any blows and projectiles.",
        sound: "shield"
    },
    {
        name: "Skeleton Knight",
        code: "SkeletonKnight",
        speed: 7.5,
        health: 40,
        maxHealth: 40,
        defense: 25,
        damage: 20,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Uncommon',
        ability: "Absorbs 25% of enemy damage.",
        level: 1,
        canBeCrafted: false,
        sound: "swing"
    },
    {
        name: "Iron Skeleton",
        code: "IronSkeleton",
        speed: 6.55,
        health: 10,
        maxHealth: 10,
        defense: 90,
        damage: 25,
        element: 'Ice',
        damagetype: 'Damage',
        rarity: 'Epic',
        ability: "Absorbs 90% of enemy damage.",
        level: 1,
        canBeCrafted: false,
        sound: "swing"
    },
    {
        name: "Jester",
        code: "Jester",
        speed: 7.5,
        health: 100,
        maxHealth: 100,
        defense: 0,
        damage: '10-30',
        element: 'Ice',
        damagetype: 'Ranged Damage',
        rarity: 'Epic',
        ability: "Deals 10 to 30 damage.",
        level: 1,
        canBeCrafted: true,
        sound: "coin"
    },
    {
        name: "Zombie Hunter",
        code: "Zombiehunter",
        speed: 8.33,
        health: 85,
        maxHealth: 85,
        defense: 0,
        damage: 20,
        element: 'Dark',
        damagetype: 'Damage',
        class: 'Undead',
        rarity: 'Superrare',
        ability: "Restores 20 health after attacking.",
        level: 1,
        canBeCrafted: true,
        sound: "zombie"
    },
    {
        name: "Flag Bearer",
        code: "Flag",
        speed: 4,
        health: 100,
        maxHealth: 100,
        defense: 20,
        damage: 20,
        element: 'Light',
        damagetype: 'Damage',
        rarity: 'Legendary',
        ability: "Increases all allies' attack by 5 and defense by 2% when attacking.",
        level: 1,
        canBeCrafted: false,
        description: "The flag bearer is a symbol of hope and courage on the battlefield. His flag inspires allies and strikes fear into the hearts of enemies.",
        sound: "flagbearer"
    },
    {
        name: "Battle Healer",
        code: "Healer",
        speed: 6,
        health: 100,
        maxHealth: 100,
        defense: 5,
        damage: 20,
        element: 'Light',
        damagetype: 'Damage',
        rarity: 'Mythic',
        ability: "Restores 10 health to all allies on the front line when attacking.",
        level: 1,
        canBeCrafted: true,
        description: "A combat medic who uses healing skills right on the front lines, able to both attack and heal as needed.",
        sound: "swing"
    },
    {
        name: "Paladin",
        code: "Paladin",
        speed: 3.13,
        health: 200,
        maxHealth: 200,
        defense: 10,
        damage: 40,
        element: 'Light',
        damagetype: 'Damage',
        rarity: 'Legendary',
        ability: "After attacking, increases all allies' defense by 4%.",
        level: 1,
        canBeCrafted: false,
        description: "A legendary defender who can cover his allies on the battlefield thanks to his pure heart and the power of light.",
        sound: "paladin"
    },
    {
        name: "Void Emperor",
        code: "Voidemperor",
        speed: 5.23,
        health: 120,
        maxHealth: 120,
        defense: 10,
        damage: 8,
        element: 'Dark',
        damagetype: 'Magic Damage',
        rarity: 'Legendary',
        ability: "Deals damage to all enemies on the battlefield and ignores enemy defense.",
        level: 1,
        canBeCrafted: true,
        sound: "voidemperor"
    },
    {
        name: "Saint",
        code: "Saint",
        speed: 6.85,
        health: 70,
        maxHealth: 70,
        defense: 0,
        damage: 25,
        element: 'Light',
        damagetype: 'Healing',
        rarity: 'Superrare',
        ability: "Heals an ally and does not attack.",
        level: 1,
        canBeCrafted: false,
        description: "Seeing his allies suffer, the priest could not stand aside and decided to use the power of the Lord on the battlefield to heal them.",
        sound: "heal"
    },
    {
        name: "Cursed Saint",
        code: "Cursedsaint",
        speed: 6.85,
        health: 80,
        maxHealth: 80,
        defense: 0,
        damage: 10,
        element: 'Dark',
        damagetype: 'Curse Damage',
        rarity: 'Superrare',
        ability: "Reduces the target's damage.",
        level: 1,
        canBeCrafted: false,
        description: "A priest whose heart has blackened, rejected the Lord and accepted the powers of the devil. Instead of healing, he prefers to weaken his enemies.",
        sound: "curse_damage"
    },
    {
        name: "Fallen Saint",
        code: "Fallensaint",
        speed: 5.85,
        health: 90,
        maxHealth: 90,
        defense: 0,
        damage: 10,
        element: 'Dark',
        damagetype: 'Curse Defense',
        rarity: 'Mythic',
        ability: "Reduces the target's defense.",
        level: 1,
        canBeCrafted: false,
        description: "A cursed priest who devoted his life to serving the devil. He cares for nothing but eternal youth and the suffering of others.",
        sound: "curse_defense"
    },
    {
        name: "Hunter",
        code: "Hunter",
        speed: 8,
        health: 70,
        maxHealth: 70,
        defense: 0,
        damage: 12,
        element: 'Neutral',
        damagetype: 'Ranged Damage',
        rarity: 'Common',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        description: "A villager who taught himself to shoot a bow and hunt animals for food. His archery skills also proved useful in battle.",
        sound: "arrow"
    },
    {
        name: "Woodcutter",
        code: "Woodcutter",
        speed: 4.75,
        health: 110,
        maxHealth: 110,
        defense: 0,
        damage: 30,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Common',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        description: "A mature man skilled with an axe. After a fight with bandits in the forest, he realized his skills could be useful in battle.",
        sound: "swing"
    },
    {
        name: "Tetradrone",
        code: "Tetradrone",
        speed: 5.5,
        health: 75,
        maxHealth: 75,
        defense: 5,
        damage: 14,
        element: 'Neutral',
        damagetype: 'Area Damage',
        rarity: 'Rare',
        ability: "Tetradrone can deal damage to 3 targets.",
        level: 1,
        canBeCrafted: false,
        sound: "drone"
    },
    {
        name: "Superdrone",
        code: "Superdrone",
        speed: 10,
        health: 50,
        maxHealth: 50,
        defense: 15,
        damage: 6,
        element: 'Neutral',
        damagetype: 'Area Damage',
        rarity: 'Epic',
        ability: "Superdrone can deal damage to 5 targets.",
        level: 1,
        canBeCrafted: false,
        sound: "drone"
    },
    {
        name: "Ultradrone",
        code: "Ultradrone",
        speed: 7.5,
        health: 60,
        maxHealth: 60,
        defense: 20,
        damage: 5,
        element: 'Neutral',
        damagetype: 'Ranged Damage',
        rarity: 'Mythic',
        ability: "Ultradrone can deal damage to all targets.",
        level: 1,
        canBeCrafted: false,
        sound: "drone"
    },
    {
        name: "Godlike Saint",
        code: "Godlikesaint",
        speed: 6.25,
        health: 80,
        maxHealth: 80,
        defense: 0,
        damage: 10,
        element: 'Neutral',
        damagetype: 'Defense Buff',
        rarity: 'Mythic',
        ability: "Applies divine protection to an ally.",
        level: 1,
        canBeCrafted: false,
        description: "A priest who devoted his life to the Lord and was finally blessed, able to guide allies and grant divine protection.",
        sound: "boost_defense"
    },
    {
        name: "Blood Knight",
        code: "Bloodknight",
        speed: 6.83,
        health: 120,
        maxHealth: 120,
        defense: 0,
        damage: 35,
        element: 'Dark',
        damagetype: 'Damage',
        rarity: 'Superrare',
        ability: "Spends health to deal damage.",
        level: 1,
        canBeCrafted: true,
        description: "A cursed knight, eternally suffering in agony, uses his blood as a weapon and can deal colossal damage.",
        sound: "blood_swing"
    },
    {
        name: "Bombardier",
        code: "Bombardier",
        speed: 3.33,
        health: 130,
        maxHealth: 130,
        defense: 15,
        damage: 20,
        element: 'Neutral',
        damagetype: 'Area Damage',
        rarity: 'Mythic',
        ability: "Can deal damage to 5 targets.",
        level: 1,
        canBeCrafted: false,
        description: "An elite artilleryman, formerly a cannoneer, now uses a huge weapon to destroy multiple enemies at once.",
        sound: "heavy_cannon"
    },
    {
        name: "Crossbowman",
        code: "Crossbowman",
        speed: 4.85,
        health: 90,
        maxHealth: 90,
        defense: 5,
        damage: 30,
        element: 'Neutral',
        damagetype: 'Ranged Damage',
        rarity: 'Uncommon',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        description: "An advanced hunter, able to hit targets from afar, but needs time to reload.",
        sound: "heavy_arrow"
    },
    // {
    //     name: "Robber",
    //     code: "Robber",
    //     speed: 8.15,
    //     health: 80,
    //     maxHealth: 80,
    //     defense: 0,
    //     damage: 20,
    //     element: 'Neutral',
    //     damagetype: 'Damage',
    //     rarity: 'Common',
    //     description: "Static damage.",
    //     level: 1
    // },
    {
        name: "Bandit Thief",
        code: "BanditThief",
        speed: 6.15,
        health: 90,
        maxHealth: 90,
        defense: 0,
        damage: 20,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Uncommon',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        description: "The bandit has no purpose in life except to enjoy the suffering of people and collect stolen gold from merchants.",
        sound: "light_swing"
    },
    {
        name: "Marauder",
        code: "Marauder",
        speed: 5.25,
        health: 120,
        maxHealth: 120,
        defense: 5,
        damage: 30,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Rare',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        description: "A destructive unit in a bandit gang. Feared by many for their powerful maces used in raids.",
        sound: "heavy_swing"
    },
    {
        name: "Gang Leader",
        code: "GangLeader",
        speed: 4.65,
        health: 130,
        maxHealth: 130,
        defense: 5,
        damage: 25,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Superrare',
        ability: "Increases all bandits' damage by 5.",
        level: 1,
        canBeCrafted: false,
        description: "The authority among all bandits and thieves, lives a short and dangerous life, but commands fear and respect.",
        sound: "swing"
    },
    {
        name: "Bandit",
        code: "Bandit",
        speed: 9.25,
        health: 60,
        maxHealth: 60,
        defense: 0,
        damage: 16,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Common',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: true,
        description: "A common vagabond who dedicated his life to robbery and attacking peaceful people.",
        sound: "light_swing"
    },
    {
        name: "Skeleton",
        code: "Skeleton",
        speed: 13,
        health: 20,
        maxHealth: 20,
        defense: 0,
        damage: 20,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Common',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: true,
        sound: "skeleton"
    },
    {
        name: "Corrosion Skeleton",
        code: "corrosionSkeleton",
        speed: 4.35,
        health: 135,
        maxHealth: 135,
        defense: 0,
        damage: 20,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Epic',
        ability: "Reduces target's defense by 5% when attacking.",
        level: 1,
        canBeCrafted: true,
        sound: "skeleton"
    },
    {
        name: "Royal Musketeer",
        code: "royalMusketeer",
        speed: 4.45,
        health: 90,
        maxHealth: 90,
        defense: 10,
        damage: 30,
        element: 'Neutral',
        damagetype: 'Ranged Damage',
        rarity: 'Superrare',
        ability: "Increases musketeers' damage by 5.",
        level: 1,
        canBeCrafted: false,
        description: "An elite soldier serving the king with a powerful musket. Also skilled at commanding musketeer squads.",
        sound: "shoot"
    },
    {
        name: "Musketeer",
        code: "musketeer",
        speed: 5.55,
        health: 75,
        maxHealth: 75,
        defense: 5,
        damage: 24,
        element: 'Neutral',
        damagetype: 'Ranged Damage',
        rarity: 'Uncommon',
        ability: "Static damage",
        level: 1,
        canBeCrafted: false,
        description: "A soldier armed with strong firearms, able to deal powerful ranged damage. Every musketeer dreams of joining the royal army.",
        sound: "shoot"
    },
    {
        name: "Lancer",
        code: "lancer",
        speed: 8,
        health: 60,
        maxHealth: 60,
        defense: 10,
        damage: 25,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Epic',
        ability: "Acts first at the start of battle.",
        level: 1,
        canBeCrafted: true,
        description: "A master of the spear and mounted combat. Thanks to his horse, he can maneuver and strike quickly.",
        sound: "spear"
    },
    {
        name: "Cuirassier",
        code: "cuirassier",
        speed: 4.15,
        health: 100,
        maxHealth: 100,
        defense: 15,
        damage: 30,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Epic',
        ability: "Has 90% defense before his turn.",
        level: 1,
        canBeCrafted: false,
        description: "An elite knight in the densest armor. His defense helps withstand many blows, but his sword is also deadly.",
        sound: "heavy_swing"
    },
    {
        name: "Guard Captain",
        code: "guardCaptain",
        speed: 5,
        health: 90,
        maxHealth: 90,
        defense: 25,
        damage: 20,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Mythic',
        ability: "Increases allies' defense by 10% at the start of battle.",
        level: 1,
        canBeCrafted: false,
        description: "Knows more about defending the kingdom than anyone. The perfect defender, able to use his knowledge for tricks and maneuvers.",
        sound: "heavy_spear"
    },
    {
        name: "Knight",
        code: "knight",
        speed: 5.55,
        health: 100,
        maxHealth: 100,
        defense: 20,
        damage: 25,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Rare',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        description: "A warrior who has taken the hard path of defending the kingdom. Ready to protect his people day and night.",
        sound: "swing"
    },
    {
        name: "Clubman",
        code: "clubman",
        speed: 5.45,
        health: 85,
        maxHealth: 85,
        defense: 5,
        damage: 25,
        penetration: 50,
        element: 'Neutral',
        damagetype: 'Penetrating Damage',
        rarity: 'Rare',
        ability: "Attack penetrates 50% of enemy defense.",
        level: 1,
        canBeCrafted: false,
        description: "A warrior who prefers a club over a sword. He protects his allies with a powerful mace that can break enemy armor.",
        sound: "club"
    },
    {
        name: "Guardian",
        code: "guardian",
        speed: 5.15,
        health: 90,
        maxHealth: 90,
        defense: 15,
        damage: 25,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Rare',
        ability: "Has 50% defense before his turn.",
        level: 1,
        canBeCrafted: false,
        description: "A royal guard trained to maintain order and repel threats. Dreams of becoming an elite guard and personally protecting the king.",
        sound: "spear"
    },
    {
        name: "Halberdier",
        code: "halberdier",
        speed: 4.23,
        health: 110,
        maxHealth: 110,
        defense: 15,
        damage: 40,
        penetration: 50,
        element: 'Neutral',
        damagetype: 'Penetrating Damage',
        rarity: 'Epic',
        ability: "Attack penetrates 50% of enemy defense. Has 65% defense before his turn.",
        level: 1,
        canBeCrafted: false,
        description: "An elite soldier, master of the halberd. His weapon deals powerful blows and keeps enemies at bay.",
        sound: "heavy_spear"
    },
    {
        name: "Cavalier Guard",
        code: "cavalierGuard",
        speed: 7.5,
        health: 90,
        maxHealth: 90,
        defense: 20,
        damage: 25,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Legendary',
        ability: "Frontline acts first at the start of battle.",
        level: 1,
        canBeCrafted: false,
        description: "A cavalier tasked with maintaining order throughout the kingdom, always has tricks for maneuvers and quick attacks.",
        sound: "cavalierguard"
    },
    {
        name: "Mage Student",
        code: "mageStudent",
        speed: 7.55,
        health: 60,
        maxHealth: 60,
        defense: 0,
        damage: 15,
        element: 'Neutral',
        damagetype: 'Magic Damage',
        rarity: 'Uncommon',
        ability: "Attacks ignore enemy defense.",
        level: 1,
        canBeCrafted: false,
        description: "A young mage eager to apply his knowledge in practice, despite the mortal danger.",
        sound: "magic"
    },
    {
        name: "Shaman",
        code: "Shaman",
        speed: 6.5,
        health: 75,
        maxHealth: 75,
        defense: 0,
        damage: 20,
        element: 'Neutral',
        damagetype: 'Magic Damage',
        rarity: 'Superrare',
        ability: "Attacks ignore enemy defense and restores 15 health.",
        level: 1,
        canBeCrafted: false,
        description: "A mage who left civilization and lives in the forest, skilled in elemental magic for protecting nature.",
        sound: "magic"
    },
    {
        name: "Elder",
        code: "Elder",
        speed: 6,
        health: 100,
        maxHealth: 100,
        defense: 5,
        damage: 25,
        element: 'Neutral',
        damagetype: 'Magic Damage',
        rarity: 'Epic',
        ability: "Attacks ignore enemy defense and can trigger one of the buffs: +50% damage, curse defense by 5, or heal by 25.",
        level: 1,
        canBeCrafted: false,
        description: "A wise shaman who has learned all the secrets of elemental magic, able to use many spells to protect his followers.",
        sound: "magic"
    },
    {
        name: "Wizard",
        code: "wizard",
        speed: 6.33,
        health: 80,
        maxHealth: 80,
        defense: 0,
        damage: 30,
        element: 'Neutral',
        damagetype: 'Magic Damage',
        rarity: 'Superrare',
        ability: "Attacks ignore enemy defense.",
        level: 1,
        canBeCrafted: false,
        description: "A powerful mage who has mastered many techniques and spells in battle, now truly a wizard.",
        sound: "magic"
    },
    {
        name: "Pilgrim",
        code: "pilgrim",
        speed: 7.25,
        health: 60,
        maxHealth: 60,
        defense: 0,
        damage: 5,
        element: 'Neutral',
        damagetype: 'Curse Defense',
        rarity: 'Common',
        ability: "Reduces enemy defense.",
        level: 1,
        canBeCrafted: true,
        description: "A pilgrim traveling to holy places to find himself and his purpose, never losing faith.",
        sound: "curse_defense"
    },
    {
        name: "Exorcist",
        code: "exorcist",
        speed: 6.33,
        health: 75,
        maxHealth: 75,
        defense: 0,
        damage: 20,
        damageMultiplier: 1.5,
        element: 'Neutral',
        damagetype: 'Magic Damage',
        rarity: 'Epic',
        ability: "Attacks ignore enemy defense and deal 50% more damage to undead.",
        level: 1,
        canBeCrafted: false,
        description: "A follower of God who found his calling in banishing evil spirits and demons.",
        sound: "magic"
    },
    {
        name: "Monk",
        code: "monk",
        speed: 6.63,
        health: 65,
        maxHealth: 65,
        defense: 0,
        damage: 7,
        element: 'Neutral',
        damagetype: 'Curse Defense',
        rarity: 'Uncommon',
        ability: "Reduces enemy defense.",
        level: 1,
        canBeCrafted: false,
        description: "A monk who devoted his life to serving God and studying his teachings.",
        sound: "curse_of_defense"
    },
    {
        name: "Swordsman",
        code: "swordsman",
        speed: 5.25,
        health: 105,
        maxHealth: 105,
        defense: 20,
        damage: 35,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Superrare',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        description: "An elite knight, master of sword and shield, entrusted with the kingdom's safety.",
        sound: "heavy_swing"
    },
    {
        name: "Mace Mercenary",
        code: "maceMercenary",
        speed: 4.65,
        health: 80,
        maxHealth: 80,
        defense: 0,
        damage: 50,
        penetration: 65,
        element: 'Neutral',
        damagetype: 'Penetrating Damage',
        rarity: 'Superrare',
        ability: "Attacks penetrate 65% of enemy defense.",
        level: 1,
        canBeCrafted: false,
        description: "A mercenary who prefers his huge mace over armor, fighting for money and glory.",
        sound: "heavy_club"
    },
    {
        name: "Hammerman",
        code: "hammerman",
        speed: 3.75,
        health: 80,
        maxHealth: 80,
        defense: 15,
        damage: 60,
        penetration: 80,
        element: 'Neutral',
        damagetype: 'Penetrating Damage',
        rarity: 'Epic',
        ability: "Attacks penetrate 80% of enemy defense.",
        level: 1,
        canBeCrafted: false,
        description: "A club-wielding warrior blessed by the king for loyal service.",
        sound: "heavy_club"
    },
    {
        name: "Horse Crossbowman",
        code: "horseCrossbowman",
        speed: 4.95,
        health: 110,
        maxHealth: 110,
        defense: 10,
        damage: 32,
        element: 'Neutral',
        damagetype: 'Ranged Damage',
        rarity: 'Superrare',
        ability: "Acts first at the start of battle.",
        level: 1,
        canBeCrafted: false,
        description: "A crossbowman on horseback for more mobile shooting, able to strike first.",
        sound: "heavy_arrow"
    },
    {
        name: "Garrison Shooter",
        code: "garrisonShooter",
        speed: 6.85,
        health: 90,
        maxHealth: 90,
        defense: 10,
        damage: 20,
        element: 'Neutral',
        damagetype: 'Ranged Damage',
        rarity: 'Rare',
        ability: "Static damage.",
        level: 1,
        canBeCrafted: false,
        description: "An archer specially trained to defend the garrison, with excellent shooting skills.",
        sound: "arrow"
    },
    {
        name: "Spartacus",
        code: "spartacus",
        speed: 5.65,
        health: 80,
        maxHealth: 80,
        defense: 5,
        damage: 35,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Special',
        ability: "At the start of battle, applies 'Bloody Rain' effect to enemies. Attacking an enemy with this effect increases ally's damage by 2.",
        level: 1,
        canBeCrafted: false,
        description: "A legendary gladiator who fought in the Colosseum and became a symbol of freedom for many slaves."
    },
    {
        name: "King",
        code: "King",
        speed: 3.15,
        health: 200,
        maxHealth: 200,
        defense: 15,
        damage: 25,
        element: 'Neutral',
        damagetype: 'Damage',
        rarity: 'Special',
        ability: "If there are fewer than 10 living characters on the battlefield, summons an archer or warrior after attacking.",
        level: 1,
        canBeCrafted: false,
        description: "The royal power, His Majesty. Ruling for many years and idolized by his people, protected by hundreds of soldiers."
    },
];

const items = [
    { name: "Speed Grass", key: "speed_grass", rarity: "Rare", type: "drop", location: "divine" },
    { name: "Unusual Water", key: "unusual_water", rarity: "Uncommon", type: "drop", location: "divine" },
    { name: "Magic Water", key: "magic_water", rarity: "Superrare", type: "drop", location: "divine" },
    { name: "Root of Power", key: "root_of_power", rarity: "Rare", type: "drop", location: "divine" },
    { name: "Pile of Earth", key: "pile_of_earth", rarity: "Rare", type: "drop", location: "divine" },
    { name: "Gulliver Genes", key: "gulliver_genes", rarity: "Rare", type: "drop", location: "divine" },
    { name: "Iron Ingot", key: "iron_ingot", rarity: "Uncommon", type: "craftable", location: "all" },
    { name: "Iron Ore", key: "iron_ore", rarity: "Common", type: "drop", location: "all" },
    { name: "Wood", key: "wood", rarity: "Common", type: "drop", location: "all" },
    { name: "Battle Records", key: "battle_records", rarity: "Uncommon", type: "drop", location: "all" },
    { name: "Battery", key: "battery", rarity: "Rare", type: "drop", location: "factory" },
    { name: "Robot Chip", key: "robot_chip", rarity: "Superrare", type: "drop", location: "factory" },
    { name: "Essence of Lightning", key: "essence_lightning", rarity: "Superrare", type: "drop", location: "all" },
    { name: "Essence of Fire", key: "essence_fire", rarity: "Superrare", type: "drop", location: "all" },
    { name: "Essence of Water", key: "essence_water", rarity: "Superrare", type: "drop", location: "all" },
    { name: "Essence of Earth", key: "essence_earth", rarity: "Superrare", type: "drop", location: "all" },
    { name: "Essence of Ice", key: "essence_ice", rarity: "Superrare", type: "drop", location: "all" },
    { name: "Essence of Air", key: "essence_air", rarity: "Superrare", type: "drop", location: "all" },
    { name: "Essence of Light", key: "essence_light", rarity: "Epic", type: "drop", location: "all" },
    { name: "Essence of Darkness", key: "essence_darkness", rarity: "Epic", type: "drop", location: "all" },
    { name: "Armor Plates", key: "armor_plates", rarity: "Rare", type: "craftable", location: "all" },
    { name: "Potion of Speed", key: "potion_speed", rarity: "Rare", type: "drop", location: "divine" },
    { name: "Potion of Strength", key: "potion_strength", rarity: "Rare", type: "drop", location: "divine" },
    { name: "Potion of Slowness", key: "potion_slowness", rarity: "Rare", type: "drop", location: "divine" },
    { name: "Faith", key: "faith", rarity: "Mythic", type: "drop", location: "all" },
    { name: "Potion of Gigantism", key: "potion_gigantism", rarity: "Rare", type: "drop", location: "divine" },
    { name: "Titanium Ingot", key: "titanium_ingot", rarity: "Rare", type: "craftable", location: "divine" },
    { name: "Titanium Ore", key: "titanium_ore", rarity: "Uncommon", type: "drop", location: "all" },
    { name: "Laser Batteries", key: "laser_batteries", rarity: "Superrare", type: "craftable", location: "factory" },
    { name: "AI Chip", key: "ai_chip", rarity: "Epic", type: "drop", location: "factory" },
    { name: "Infected Blood", key: "infected_blood", rarity: "Rare", type: "drop", location: "cemetery" },
    { name: "Potion of Frenzy", key: "potion_frenzy", rarity: "Epic", type: "drop", location: "divine" },
    { name: "Curse", key: "curse", rarity: "Mythic", type: "drop", location: "all" },
    { name: "Obsidian Ingot", key: "obsidian_ingot", rarity: "Epic", type: "craftable", location: "all" },
    { name: "Obsidian", key: "obsidian", rarity: "Superrare", type: "drop", location: "all" },
    { name: "Battle Books", key: "battle_books", rarity: "Rare", type: "drop", location: "all" },
    { name: "Coins", key: "coins", rarity: "Common", type: "drop", location: "all" },
    { name: "Laser Ingot", key: "laser_ingot", rarity: "Superrare", type: "craftable", location: "factory" },
    { name: "Laser Ore", key: "laser_ore", rarity: "Rare", type: "drop", location: "factory" },
    { name: "Diamond Battery", key: "diamond_battery", rarity: "Epic", type: "craftable", location: "all" },
    { name: "Diamond", key: "diamond", rarity: "Rare", type: "drop", location: "all" },
    { name: "Uranium", key: "uranium", rarity: "Epic", type: "drop", location: "all" },
    { name: "Superintelligence Chip", key: "superintelligence_chip", rarity: "Mythic", type: "drop", location: "factory" },
    { name: "Potion of Rage", key: "potion_rage", rarity: "Epic", type: "drop", location: "divine" },
    { name: "Supermetal Ingot", key: "supermetal_ingot", rarity: "Epic", type: "craftable", location: "all" },
    { name: "Battle Medals", key: "battle_medals", rarity: "Epic", type: "drop", location: "all" },
    { name: "Horse", key: "horse", rarity: "Epic", type: "drop", location: "all" },
    { name: "Support Flag", key: "support_flag", rarity: "Legendary", type: "drop", location: "all" },
    { name: "Universal Alloy", key: "universal_alloy", rarity: "Mythic", type: "craftable", location: "all" },
    { name: "Sword of Protection", key: "sword_of_protection", rarity: "Legendary", type: "craftable", location: "all" },
    { name: "Absolute Armor", key: "absolute_armor", rarity: "Legendary", type: "craftable", location: "all" },
    { name: "Void Staff", key: "void_staff", rarity: "Legendary", type: "drop", location: "void" },
    { name: "Unknown Ingot", key: "unknown_ingot", rarity: "Legendary", type: "craftable" },
    { name: "Unknown Ore", key: "unknown_ore", rarity: "Mythic", type: "drop", location: "void" },
    { name: "Blade Piercing Darkness", key: "blade_piercing_darkness", rarity: "Legendary", type: "drop", location: "darkness" },
    { name: "Angels' Blessing", key: "angels_blessing", rarity: "Legendary", type: "drop", location: "divine" },
    { name: "Battle Aura", key: "battle_aura", rarity: "Mythic", type: "drop", location: "all" },
    { name: "Destruction Protocol", key: "destruction_protocol", rarity: "Legendary", type: "drop", location: "factory" },
    { name: "Medkit", key: "medkit", rarity: "Superrare", type: "drop", location: "all" },
    { name: "Piece of Cloth", key: "piece_of_cloth", rarity: "Common", type: "drop", location: "all" },
    { name: "Piece of Leather", key: "piece_of_leather", rarity: "Uncommon", type: "drop", location: "all" },
    { name: "Rope", key: "rope", rarity: "Common", type: "drop", location: "all" },
    { name: "Bow", key: "bow", rarity: "Uncommon", type: "craftable" },
    { name: "Pitchfork", key: "pitchfork", rarity: "Uncommon", type: "craftable" },
    { name: "Sword", key: "sword", rarity: "Uncommon", type: "craftable" },
    { name: "Stone", key: "stone", rarity: "Common", type: "drop", location: "all" },
    { name: "Spear", key: "spear", rarity: "Uncommon", type: "craftable" },
    { name: "Axe", key: "axe", rarity: "Uncommon", type: "craftable" },
    { name: "Light Armor", key: "light_armor", rarity: "Rare", type: "craftable" },
    { name: "Shield", key: "shield", rarity: "Rare", type: "craftable" },
    { name: "Cloak", key: "cloak", rarity: "Rare", type: "craftable" },
    { name: "Steel Ingot", key: "steel_ingot", rarity: "Rare", type: "craftable" },
    { name: "Steel Ore", key: "steel_ore", rarity: "Uncommon", type: "drop", location: "all" },
    { name: "Obsidian Blade", key: "obsidian_blade", rarity: "Mythic", type: "craftable" },
    { name: "Portable Cannon", key: "portable_cannon", rarity: "Epic", type: "craftable" },
    { name: "Dense Armor", key: "dense_armor", rarity: "Epic", type: "craftable" },
    { name: "Bloodthirst Blade", key: "bloodthirst_blade", rarity: "Mythic", type: "craftable" },
    { name: "Elite Guard Spear", key: "elite_guard_spear", rarity: "Mythic", type: "craftable" },
    { name: "Soul of Vengeance", key: "soul_of_vengeance", rarity: "Mythic", type: "drop", location: "darkness" },
    { name: "Fallen King Sword", key: "fallen_king_sword", rarity: "Mythic", type: "craftable" },
    { name: "Alien Ingot", key: "alien_ingot", rarity: "Mythic", type: "craftable" },
    { name: "Alien Ore", key: "alien_ore", rarity: "Epic", type: "drop", location: "factory" },
    { name: "Aura of Protection", key: "aura_of_protection", rarity: "Mythic", type: "drop", location: "all" },
    { name: "Absolute Ore", key: "absolute_ore", rarity: "Epic", type: "drop", location: "divine" },
    { name: "Absolute Ingot", key: "absolute_ingot", rarity: "Mythic", type: "craftable", location: "divine" },
    { name: "Essence of Elements", key: "essence_of_elements", rarity: "Epic", type: "craftable" },
    { name: "Essence of Balance", key: "essence_of_balance", rarity: "Epic", type: "craftable" },
    { name: "Bombard", key: "bombard", rarity: "Mythic", type: "craftable" },
    { name: "Cape", key: "cape", rarity: "Uncommon", type: "craftable" },
    { name: "Mace", key: "mace", rarity: "Rare", type: "craftable" },
    { name: "Steel Blade", key: "steel_blade", rarity: "Superrare", type: "craftable" },
    { name: "Blade", key: "blade", rarity: "Uncommon", type: "craftable" },
    { name: "Musket", key: "musket", rarity: "Uncommon", type: "craftable" },
    { name: "Broadsword", key: "broadsword", rarity: "Epic", type: "craftable" },
    { name: "Thief's Ring", key: "thiefs_ring", rarity: "Epic", type: "drop", location: "thieves" },
    { name: "Bones", key: "bones", rarity: "Common", type: "drop", location: "cemetery" },
    { name: "Corrosion Potion", key: "corrosion_potion", rarity: "Epic", location: "factory" },
    { name: "Elite Knight Armor", key: "elite_knight_armor", rarity: "Mythic", type: "craftable" },
    { name: "Halberd", key: "halberd", rarity: "Epic", type: "craftable" },
    { name: "Armor", key: "armor", rarity: "Superrare", type: "craftable" },
    { name: "Steel Sword", key: "steel_sword", rarity: "Superrare", type: "craftable" },
    { name: "Book of Demon Banishment", key: "book_of_demon_banishment", rarity: "Mythic", type: "craftable" },
    { name: "Staff", key: "staff", rarity: "Uncommon", type: "craftable" },
    { name: "Morning Star", key: "morning_star", rarity: "Epic", type: "craftable" },
    { name: "Powerful Crossbow", key: "powerful_crossbow", rarity: "Superrare", type: "craftable" },
    { name: "Powerful Bow", key: "powerful_bow", rarity: "Rare", type: "craftable" },
    { name: "Mage's Staff", key: "mages_staff", rarity: "Rare", type: "craftable" },
    { name: "Human Vessel", key: "human_vessel", rarity: "Epic", type: "drop" },
    { name: "Inhuman Vessel", key: "inhuman_vessel", rarity: "Epic", type: "drop" },
    { name: "Undead Vessel", key: "undead_vessel", rarity: "Epic", type: "drop" },
    { name: "Cybernetic Vessel", key: "cybernetic_vessel", rarity: "Epic", type: "drop" },
    { name: "Void Vessel", key: "void_vessel", rarity: "Legendary", type: "drop" },
    { name: "Hero Vessel", key: "hero_vessel", rarity: "Legendary", type: "drop" },
];

const allCharacters = characters.map(character => ({
    name: character.name,
    rarity: character.rarity,
    canBeCrafted: character.canBeCrafted,
    code: character.code
}));

    allCharacters.sort((a, b) => getRarityOrder(a.rarity) - getRarityOrder(b.rarity));

const craftingRecipes = {
    "Peasant": [
        { name: "Human Vessel", rarity: "Epic", quantity: 1 },
        { name: "Pitchfork", rarity: "Uncommon", quantity: 1 }
    ],
    "Speedster": [
        { name: "Inhuman Vessel", rarity: "Epic", quantity: 1 },
        { name: "Potion of Speed", rarity: "Rare", quantity: 2 },
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 5 }
    ],
    "Slowpoke": [
        { name: "Inhuman Vessel", rarity: "Epic", quantity: 1 },
        { name: "Potion of Slowness", rarity: "Rare", quantity: 2 },
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 5 }
    ],
    "Tetradrone": [
        { name: "Cybernetic Vessel", rarity: "Epic", quantity: 2 },
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 5 },
        { name: "Battery", rarity: "Rare", quantity: 3 },
        { name: "Robot Chip", rarity: "Superrare", quantity: 1 }
    ],
    "Zombie Hunter": [
        { name: "Undead Vessel", rarity: "Epic", quantity: 4 },
        { name: "Infected Blood", rarity: "Superrare", quantity: 15 },
        { name: "Potion of Frenzy", rarity: "Epic", quantity: 3 }
    ],
    "Blood Knight": [
        { name: "Warrior", rarity: "Uncommon", quantity: 2 },
        { name: "Essence of Darkness", rarity: "Epic", quantity: 5 },
        { name: "Infected Blood", rarity: "Superrare", quantity: 10 }
    ],
    "Assassin": [
        { name: "Inhuman Vessel", rarity: "Epic", quantity: 6 },
        { name: "Essence of Darkness", rarity: "Epic", quantity: 5 },
        { name: "Obsidian Blade", rarity: "Mythic", quantity: 1 },
        { name: "Cloak", rarity: "Rare", quantity: 3 }
    ],
    "Cannoneer": [
        { name: "Archer", rarity: "Common", quantity: 5 },
        { name: "Portable Cannon", rarity: "Epic", quantity: 1 },
        { name: "Battle Books", rarity: "Rare", quantity: 20 }
    ],
    "Shield Bearer": [
        { name: "Infantry", rarity: "Common", quantity: 5 },
        { name: "Shield", rarity: "Rare", quantity: 5 },
        { name: "Battle Books", rarity: "Rare", quantity: 5 }
    ],
    "Iron Skeleton": [
        { name: "Skeleton Knight", rarity: "Uncommon", quantity: 3 },
        { name: "Undead Vessel", rarity: "Epic", quantity: 2 },
        { name: "Dense Armor", rarity: "Epic", quantity: 1 }
    ],
    "Jester": [
        { name: "Inhuman Vessel", rarity: "Epic", quantity: 6 },
        { name: "Coins", rarity: "Common", quantity: 150 },
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 25 }
    ],
    "Skeleton King": [
        { name: "Skeleton Knight", rarity: "Uncommon", quantity: 5 },
        { name: "Undead Vessel", rarity: "Epic", quantity: 5 },
        { name: "Fallen King Sword", rarity: "Mythic", quantity: 1 },
        { name: "Essence of Darkness", rarity: "Epic", quantity: 5 }
    ],
    "Battle Healer": [
        { name: "Human Vessel", rarity: "Epic", quantity: 10 },
        { name: "Battle Medals", rarity: "Epic", quantity: 10 },
        { name: "Medkit", rarity: "Superrare", quantity: 25 }
    ],
    "Hero": [
        { name: "Hero Vessel", rarity: "Legendary", quantity: 1 },
        { name: "Faith", rarity: "Mythic", quantity: 5 },
        { name: "Essence of Light", rarity: "Epic", quantity: 25 },
        { name: "Blade Piercing Darkness", rarity: "Legendary", quantity: 1 },
        { name: "Angels' Blessing", rarity: "Legendary", quantity: 1 }
    ],
    "Flag Bearer": [
        { name: "Hero Vessel", rarity: "Legendary", quantity: 1 },
        { name: "Human Vessel", rarity: "Epic", quantity: 10 },
        { name: "Battle Aura", rarity: "Mythic", quantity: 5 },
        { name: "Support Flag", rarity: "Legendary", quantity: 1 },
        { name: "Universal Alloy", rarity: "Mythic", quantity: 3 }
    ],
    "Void Emperor": [
        { name: "Void Vessel", rarity: "Legendary", quantity: 1 },
        { name: "Curse", rarity: "Mythic", quantity: 5 },
        { name: "Void Staff", rarity: "Legendary", quantity: 1 },
        { name: "Unknown Ingot", rarity: "Legendary", quantity: 2 }
    ],
    "Bandit": [
        { name: "Human Vessel", rarity: "Epic", quantity: 1 },
        { name: "Blade", rarity: "Uncommon", quantity: 2 }
    ],
    "Skeleton": [
        { name: "Undead Vessel", rarity: "Epic", quantity: 1 },
        { name: "Bones", rarity: "Common", quantity: 10 }
    ],
    "Corrosion Skeleton": [
        { name: "Undead Vessel", rarity: "Epic", quantity: 6 },
        { name: "Bones", rarity: "Common", quantity: 35 },
        { name: "Corrosion Potion", rarity: "Epic", quantity: 2 },
        { name: "Sword", rarity: "Uncommon", quantity: 3 }
    ],
    "Lancer": [
        { name: "Human Vessel", rarity: "Epic", quantity: 5 },
        { name: "Elite Guard Spear", rarity: "Mythic", quantity: 1 },
        { name: "Light Armor", rarity: "Rare", quantity: 3 },
        { name: "Horse", rarity: "Epic", quantity: 1 }
    ],
    "Pilgrim": [
        { name: "Human Vessel", rarity: "Epic", quantity: 1 },
        { name: "Cape", rarity: "Uncommon", quantity: 1 },
        { name: "Staff", rarity: "Uncommon", quantity: 1 }
    ]
};

        // Пример рецептов для предметов
const itemCraftingRecipes = {
    "Iron Ingot": [
        { name: "Iron Ore", rarity: "Common", quantity: 3 }
    ],
    "Armor Plates": [
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 1 },
        { name: "Titanium Ingot", rarity: "Common", quantity: 1 }
    ],
    "Essence of Balance": [
        { name: "Essence of Light", rarity: "Epic", quantity: 1 },
        { name: "Essence of Darkness", rarity: "Epic", quantity: 1 }
    ],
    "Essence of Elements": [
        { name: "Essence of Lightning", rarity: "Superrare", quantity: 1 },
        { name: "Essence of Fire", rarity: "Superrare", quantity: 1 },
        { name: "Essence of Water", rarity: "Superrare", quantity: 1 },
        { name: "Essence of Earth", rarity: "Superrare", quantity: 1 },
        { name: "Essence of Ice", rarity: "Superrare", quantity: 1 },
        { name: "Essence of Air", rarity: "Superrare", quantity: 1 }
    ],
    "Titanium Ingot": [
        { name: "Titanium Ore", rarity: "Uncommon", quantity: 3 }
    ],
    "Laser Ingot": [
        { name: "Laser Ore", rarity: "Rare", quantity: 3 }
    ],
    "Potion of Speed": [
        { name: "Unusual Water", rarity: "Uncommon", quantity: 1 },
        { name: "Speed Grass", rarity: "Rare", quantity: 1 }
    ],
    "Potion of Strength": [
        { name: "Unusual Water", rarity: "Uncommon", quantity: 1 },
        { name: "Root of Power", rarity: "Rare", quantity: 1 }
    ],
    "Potion of Slowness": [
        { name: "Unusual Water", rarity: "Uncommon", quantity: 1 },
        { name: "Pile of Earth", rarity: "Rare", quantity: 1 }
    ],
    "Potion of Gigantism": [
        { name: "Unusual Water", rarity: "Uncommon", quantity: 1 },
        { name: "Gulliver Genes", rarity: "Rare", quantity: 1 }
    ],
    "Laser Batteries": [
        { name: "Laser Ingot", rarity: "Superrare", quantity: 1 },
        { name: "Battery", rarity: "Rare", quantity: 1 }
    ],
    "Potion of Frenzy": [
        { name: "Magic Water", rarity: "Superrare", quantity: 1 },
        { name: "Potion of Strength", rarity: "Rare", quantity: 1 },
        { name: "Infected Blood", rarity: "Rare", quantity: 3 }
    ],
    "Obsidian Ingot": [
        { name: "Obsidian", rarity: "Superrare", quantity: 3 }
    ],
    "Diamond Battery": [
        { name: "Diamond", rarity: "Superrare", quantity: 2 },
        { name: "Uranium", rarity: "Epic", quantity: 1 }
    ],
    "Potion of Rage": [
        { name: "Magic Water", rarity: "Superrare", quantity: 1 },
        { name: "Root of Power", rarity: "Rare", quantity: 3 }
    ],
    "Supermetal Ingot": [
        { name: "Iron Ore", rarity: "Common", quantity: 5 },
        { name: "Titanium Ore", rarity: "Uncommon", quantity: 5 },
        { name: "Steel Ore", rarity: "Uncommon", quantity: 5 },
        { name: "Laser Ore", rarity: "Rare", quantity: 3 }
    ],
    "Universal Alloy": [
        { name: "Supermetal Ingot", rarity: "Epic", quantity: 2 },
        { name: "Alien Ore", rarity: "Epic", quantity: 3 }
        // { name: "Absolute Ore", rarity: "Epic", quantity: 3 },
        // { name: "Star Ore", rarity: "Epic", quantity: 3 },
    ],
    "Sword of Protection": [
        { name: "Universal Alloy", rarity: "Mythic", quantity: 2 },
        { name: "Aura of Protection", rarity: "Mythic", quantity: 1 },
        { name: "Wood", rarity: "Common", quantity: 50 },
        { name: "Essence of Light", rarity: "Epic", quantity: 10 }
    ],
    "Absolute Ingot": [
        { name: "Absolute Ore", rarity: "Epic", quantity: 3 }
    ],
    "Alien Ingot": [
        { name: "Alien Ore", rarity: "Epic", quantity: 3 }
    ],
    "Absolute Armor": [
        { name: "Absolute Ingot", rarity: "Mythic", quantity: 4 },
        { name: "Universal Alloy", rarity: "Mythic", quantity: 1 }
    ],
    "Bow": [
        { name: "Wood", rarity: "Common", quantity: 5 },
        { name: "Rope", rarity: "Common", quantity: 3 }
    ],
    "Pitchfork": [
        { name: "Wood", rarity: "Common", quantity: 5 },
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 1 }
    ],
    "Spear": [
        { name: "Wood", rarity: "Common", quantity: 10 },
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 1 }
    ],
    "Axe": [
        { name: "Wood", rarity: "Common", quantity: 6 },
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 2 }
    ],
    "Sword": [
        { name: "Wood", rarity: "Common", quantity: 3 },
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 3 }
    ],
    "Shield": [
        { name: "Wood", rarity: "Common", quantity: 16 },
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 5 }
    ],
    "Light Armor": [
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 5 }
    ],
    "Cloak": [
        { name: "Piece of Cloth", rarity: "Common", quantity: 15 },
        { name: "Piece of Leather", rarity: "Uncommon", quantity: 3 }
    ],
    "Steel Ingot": [
        { name: "Steel Ore", rarity: "Uncommon", quantity: 3 }
    ],
    "Obsidian Blade": [
        { name: "Obsidian Ingot", rarity: "Epic", quantity: 3 },
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 2 }
    ],
    "Portable Cannon": [
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 15 },
        { name: "Titanium Ingot", rarity: "Rare", quantity: 5 }
    ],
    "Bombard": [
        { name: "Supermetal Ingot", rarity: "Epic", quantity: 5 },
        { name: "Portable Cannon", rarity: "Epic", quantity: 1 }
    ],
    "Dense Armor": [
        { name: "Steel Ingot", rarity: "Rare", quantity: 7 },
        { name: "Titanium Ingot", rarity: "Rare", quantity: 7 }
    ],
    "Bloodthirst Blade": [
        { name: "Obsidian Blade", rarity: "Epic", quantity: 1 },
        { name: "Infected Blood", rarity: "Rare", quantity: 10 }
    ],
    "Elite Guard Spear": [
        { name: "Wood", rarity: "Common", quantity: 20 },
        { name: "Titanium Ingot", rarity: "Rare", quantity: 5 },
        { name: "Battle Medals", rarity: "Epic", quantity: 3 }
    ],
    "Fallen King Sword": [
        { name: "Undead Vessel", rarity: "Epic", quantity: 1 },
        { name: "Titanium Ingot", rarity: "Rare", quantity: 15 },
        { name: "Curse", rarity: "Mythic", quantity: 1 }
    ],
    "Unknown Ingot": [
        { name: "Unknown Ore", rarity: "Mythic", quantity: 2 }
    ],
    "Cape": [
        { name: "Piece of Cloth", rarity: "Common", quantity: 3 },
        { name: "Piece of Leather", rarity: "Uncommon", quantity: 1 }
    ],
    "Mace": [
        { name: "Titanium Ingot", rarity: "Rare", quantity: 2 },
        { name: "Wood", rarity: "Common", quantity: 5 }
    ],
    "Steel Blade": [
        { name: "Steel Ingot", rarity: "Rare", quantity: 2 },
        { name: "Piece of Leather", rarity: "Uncommon", quantity: 2 },
        { name: "Wood", rarity: "Common", quantity: 5 }
    ],
    "Blade": [
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 1 },
        { name: "Wood", rarity: "Common", quantity: 1 }
    ],
    "Musket": [
        { name: "Titanium Ingot", rarity: "Rare", quantity: 1 },
        { name: "Piece of Leather", rarity: "Uncommon", quantity: 1 }
    ],
    "Broadsword": [
        { name: "Supermetal Ingot", rarity: "Epic", quantity: 2 },
        { name: "Piece of Leather", rarity: "Uncommon", quantity: 1 },
        { name: "Wood", rarity: "Common", quantity: 3 }
    ],
    "Elite Knight Armor": [
        { name: "Supermetal Ingot", rarity: "Epic", quantity: 6 },
        { name: "Piece of Leather", rarity: "Uncommon", quantity: 10 }
    ],
    "Halberd": [
        { name: "Supermetal Ingot", rarity: "Epic", quantity: 1 },
        { name: "Piece of Leather", rarity: "Uncommon", quantity: 2 },
        { name: "Wood", rarity: "Common", quantity: 10 }
    ],
    "Steel Sword": [
        { name: "Steel Ingot", rarity: "Rare", quantity: 3 },
        { name: "Piece of Leather", rarity: "Uncommon", quantity: 3 },
        { name: "Wood", rarity: "Common", quantity: 7 }
    ],
    "Book of Demon Banishment": [
        { name: "Battle Books", rarity: "Rare", quantity: 5 },
        { name: "Faith", rarity: "Mythic", quantity: 1 },
        { name: "Curse", rarity: "Mythic", quantity: 1 }
    ],
    "Staff": [
        { name: "Wood", rarity: "Common", quantity: 10 }
    ],
    "Mage's Staff": [
        { name: "Staff", rarity: "Uncommon", quantity: 1 },
        { name: "Essence of Water", rarity: "Superrare", quantity: 1 }
    ],
    "Morning Star": [
        { name: "Supermetal Ingot", rarity: "Epic", quantity: 2 },
        { name: "Iron Ingot", rarity: "Uncommon", quantity: 3 }
    ],
    "Powerful Crossbow": [
        { name: "Titanium Ingot", rarity: "Rare", quantity: 5 },
        { name: "Piece of Leather", rarity: "Uncommon", quantity: 3 },
        { name: "Rope", rarity: "Common", quantity: 10 }
    ],
    "Powerful Bow": [
        { name: "Titanium Ingot", rarity: "Rare", quantity: 3 },
        { name: "Piece of Leather", rarity: "Uncommon", quantity: 2 },
        { name: "Rope", rarity: "Common", quantity: 7 }
    ]
};

    const sortedItemCraftingRecipes = Object.entries(itemCraftingRecipes).sort(([itemNameA], [itemNameB]) => {
        const rarityA = items.find(item => item.name === itemNameA)?.rarity || "Обычный";
        const rarityB = items.find(item => item.name === itemNameB)?.rarity || "Обычный";
        return getRarityOrder(rarityA) - getRarityOrder(rarityB);
    })
    .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});

const campaignLevels = [
    //1-10
    { back: [], front: [ { name: "Peasant", level: 2 } ] },
    { back: [], front: [ { name: "Peasant", level: 1 }, { name: "Peasant", level: 1 } ] },
    { back: [], front: [ { name: "Infantry", level: 3 } ] },
    { back: [], front: [ { name: "Hunter", level: 5 } ] },
    { back: [ { name: "Hunter", level: 1 }, { name: "Hunter", level: 1 } ], front: [ { name: "Infantry", level: 2 } ] },
    { back: [ { name: "Crossbowman", level: 2 } ], front: [ { name: "Infantry", level: 1 } ] },
    { back: [], front: [ { name: "Peasant", level: 1 }, { name: "Peasant", level: 1 }, { name: "Peasant", level: 2 } ] },
    { back: [ { name: "Hunter", level: 1 } ], front: [ { name: "Peasant", level: 1 }, { name: "Peasant", level: 1 } ] },
    { back: [ { name: "Hunter", level: 3 } ], front: [ { name: "Warrior", level: 3 } ] },
    { back: [ { name: "Crossbowman", level: 2 }, { name: "Crossbowman", level: 2 } ], front: [ ] },
    //11-20
    { back: [ { name: "Hunter", level: 5 }, { name: "Hunter", level: 5 } ], front: [ ] },
    { back: [ { name: "Crossbowman", level: 3 } ], front: [ { name: "Warrior", level: 4 } ] },
    { back: [ { name: "Archer", level: 1 }, { name: "Archer", level: 1 } ], front: [ { name: "Infantry", level: 1 } ] },
    { back: [], front: [ { name: "Woodcutter", level: 2 }, { name: "Woodcutter", level: 2 }, { name: "Woodcutter", level: 2 } ] },
    { back: [ { name: "Hunter", level: 3 }, { name: "Hunter", level: 3 } ], front: [ { name: "Woodcutter", level: 4 } ] },
    { back: [ { name: "Archer", level: 1 }, { name: "Crossbowman", level: 1 } ], front: [ { name: "Infantry", level: 1 }, { name: "Warrior", level: 1 } ] },
    { back: [ { name: "Hunter", level: 10 } ], front: [ { name: "Peasant", level: 15 } ] },
    { back: [ { name: "Archer", level: 10 } ], front: [ { name: "Infantry", level: 12 } ] },
    { back: [ { name: "Crossbowman", level: 7 } ], front: [ { name: "Warrior", level: 7 } ] },
    { front: [ { name: "Mage", level: 17 } ] },
    //21-30
    { back: [ { name: "Pilgrim", level: 5 }, { name: "Pilgrim", level: 5 }, { name: "Pilgrim", level: 5 } ], front: [ { name: "Warrior", level: 5 }, { name: "Warrior", level: 5 } ] },
    { back: [ { name: "Crossbowman", level: 5 }, { name: "Crossbowman", level: 5 } ], front: [ { name: "Warrior", level: 5 }, { name: "Warrior", level: 5 } ] },
    { back: [ { name: "Monk", level: 8 }, { name: "Archer", level: 5 }, { name: "Monk", level: 8 } ], front: [ { name: "Warrior", level: 12 } ] },
    { back: [ { name: "Hunter", level: 5 }, { name: "Archer", level: 5 }, { name: "Hunter", level: 5 } ], front: [ { name: "Warrior", level: 3 }, { name: "Warrior", level: 3 } ] },
    { front: [ { name: "Warrior", level: 1 }, { name: "Warrior", level: 1 }, { name: "Warrior", level: 1 }, { name: "Warrior", level: 1 }, { name: "Warrior", level: 1 } ] },
    { back: [ { name: "Monk", level: 10 }, { name: "Archer", level: 5 } ], front: [ { name: "Infantry", level: 5 }, { name: "Warrior", level: 6 } ] },
    { back: [ { name: "Pilgrim", level: 5 }, { name: "Pilgrim", level: 5 }, { name: "Archer", level: 5 }, { name: "Pilgrim", level: 5 }, { name: "Pilgrim", level: 5 } ], front: [ { name: "Warrior", level: 3 }, { name: "Warrior", level: 3 }, { name: "Warrior", level: 3 } ] },
    { back: [ { name: "Mage Student", level: 3 }, { name: "Mage Student", level: 3 }, { name: "Archer", level: 3 } ], front: [ { name: "Warrior", level: 2 }, { name: "Infantry", level: 3 }, { name: "Warrior", level: 2 } ] },
    { back: [ { name: "Monk", level: 3 }, { name: "Mage Student", level: 5 }, { name: "Hunter", level: 5 } ], front: [ { name: "Woodcutter", level: 2 }, { name: "Infantry", level: 3 }, { name: "Woodcutter", level: 2 } ] },
    { back: [ { name: "Saint", level: 3 }, { name: "Crossbowman", level: 3 } ], front: [ { name: "Knight", level: 3 }, { name: "Knight", level: 3 } ] },
    //31-40
    { back: [ { name: "Saint", level: 5 }, { name: "Monk", level: 5 } ], front: [ { name: "Warrior", level: 3 }, { name: "Warrior", level: 4 }, { name: "Warrior", level: 3 } ] },
    { back: [ { name: "Saint", level: 5 }, { name: "Monk", level: 10 }, { name: "Pilgrim", level: 10 } ], front: [ { name: "Infantry", level: 4 }, { name: "Infantry", level: 4 }, { name: "Infantry", level: 4 } ] },
    { back: [ { name: "Hunter", level: 3 }, { name: "Hunter", level: 3 } ], front: [ { name: "Peasant", level: 3 }, { name: "Peasant", level: 3 }, { name: "Peasant", level: 3 }, { name: "Peasant", level: 3 }, { name: "Peasant", level: 3 } ] },
    { back: [ { name: "Archer", level: 5 }, { name: "Saint", level: 4 }, { name: "Archer", level: 5 } ], front: [ { name: "Shield Bearer", level: 6 } ] },
    { back: [ { name: "Archer", level: 6 }, { name: "Archer", level: 6 } ], front: [ { name: "Shield Bearer", level: 1 }, { name: "Shield Bearer", level: 1 }, { name: "Shield Bearer", level: 1 } ] },
    { back: [ { name: "Saint", level: 3 }, { name: "Saint", level: 3 } ], front: [ { name: "Shield Bearer", level: 1 }, { name: "Shield Bearer", level: 1 } ] },
    { back: [ { name: "Saint", level: 2 }, { name: "Mage", level: 3 }, { name: "Archer", level: 2 } ], front: [ { name: "Knight", level: 4 }, { name: "Knight", level: 4 } ] },
    { back: [ { name: "Mage Student", level: 3 }, { name: "Mage", level: 5 }, { name: "Mage Student", level: 3 } ], front: [ { name: "Infantry", level: 9 }, { name: "Infantry", level: 9 } ] },
    { back: [ { name: "Musketeer", level: 6 }, { name: "Musketeer", level: 6 } ], front: [ { name: "Warrior", level: 5 }, { name: "Knight", level: 3 }, { name: "Warrior", level: 5 } ] },
    { back: [ { name: "Musketeer", level: 2 }, { name: "Mage", level: 2 }, { name: "Saint", level: 1 } ], front: [ { name: "Clubman", level: 2 }, { name: "Knight", level: 2 }, { name: "Guardian", level: 2 } ] },
    //41-50
    { back: [ { name: "Hunter", level: 10 } ], front: [ { name: "Bandit", level: 8 }, { name: "Bandit", level: 8 }, { name: "Bandit", level: 8 } ] },
    { back: [ { name: "Hunter", level: 6 }, { name: "Hunter", level: 6 }, { name: "Hunter", level: 6 } ], front: [ { name: "Bandit", level: 5 }, { name: "Bandit Thief", level: 5 }, { name: "Bandit", level: 5 } ] },
    { back: [ { name: "Hunter", level: 3 }, { name: "Crossbowman", level: 7 }, { name: "Hunter", level: 3 } ], front: [ { name: "Bandit Thief", level: 10 }, { name: "Bandit Thief", level: 10 } ] },
    { back: [ { name: "Crossbowman", level: 2 }, { name: "Crossbowman", level: 2 } ], front: [ { name: "Bandit Thief", level: 5 }, { name: "Bandit Thief", level: 5 }, { name: "Bandit Thief", level: 5 }, { name: "Bandit Thief", level: 5 } ] },
    { back: [ { name: "Crossbowman", level: 5 }, { name: "Crossbowman", level: 5 } ], front: [ { name: "Marauder", level: 12 } ] },
    { back: [ { name: "Saint", level: 5 } ], front: [ { name: "Marauder", level: 5 }, { name: "Marauder", level: 5 }, { name: "Marauder", level: 5 } ] },
    { back: [ { name: "Hunter", level: 8 }, { name: "Hunter", level: 8 } ], front: [ { name: "Bandit Thief", level: 10 }, { name: "Bandit Thief", level: 10 } ] },
    { back: [ { name: "Crossbowman", level: 7 }, { name: "Crossbowman", level: 7 } ], front: [ { name: "Bandit", level: 10 }, { name: "Bandit", level: 10 } ] },
    { back: [ { name: "Saint", level: 1 }, { name: "Saint", level: 1 }, { name: "Saint", level: 1 } ], front: [ { name: "Marauder", level: 10 } ] },
    { back: [  ], front: [ { name: "Bandit", level: 4 }, { name: "Bandit", level: 4 }, { name: "Gang Leader", level: 8 }, { name: "Bandit", level: 4 }, { name: "Bandit", level: 4 } ] },
    //51-60
    { back: [ { name: "Hunter", level: 7 }, { name: "Mage Student", level: 7 } ], front: [ { name: "Warrior", level: 6 }, { name: "Bandit Thief", level: 7 }, { name: "Warrior", level: 6 } ] },
    { back: [ { name: "Crossbowman", level: 8 }, { name: "Mage", level: 8 } ], front: [ { name: "Bandit", level: 8 }, { name: "Bandit Thief", level: 8 } ] },
    { back: [ { name: "Saint", level: 3 }, { name: "Saint", level: 3 } ], front: [ { name: "Bandit", level: 7 }, { name: "Gang Leader", level: 7 }, { name: "Bandit", level: 7 } ] },
    { back: [ { name: "Crossbowman", level: 1 }, { name: "Crossbowman", level: 1 } ], front: [ { name: "Bandit", level: 3 }, { name: "Bandit", level: 3 }, { name: "Gang Leader", level: 3 }, { name: "Bandit", level: 3 }, { name: "Bandit", level: 3 } ] },
    { back: [ { name: "Hunter", level: 5 }, { name: "Hunter", level: 5 } ], front: [ { name: "Bandit", level: 4 }, { name: "Bandit Thief", level: 3 }, { name: "GangLeader", level: 5 }, { name: "Bandit Thief", level: 3 }, { name: "Bandit", level: 4 } ] },
    { back: [ { name: "Hunter", level: 2 }, { name: "Hunter", level: 2 }, { name: "Hunter", level: 2 }, { name: "Hunter", level: 2 }, { name: "Hunter", level: 2 } ], front: [ { name: "Gang Leader", level: 10 } ] },
    { back: [ { name: "Hunter", level: 1 }, { name: "Hunter", level: 1 }, { name: "Hunter", level: 1 } ], front: [ { name: "Peasant", level: 1 }, { name: "Peasant", level: 1 }, { name: "Gang Leader", level: 10 }, { name: "Peasant", level: 1 }, { name: "Peasant", level: 1 } ] },
    { front: [ { name: "Bandit", level: 6 }, { name: "Bandit", level: 6 }, { name: "Bandit", level: 6 }, { name: "Bandit", level: 6 }, { name: "Bandit", level: 6 } ] },
    { back: [ { name: "Hunter", level: 2 }, { name: "Hunter", level: 2 }, { name: "Hunter", level: 2 } ], front: [ { name: "Bandit Thief", level: 3 }, { name: "Bandit Thief", level: 3 }, { name: "Bandit Thief", level: 3 }, { name: "Bandit Thief", level: 3 }, { name: "Bandit Thief", level: 3 } ] },
    { back: [ { name: "Crossbowman", level: 3 }, { name: "Saint", level: 3 } ], front: [ { name: "Bandit", level: 3 }, { name: "Bandit", level: 3 }, { name: "Gang Leader", level: 10 }, { name: "Bandit", level: 3 }, { name: "Bandit", level: 3 } ] },
    //61-70
    { back: [ { name: "Crossbowman", level: 7 } ], front: [ { name: "Knight", level: 5 }, { name: "Knight", level: 5 }, { name: "Knight", level: 5 } ] },
    { back: [ { name: "Archer", level: 5 }, { name: "Garrison Shooter", level: 7 }, { name: "Archer", level: 5 } ], front: [ { name: "Knight", level: 10 } ] },
    { back: [ { name: "Garrison Shooter", level: 7 }, { name: "Garrison Shooter", level: 7 } ], front: [ { name: "Knight", level: 8 }, { name: "Clubman", level: 8 } ] },
    { back: [ { name: "Crossbowman", level: 5 }, { name: "Garrison Shooter", level: 7 }, { name: "Crossbowman", level: 5 } ], front: [ { name: "Shield Bearer", level: 8 } ] },
    { back: [ { name: "Musketeer", level: 13 }, { name: "Musketeer", level: 13 }, { name: "Musketeer", level: 13 } ], front: [  ] },
    { back: [ { name: "Musketeer", level: 6 }, { name: "Royal Musketeer", level: 10 }, { name: "Musketeer", level: 6 } ], front: [ { name: "Knight", level: 4 }, { name: "Knight", level: 4 } ] },
    { back: [ { name: "Archer", level: 11 }, { name: "Mage", level: 11 } ], front: [ { name: "Knight", level: 14 } ] },
    { back: [ { name: "Garrison Shooter", level: 7 }, { name: "Garrison Shooter", level: 7 } ], front: [ { name: "Guardian", level: 7 }, { name: "Guardian", level: 7 }, { name: "Guardian", level: 7 } ] },
    { back: [ { name: "Hunter", level: 11 }, { name: "Hunter", level: 11 }, { name: "Hunter", level: 11 } ], front: [ { name: "Guardian", level: 10 }, { name: "Woodcutter", level: 10 } ] },
    { back: [ { name: "Horse Crossbowman", level: 9 } ], front: [ { name: "Swordsman", level: 7 }, { name: "Mace Mercenary", level: 7 } ] },
    //71-80
    { back: [ { name: "Horse Crossbowman", level: 6 }, { name: "Horse Crossbowman", level: 6 } ], front: [ { name: "Guardian", level: 13 } ] },
    { back: [ { name: "Archer", level: 4 }, { name: "Garrison Shooter", level: 3 }, { name: "Garrison Shooter", level: 3 }, { name: "Garrison Shooter", level: 3 }, { name: "Archer", level: 4 } ], front: [ { name: "Knight", level: 5 }, { name: "Infantry", level: 5 } ] },
    { back: [ { name: "Hunter", level: 3 }, { name: "Hunter", level: 3 }, { name: "Hunter", level: 3 }, { name: "Hunter", level: 3 }, { name: "Hunter", level: 3 }, ], front: [ { name: "Peasant", level: 3 }, { name: "Peasant", level: 3 }, { name: "Peasant", level: 3 }, { name: "Peasant", level: 3 }, { name: "Peasant", level: 3 }, ] },
    { back: [ { name: "Garrison Shooter", level: 5 }, { name: "Garrison Shooter", level: 5 }, { name: "Garrison Shooter", level: 5 } ], front: [ { name: "Knight", level: 5 }, { name: "Knight", level: 5 }, { name: "Knight", level: 5 }, ] },
    { back: [ { name: "Musketeer", level: 6 }, { name: "Royal Musketeer", level: 6 }, { name: "Musketeer", level: 6 }, ], front: [ { name: "Swordsman", level: 6 }, { name: "Mace Mercenary", level: 6 }, ] },
    { back: [ { name: "Archer", level: 8 }, { name: "Musketeer", level: 8 }, { name: "Crossbowman", level: 8 }, ], front: [ { name: "Warrior", level: 8 }, { name: "Infantry", level: 9 }, { name: "Woodcutter", level: 9 }, ] },
    { back: [ { name: "Saint", level: 5 }, { name: "Mage", level: 5 }, { name: "Mage", level: 5 }, ], front: [ { name: "Knight", level: 5 }, { name: "Knight", level: 5 }, { name: "Knight", level: 5 }, ] },
    { back: [ { name: "Royal Musketeer", level: 8 }, { name: "Royal Musketeer", level: 8 }, ], front: [ { name: "Swordsman", level: 8 }, { name: "Swordsman", level: 8 }, ] },
    { back: [ { name: "Saint", level: 8 }, { name: "Cursed Saint", level: 8 }, ], front: [ { name: "Swordsman", level: 2 }, { name: "Swordsman", level: 2 }, { name: "Swordsman", level: 2 }, ] },
    { back: [ { name: "Musketeer", level: 1 }, { name: "Royal Musketeer", level: 1 }, { name: "Saint", level: 2 }, { name: "Cursed Saint", level: 2 }, { name: "Horse Crossbowman", level: 2 }, ], front: [ { name: "Infantry", level: 2 }, { name: "Swordsman", level: 1 }, { name: "Knight", level: 1 }, { name: "Warrior", level: 2 }, { name: "Lancer", level: 5 }, ] },
    //81-90
    { back: [ { name: "Saint", level: 8 }, { name: "Cursed Saint", level: 8 }, ], front: [ { name: "Cuirassier", level: 8 }, { name: "Knight", level: 5 }, ] },
    { back: [ { name: "Garrison Shooter", level: 5 }, { name: "Garrison Shooter", level: 5 }, { name: "Garrison Shooter", level: 5 }, ], front: [ { name: "Halberdier", level: 6 }, { name: "Halberdier", level: 6 }] },
    { back: [  ], front: [ { name: "Lancer", level: 11 }, { name: "Lancer", level: 11 }, { name: "Lancer", level: 11 }, ] },
    { back: [ { name: "Horse Crossbowman", level: 4 }, { name: "Horse Crossbowman", level: 4 }, { name: "Horse Crossbowman", level: 4 }, ], front: [ { name: "Lancer", level: 5 }, { name: "Lancer", level: 5 }, { name: "Lancer", level: 5 }, ] },
    { back: [ { name: "Cannoneer", level: 5 }, { name: "Cannoneer", level: 5 }, ], front: [ { name: "Knight", level: 7 }, { name: "Knight", level: 7 }, { name: "Knight", level: 7 }, ] },
    { back: [ { name: "Cannoneer", level: 8 }, { name: "Cannoneer", level: 8 }, { name: "Cannoneer", level: 8 }, { name: "Cannoneer", level: 8 }, { name: "Cannoneer", level: 8 }, ], front: [  ] },
    { back: [ { name: "Cannoneer", level: 15 }, ], front: [ { name: "Swordsman", level: 5 }, { name: "Swordsman", level: 5 }, { name: "Swordsman", level: 5 }, ] },
    { back: [ { name: "Cannoneer", level: 7 }, { name: "Saint", level: 5 }, { name: "Cannoneer", level: 7 }, ], front: [ { name: "Swordsman", level: 8 }, { name: "Swordsman", level: 8 }, ] },
    { back: [  ], front: [ { name: "Saint", level: 25 } ] },
    { back: [  ], front: [ { name: "Lancer", level: 7 }, { name: "Lancer", level: 7 }, { name: "Cavalier", level: 10 }, { name: "Lancer", level: 7 }, { name: "Lancer", level: 7 }, ] },
    //91-100
    { back: [ { name: "Bombardier", level: 7 }, { name: "Bombardier", level: 7 }, { name: "Bombardier", level: 7 }, ], front: [ { name: "Cuirassier", level: 7 }, { name: "Cuirassier", level: 7 }, ] },
    { back: [ { name: "Bombardier", level: 7 }, { name: "Garrison Shooter", level: 10 }, { name: "Garrison Shooter", level: 10 }, ], front: [ { name: "Hammerman", level: 8 }, { name: "Hammerman", level: 8 }, ] },
    { back: [ { name: "Archer", level: 12 }, { name: "Garrsion Shooter", level: 12 }, { name: "Bombardier", level: 10 }, ], front: [ { name: "Knight", level: 10 }, { name: "Knight", level: 10 }, ] },
    { back: [  ], front: [ { name: "Guardian", level: 7 }, { name: "Guardian", level: 7 }, { name: "Guard Captain", level: 10 }, { name: "Guardian", level: 7 }, { name: "Guardian", level: 7 }, ] },
    { back: [ { name: "Cannoneer", level: 10 }, { name: "Bombardier", level: 10 }, { name: "Cannoneer", level: 10 }, ], front: [ { name: "Shield Bearer", level: 3 }, { name: "Shield Bearer", level: 3 }, { name: "Shield Bearer", level: 3 }, ] },
    { back: [ { name: "Cannoneer", level: 3 }, { name: "Cannoneer", level: 3 }, { name: "Cannoneer", level: 3 }, { name: "Cannoneer", level: 3 }, { name: "Cannoneer", level: 3 }, ], front: [ { name: "Cannoneer", level: 3 }, { name: "Cannoneer", level: 3 }, { name: "Cannoneer", level: 3 }, { name: "Cannoneer", level: 3 }, { name: "Cannoneer", level: 3 }, ] },
    { back: [ { name: "Bombardier", level: 10 }, ], front: [ { name: "Shield Bearer", level: 5 }, { name: "Shield Bearer", level: 5 }, { name: "Shield Bearer", level: 5 }, { name: "Shield Bearer", level: 5 }, { name: "Shield Bearer", level: 5 }, ] },
    { back: [ { name: "Horse Crossbowman", level: 7 }, { name: "Horse Crossbowman", level: 7 }, { name: "Horse Crossbowman", level: 7 }, ], front: [ { name: "Cavalier", level: 7 }, { name: "Cavalier", level: 7 }, { name: "Cavalier", level: 7 }, ] },
    { back: [ { name: "Mage Student", level: 5 }, { name: "Mage", level: 5 }, { name: "Wizard", level: 5 }, { name: "Mage", level: 5 }, { name: "Mage Student", level: 5 }, ], front: [ { name: "Knight", level: 6 }, { name: "Mace Mercenary", level: 5 }, { name: "Swordsman", level: 5 }, ] },
    { back: [ { name: "Cannoneer", level: 3 }, { name: "Horse Crossbowman", level: 3 }, { name: "Saint", level: 3 }, { name: "Musketeer", level: 5 }, { name: "Garrison Shooter", level: 4 }, ], front: [ { name: "Hammerman", level: 3 }, { name: "Lancer", level: 3 }, { name: "Hero", level: 10 }, { name: "Lancer", level: 3 }, { name: "Swordsman", level: 4 }, ] },
];

const ASCENSIONS = {
    "Peasant": {
        "Infantry": [
            { name: "Spear", rarity: "Uncommon", quantity: 1, type: "item" },
            { name: "Battle Records", rarity: "Uncommon", quantity: 1, type: "item" },
            { level: 2 }
        ],
        "Woodcutter": [
            { name: "Axe", rarity: "Uncommon", quantity: 1, type: "item" },
            { name: "Wood", rarity: "Common", quantity: 4, type: "item" },
            { level: 2 }
        ],
        "Hunter": [
            { name: "Bow", rarity: "Uncommon", quantity: 1, type: "item" },
            { name: "Battle Records", rarity: "Uncommon", quantity: 1, type: "item" },
            { level: 2 }
        ]
    },
    "Hunter": {
        "Archer": [
            { name: "Human Vessel", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Bow", rarity: "Uncommon", quantity: 2, type: "item" },
            { name: "Cloak", rarity: "Rare", quantity: 1, type: "item" },
            { level: 2 }
        ],
        "Crossbowman": [
            { name: "Human Vessel", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Bow", rarity: "Uncommon", quantity: 2, type: "item" },
            { name: "Battle Books", rarity: "Rare", quantity: 1, type: "item" },
            { level: 2 }
        ],
        "Musketeer": [
            { name: "Human Vessel", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Musket", rarity: "Uncommon", quantity: 1, type: "item" },
            { name: "Battle Records", rarity: "Uncommon", quantity: 4, type: "item" },
            { level: 2 }
        ]
    },
    "Infantry": {
        "Warrior": [
            { name: "Human Vessel", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Battle Records", rarity: "Uncommon", quantity: 4, type: "item" },
            { name: "Sword", rarity: "Uncommon", quantity: 1, type: "item" },
            { level: 2 }
        ]
    },
    "Bandit": {
        "Bandit Thief": [
            { name: "Human Vessel", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Cloak", rarity: "Uncommon", quantity: 2, type: "item" },
            { name: "Sword", rarity: "Uncommon", quantity: 2, type: "item" },
            { level: 2 }
        ]
    },
    "Skeleton": {
        "Skeleton Knight": [
            { name: "Undead Vessel", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Light Armor", rarity: "Rare", quantity: 1, type: "item" },
            { name: "Sword", rarity: "Uncommon", quantity: 1, type: "item" },
            { level: 2 }
        ]
    },
    "Speedy": {
        "Lightningbearer": [
            { name: "Inhuman Vessel", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Potion of Speed", rarity: "Rare", quantity: 3, type: "item" },
            { name: "Essence of Lightning", rarity: "Superrare", quantity: 1, type: "item" },
            { level: 4 }
        ]
    },
    "Slowy": {
        "Tank": [
            { name: "Inhuman Vessel", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Potion of Slowness", rarity: "Rare", quantity: 2, type: "item" },
            { name: "Armor Plates", rarity: "Rare", quantity: 4, type: "item" },
            { level: 4 }
        ]
    },
    "Warrior": {
        "Knight": [
            { name: "Human Vessel", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Armor", rarity: "Superrare", quantity: 1, type: "item" },
            { name: "Steel Sword", rarity: "Superrare", quantity: 1, type: "item" },
            { name: "Shield", rarity: "Rare", quantity: 1, type: "item" },
            { level: 4 }
        ],
        "Clubman": [
            { name: "Human Vessel", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Mace", rarity: "Rare", quantity: 3, type: "item" },
            { name: "Battle Books", rarity: "Rare", quantity: 3, type: "item" },
            { level: 4 }
        ],
        "Guardian": [
            { name: "Human Vessel", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Spear", rarity: "Uncommon", quantity: 5, type: "item" },
            { name: "Shield", rarity: "Rare", quantity: 2, type: "item" },
            { name: "Battle Books", rarity: "Rare", quantity: 2, type: "item" },
            { level: 4 }
        ]
    },
    "Bandit Thief": {
        "Marauder": [
            { name: "Human Vessel", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Steel Blade", rarity: "Superrare", quantity: 1, type: "item" },
            { name: "Cloak", rarity: "Rare", quantity: 2, type: "item" },
            { level: 4 }
        ]
    },
    "Musketeer": {
        "Royal Musketeer": [
            { name: "Human Vessel", rarity: "Epic", quantity: 6, type: "item" },
            { name: "Musket", rarity: "Uncommon", quantity: 5, type: "item" },
            { name: "Battle Medals", rarity: "Epic", quantity: 3, type: "item" },
            { level: 7 }
        ]
    },
    "Tank": {
        "Brute": [
            { name: "Inhuman Vessel", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Potion of Gigantism", rarity: "Rare", quantity: 6, type: "item" },
            { name: "Potion of Strength", rarity: "Rare", quantity: 6, type: "item" },
            { name: "Armor Plates", rarity: "Rare", quantity: 7, type: "item" },
            { level: 6 }
        ]
    },
    "Tetradrone": {
        "Hexadrone": [
            { name: "Cybernetic Vessel", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Titanium Ingot", rarity: "Rare", quantity: 5, type: "item" },
            { name: "Laser Batteries", rarity: "Superrare", quantity: 2, type: "item" },
            { name: "AI Chip", rarity: "Epic", quantity: 2, type: "item" },
            { level: 6 }
        ]
    },
    "Marauder": {
        "Gang Leader": [
            { name: "Human Vessel", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Steel Blade", rarity: "Rare", quantity: 8, type: "item" },
            { name: "Cloak", rarity: "Rare", quantity: 6, type: "item" },
            { name: "Thief's Ring", rarity: "Epic", quantity: 1, type: "item" },
            { level: 6 }
        ]
    },
    "Hexadrone": {
        "Superdrone": [
            { name: "Cybernetic Vessel", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Laser Ingot", rarity: "Superrare", quantity: 8, type: "item" },
            { name: "Diamond Battery", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Superintelligence Chip", rarity: "Mythic", quantity: 1, type: "item" },
            { level: 8 }
        ]
    },
    "Priest": {
        "Godlike Priest": [
            { name: "Human Vessel", rarity: "Epic", quantity: 17, type: "item" },
            { name: "Faith", rarity: "Mythic", quantity: 3, type: "item" },
            { name: "Essence of Light", rarity: "Epic", quantity: 15, type: "item" },
            { level: 11 }
        ],
        "Exorcist": [
            { name: "Human Vessel", rarity: "Epic", quantity: 7, type: "item" },
            { name: "Book of Demon Banishment", rarity: "Mythic", quantity: 1, type: "item" },
            { name: "Essence of Light", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Faith", rarity: "Mythic", quantity: 1, type: "item" },
            { level: 8 }
        ]
    },
    "Cursed Priest": {
        "Fallen Priest": [
            { name: "Human Vessel", rarity: "Epic", quantity: 17, type: "item" },
            { name: "Curse", rarity: "Mythic", quantity: 3, type: "item" },
            { name: "Essence of Darkness", rarity: "Epic", quantity: 15, type: "item" },
            { level: 11 }
        ]
    },
    "Killer": {
        "Berserker": [
            { name: "Human Vessel", rarity: "Epic", quantity: 10, type: "item" },
            { name: "Potion of Rage", rarity: "Epic", quantity: 3, type: "item" },
            { name: "Potion of Frenzy", rarity: "Epic", quantity: 3, type: "item" },
            { name: "Bloodthirst Blade", rarity: "Mythic", quantity: 2, type: "item" },
            { level: 10 }
        ]
    },
    "Cannoneer": {
        "Bombardier": [
            { name: "Human Vessel", rarity: "Epic", quantity: 10, type: "item" },
            { name: "Portable Cannon", rarity: "Epic", quantity: 3, type: "item" },
            { name: "Bombard", rarity: "Mythic", quantity: 1, type: "item" },
            { name: "Battle Medals", rarity: "Epic", quantity: 6, type: "item" },
            { level: 10 }
        ]
    },
    "Superdrone": {
        "Ultradrone": [
            { name: "Cybernetic Vessel", rarity: "Epic", quantity: 10, type: "item" },
            { name: "Diamond Battery", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Alien Ingot", rarity: "Mythic", quantity: 1, type: "item" },
            { name: "Destruction Protocol", rarity: "Legendary", quantity: 1, type: "item" },
            { level: 10 }
        ]
    },
    "Lancer": {
        "Cavalier": [
            { name: "Human Vessel", rarity: "Epic", quantity: 10, type: "item" },
            { name: "Elite Guard Spear", rarity: "Mythic", quantity: 1, type: "item" },
            { name: "Light Armor", rarity: "Rare", quantity: 15, type: "item" },
            { name: "Battle Medals", rarity: "Epic", quantity: 6, type: "item" },
            { name: "Horse", rarity: "Epic", quantity: 3, type: "item" },
            { level: 10 }
        ]
    },
    "Cuirassier": {
        "Paladin": [
            { name: "Human Vessel", rarity: "Epic", quantity: 25, type: "item" },
            { name: "Hero Vessel", rarity: "Legendary", quantity: 1, type: "item" },
            { name: "Battle Aura", rarity: "Mythic", quantity: 5, type: "item" },
            { name: "Sword of Protection", rarity: "Legendary", quantity: 1, type: "item" },
            { name: "Absolute Armor", rarity: "Legendary", quantity: 1, type: "item" },
            { level: 14 }
        ]
    },
    "Guardian": {
        "Halberdier": [
            { name: "Human Vessel", rarity: "Epic", quantity: 7, type: "item" },
            { name: "Halberd", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Battle Medals", rarity: "Epic", quantity: 3, type: "item" },
            { name: "Dense Armor", rarity: "Epic", quantity: 2, type: "item" },
            { level: 8 }
        ]
    },
    "Halberdier": {
        "Guard Captain": [
            { name: "Human Vessel", rarity: "Epic", quantity: 10, type: "item" },
            { name: "Elite Guard Spear", rarity: "Mythic", quantity: 1, type: "item" },
            { name: "Elite Knight Armor", rarity: "Mythic", quantity: 1, type: "item" },
            { name: "Battle Aura", rarity: "Mythic", quantity: 2, type: "item" },
            { level: 10 }
        ]
    },
    "Cavalier": {
        "Cavalier Guard": [
            { name: "Human Vessel", rarity: "Epic", quantity: 15, type: "item" },
            { name: "Hero Vessel", rarity: "Legendary", quantity: 1, type: "item" },
            { name: "Elite Guard Spear", rarity: "Mythic", quantity: 3, type: "item" },
            { name: "Elite Knight Armor", rarity: "Mythic", quantity: 1, type: "item" },
            { name: "Battle Aura", rarity: "Mythic", quantity: 3, type: "item" },
            { level: 12 }
        ]
    },
    "Pilgrim": {
        "Mage Student": [
            { name: "Human Vessel", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Staff", rarity: "Uncommon", quantity: 1, type: "item" },
            { name: "Cloak", rarity: "Uncommon", quantity: 3, type: "item" },
            { level: 2 }
        ],
        "Monk": [
            { name: "Human Vessel", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Cloak", rarity: "Uncommon", quantity: 3, type: "item" },
            { level: 2 }
        ]
    },
    "Mage Student": {
        "Mage": [
            { name: "Human Vessel", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Essence of Water", rarity: "Rare", quantity: 1, type: "item" },
            { name: "Essence of Light", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Cloak", rarity: "Rare", quantity: 1, type: "item" },
            { level: 4 }
        ]
    },
    "Mage": {
        "Shaman": [
            { name: "Human Vessel", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Essence of Elements", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Essence of Earth", rarity: "Rare", quantity: 3, type: "item" },
            { name: "Mage's Staff", rarity: "Rare", quantity: 2, type: "item" },
            { level: 6 }
        ],
        "Wizard": [
            { name: "Human Vessel", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Essence of Balance", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Cloak", rarity: "Rare", quantity: 5, type: "item" },
            { level: 6 }
        ]
    },
    "Shaman": {
        "Elder": [
            { name: "Human Vessel", rarity: "Epic", quantity: 7, type: "item" },
            { name: "Essence of Elements", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Essence of Balance", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Mage's Staff", rarity: "Rare", quantity: 6, type: "item" },
            { level: 8 }
        ]
    },
    "Monk": {
        "Priest": [
            { name: "Human Vessel", rarity: "Epic", quantity: 6, type: "item" },
            { name: "Essence of Light", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Cloak", rarity: "Rare", quantity: 1, type: "item" },
            { level: 7 }
        ],
        "Cursed Priest": [
            { name: "Human Vessel", rarity: "Epic", quantity: 6, type: "item" },
            { name: "Essence of Darkness", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Cloak", rarity: "Rare", quantity: 1, type: "item" },
            { level: 7 }
        ]
    },
    "Knight": {
        "Swordsman": [
            { name: "Human Vessel", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Steel Sword", rarity: "Superrare", quantity: 2, type: "item" },
            { name: "Armor", rarity: "Superrare", quantity: 2, type: "item" },
            { name: "Battle Medals", rarity: "Epic", quantity: 3, type: "item" },
            { level: 6 }
        ]
    },
    "Swordsman": {
        "Cuirassier": [
            { name: "Human Vessel", rarity: "Epic", quantity: 7, type: "item" },
            { name: "Broadsword", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Elite Knight Armor", rarity: "Mythic", quantity: 1, type: "item" },
            { name: "Battle Medals", rarity: "Epic", quantity: 5, type: "item" },
            { level: 8 }
        ]
    },
    "Clubman": {
        "Mace Mercenary": [
            { name: "Human Vessel", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Morning Star", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Cloak", rarity: "Rare", quantity: 3, type: "item" },
            { name: "Battle Medals", rarity: "Epic", quantity: 2, type: "item" },
            { level: 6 }
        ]
    },
    "Mace Mercenary": {
        "Hammerman": [
            { name: "Human Vessel", rarity: "Epic", quantity: 7, type: "item" },
            { name: "Morning Star", rarity: "Epic", quantity: 3, type: "item" },
            { name: "Elite Knight Armor", rarity: "Mythic", quantity: 1, type: "item" },
            { name: "Battle Aura", rarity: "Mythic", quantity: 1, type: "item" },
            { level: 8 }
        ]
    },
    "Crossbowman": {
        "Horse Crossbowman": [
            { name: "Human Vessel", rarity: "Epic", quantity: 6, type: "item" },
            { name: "Horse", rarity: "Epic", quantity: 1, type: "item" },
            { name: "Light Armor", rarity: "Rare", quantity: 2, type: "item" },
            { name: "Battle Medals", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Powerful Crossbow", rarity: "Superrare", quantity: 2, type: "item" },
            { level: 7 }
        ]
    },
    "Archer": {
        "Garrison Shooter": [
            { name: "Human Vessel", rarity: "Epic", quantity: 4, type: "item" },
            { name: "Light Armor", rarity: "Rare", quantity: 1, type: "item" },
            { name: "Battle Medals", rarity: "Epic", quantity: 2, type: "item" },
            { name: "Powerful Bow", rarity: "Rare", quantity: 2, type: "item" },
            { level: 7 }
        ]
    }
};

function getRarityClass(rarity) { return rarityColors2[rarity] || ''; }
function getRarityOrder(rarity) { return rarityOrder.indexOf(rarity) + 1 || 99; }

// где-то в коде, один раз
const itemNameToKey = {
    "Speed Grass": "speed_grass",
    "Unusual Water": "unusual_water",
    "Magic Water": "magic_water",
    "Root of Power": "root_of_power",
    "Pile of Earth": "pile_of_earth",
    "Gulliver Genes": "gulliver_genes",
    "Iron Ingot": "iron_ingot",
    "Iron Ore": "iron_ore",
    "Wood": "wood",
    "Battle Records": "battle_records",
    "Battery": "battery",
    "Robot Chip": "robot_chip",
    "Essence of Lightning": "essence_lightning",
    "Essence of Fire": "essence_fire",
    "Essence of Water": "essence_water",
    "Essence of Earth": "essence_earth",
    "Essence of Ice": "essence_ice",
    "Essence of Air": "essence_air",
    "Essence of Light": "essence_light",
    "Essence of Darkness": "essence_darkness",
    "Armor Plates": "armor_plates",
    "Potion of Speed": "potion_speed",
    "Potion of Strength": "potion_strength",
    "Potion of Slowness": "potion_slowness",
    "Faith": "faith",
    "Potion of Gigantism": "potion_gigantism",
    "Titanium Ingot": "titanium_ingot",
    "Titanium Ore": "titanium_ore",
    "Laser Batteries": "laser_batteries",
    "AI Chip": "ai_chip",
    "Infected Blood": "infected_blood",
    "Potion of Frenzy": "potion_frenzy",
    "Curse": "curse",
    "Obsidian Ingot": "obsidian_ingot",
    "Obsidian": "obsidian",
    "Battle Books": "battle_books",
    "Coins": "coins",
    "Laser Ingot": "laser_ingot",
    "Laser Ore": "laser_ore",
    "Diamond Battery": "diamond_battery",
    "Diamond": "diamond",
    "Uranium": "uranium",
    "Superintelligence Chip": "superintelligence_chip",
    "Potion of Rage": "potion_rage",
    "Supermetal Ingot": "supermetal_ingot",
    "Battle Medals": "battle_medals",
    "Horse": "horse",
    "Support Flag": "support_flag",
    "Universal Alloy": "universal_alloy",
    "Sword of Protection": "sword_of_protection",
    "Absolute Armor": "absolute_armor",
    "Void Staff": "void_staff",
    "Unknown Ingot": "unknown_ingot",
    "Unknown Ore": "unknown_ore",
    "Blade Piercing Darkness": "blade_piercing_darkness",
    "Angels' Blessing": "angels_blessing",
    "Battle Aura": "battle_aura",
    "Destruction Protocol": "destruction_protocol",
    "Medkit": "medkit",
    "Piece of Cloth": "piece_of_cloth",
    "Piece of Leather": "piece_of_leather",
    "Rope": "rope",
    "Bow": "bow",
    "Pitchfork": "pitchfork",
    "Sword": "sword",
    "Stone": "stone",
    "Spear": "spear",
    "Axe": "axe",
    "Light Armor": "light_armor",
    "Shield": "shield",
    "Cloak": "cloak",
    "Steel Ingot": "steel_ingot",
    "Steel Ore": "steel_ore",
    "Obsidian Blade": "obsidian_blade",
    "Portable Cannon": "portable_cannon",
    "Dense Armor": "dense_armor",
    "Bloodthirst Blade": "bloodthirst_blade",
    "Elite Guard Spear": "elite_guard_spear",
    "Soul of Vengeance": "soul_of_vengeance",
    "Fallen King Sword": "fallen_king_sword",
    "Alien Ingot": "alien_ingot",
    "Alien Ore": "alien_ore",
    "Aura of Protection": "aura_of_protection",
    "Absolute Ore": "absolute_ore",
    "Absolute Ingot": "absolute_ingot",
    "Essence of Elements": "essence_of_elements",
    "Essence of Balance": "essence_of_balance",
    "Bombard": "bombard",
    "Cape": "cape",
    "Mace": "mace",
    "Steel Blade": "steel_blade",
    "Blade": "blade",
    "Musket": "musket",
    "Broadsword": "broadsword",
    "Thief's Ring": "thiefs_ring",
    "Bones": "bones",
    "Corrosion Potion": "corrosion_potion",
    "Elite Knight Armor": "elite_knight_armor",
    "Halberd": "halberd",
    "Armor": "armor",
    "Steel Sword": "steel_sword",
    "Book of Demon Banishment": "book_of_demon_banishment",
    "Staff": "staff",
    "Morning Star": "morning_star",
    "Powerful Crossbow": "powerful_crossbow",
    "Powerful Bow": "powerful_bow",
    "Mage's Staff": "mages_staff",
    "Human Vessel": "human_vessel",
    "Inhuman Vessel": "inhuman_vessel",
    "Undead Vessel": "undead_vessel",
    "Cybernetic Vessel": "cybernetic_vessel",
    "Hero Vessel": "hero_vessel",
    "Void Vessel": "void_vessel"
};

const levelRewards = [
    { level: 2, textKey: 'level_reward_1' },
    { level: 3, textKey: 'level_reward_2' },
    { level: 7, textKey: 'level_reward_3' },
    { level: 10, textKey: 'level_reward_4' },
    { level: 15, textKey: 'level_reward_5' },
];

window.addCharacterByName = function(name, level = 1) {
    const baseChar = characters.find(c => c.name === name);
    if (!baseChar) {
        console.warn('Персонаж не найден:', name);
        return;
    }
    let materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
    // Проверка на дубликаты по имени и уровню (можно убрать, если не нужно)
    // if (materializedCharacters.some(c => c.name === name && c.level === level)) {
    //     console.warn('Такой персонаж уже есть');
    //     return;
    // }
    const maxHealth = Math.round((baseChar.maxHealth || baseChar.health || 100) * Math.pow(1.1, level - 1));
    const health = maxHealth;
    const damage = typeof baseChar.damage === 'number'
        ? Math.round(baseChar.damage * Math.pow(1.1, level - 1))
        : baseChar.damage;
    const newChar = {
        ...baseChar,
        id: Date.now() + Math.random(),
        level,
        exp: 0,
        maxExp: 100,
        maxHealth,
        health,
        damage
    };
    materializedCharacters.push(newChar);
    localStorage.setItem('materializedCharacters', JSON.stringify(materializedCharacters));
    if (typeof renderMaterializedCharacters === 'function') renderMaterializedCharacters();
    if (typeof updateCharactersList === 'function') updateCharactersList();
};