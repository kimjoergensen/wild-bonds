import { Creature } from '@wild-bonds/types/game/Creature';
import { CreatureType } from '@wild-bonds/types/game/CreatureType';
import { Move } from '@wild-bonds/types/game/Move';
import { MoveType } from '@wild-bonds/types/game/MoveType';



// Predefined creature types
export const CREATURES: Record<string, Creature> = {
  flamepup: {
    id: 'flamepup',
    name: 'Flamepup',
    type: 'critter',
    baseStats: {
      maxHealth: 50,
      attack: 30,
      defense: 20,
      specialAttack: 15,
      specialDefense: 15,
      stamina: 40,
      speed: 35,
    },
    statMultipliers: {
      maxHealth: 10,
      attack: 5,
      defense: 4,
      specialAttack: 3,
      specialDefense: 3,
      stamina: 6,
      speed: 5,
    },
    spriteSheet: 'flamepup.png',
    description: 'A small fire creature with boundless energy.',
  },

  grassling: {
    id: 'grassling',
    name: 'Grassling',
    type: 'plant',
    baseStats: {
      maxHealth: 45,
      attack: 25,
      defense: 15,
      specialAttack: 30,
      specialDefense: 15,
      stamina: 35,
      speed: 30,
    },
    statMultipliers: {
      maxHealth: 9,
      attack: 4,
      defense: 3,
      specialAttack: 5,
      specialDefense: 3,
      stamina: 6,
      speed: 5,
    },
    spriteSheet: 'grassling.png',
    description: 'A gentle plant creature that loves sunlight.',
  },

  aquafin: {
    id: 'aquafin',
    name: 'Aquafin',
    type: 'aquatic',
    baseStats: {
      maxHealth: 55,
      attack: 28,
      defense: 25,
      specialAttack: 20,
      specialDefense: 22,
      stamina: 38,
      speed: 32,
    },
    statMultipliers: {
      maxHealth: 11,
      attack: 4,
      defense: 3,
      specialAttack: 5,
      specialDefense: 3,
      stamina: 6,
      speed: 4,
    },
    spriteSheet: 'aquafin.png',
    description: 'A sleek water creature with powerful fins.',
  },

  sparkwing: {
    id: 'sparkwing',
    name: 'Sparkwing',
    type: 'avian',
    baseStats: {
      maxHealth: 40,
      attack: 35,
      defense: 15,
      specialAttack: 25,
      specialDefense: 20,
      stamina: 30,
      speed: 45,
    },
    statMultipliers: {
      maxHealth: 8,
      attack: 5,
      defense: 4,
      specialAttack: 3,
      specialDefense: 3,
      stamina: 6,
      speed: 7,
    },
    spriteSheet: 'sparkwing.png',
    description: 'An electric creature known for its incredible speed.',
  }
};

// Predefined moves
export const MOVES: Record<string, Move> = {
  tackle: {
    id: 'tackle',
    name: 'Tackle',
    type: 'normal',
    variant: 'physical',
    power: 20,
    accuracy: 95,
    cost: 5,
    description: 'A basic physical attack.'
  },

  ember: {
    id: 'ember',
    name: 'Ember',
    type: 'fire',
    variant: 'special',
    power: 25,
    accuracy: 90,
    cost: 10,
    description: 'Shoots small flames at the opponent.'
  },

  vineWhip: {
    id: 'vineWhip',
    name: 'Vine Whip',
    type: 'grass',
    variant: 'special',
    power: 25,
    accuracy: 90,
    cost: 10,
    description: 'Whips the target with slender vines.'
  },

  waterGun: {
    id: 'waterGun',
    name: 'Water Gun',
    type: 'water',
    variant: 'special',
    power: 25,
    accuracy: 90,
    cost: 10,
    description: 'Blasts the target with a powerful stream of water.'
  },

  thunderShock: {
    id: 'thunderShock',
    name: 'Thunder Shock',
    type: 'electric',
    variant: 'special',
    power: 25,
    accuracy: 90,
    cost: 10,
    description: 'Strikes the opponent with a jolt of electricity.'
  },

  quickAttack: {
    id: 'quickAttack',
    name: 'Quick Attack',
    type: 'normal',
    variant: 'physical',
    power: 15,
    accuracy: 100,
    cost: 7,
    description: 'A fast attack that always goes first.'
  }
};

// Type effectiveness chart (multipliers)
export const TYPE_EFFECTIVENESS: Record<CreatureType, Record<MoveType, number>> = {
  critter: {
    normal: 1, fire: 1.5, water: 1, grass: 1, ice: 0.5, electric: 1, poison: 1, shadow: 1,
  },
  avian: {
    normal: 1, fire: 1, water: 0.5, grass: 1, ice: 1, electric: 1.5, poison: 1, shadow: 1,
  },
  aquatic: {
    normal: 1, fire: 0.5, water: 1, grass: 1.5, ice: 0.5, electric: 1.5, poison: 1, shadow: 1,
  },
  reptile: {
    normal: 1, fire: 1, water: 1.5, grass: 1.5, ice: 1, electric: 1, poison: 0.5, shadow: 0.5,
  },
  plant: {
    normal: 1, fire: 2, water: 0.5, grass: 0.5, ice: 1, electric: 0.5, poison: 1.5, shadow: 1,
  },
  ghost: {
    normal: 1, fire: 1, water: 1, grass: 1, ice: 1, electric: 1, poison: 1, shadow: 2,
  },
  dragon: {
    normal: 1, fire: 0, water: 1.5, grass: 0.5, ice: 1.5, electric: 0.5, poison: 1, shadow: 1,
  }
};