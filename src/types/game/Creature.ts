import { CreatureStats } from './CreatureStats';
import { CreatureType } from './CreatureType';
import { StatMultiplier } from './StatMultiplier';

export interface Creature {
  id: string;
  name: string;
  baseStats: CreatureStats;
  statMultipliers: StatMultiplier;
  spriteSheet: string;
  description: string;
  type: CreatureType;
}