import { Creature } from '@wild-bonds/types/game/Creature';
import { CreatureStats } from '@wild-bonds/types/game/CreatureStats';
import { Move } from '@wild-bonds/types/game/Move';
import { MOVES } from '@wild-bonds/utils/CreatureData';

export class CreatureEntity {
  public readonly id: string;
  public readonly isWild: boolean;
  public readonly moves: Move[];
  public nickname?: string;
  private creature: Creature;
  private health: number;
  private experience: number;

  /** The current level of the creature, derived from its experience points. */
  get level(): number {
    const level = Math.cbrt((4 * this.experience) / 5);
    return Math.floor(level);
  }

  /** The experience points required to reach the next level. */
  get experienceToNextLevel(): number {
    const nextLevel = this.level + 1;
    return Math.floor((5 * Math.pow(nextLevel, 3)) / 4) - this.experience;
  }

  /** The current stats of the creature, which may change over time. */
  get stats(): CreatureStats {
    return this.calculateStats();
  }

  /** The display name of the creature, using its nickname if available. */
  get name(): string {
    return this.nickname ?? this.creature.name;
  }

  /**
   * Checks if the creature is dead (health <= 0).
   * @returns True if the creature's health is zero or below, indicating it has fainted.
   */
  get isDead(): boolean {
    return this.health <= 0;
  }

  constructor(
    creature: Creature,
    experience: number,
    health?: number,
    nickname?: string,
    isWild: boolean = false,
  ) {
    this.id = `${creature.id}_${Date.now().valueOf()}_${Math.random().toString(36)}`;
    this.creature = creature;
    this.experience = experience;
    this.health = health ?? creature.baseStats.maxHealth;
    this.nickname = nickname;
    this.isWild = isWild;

    // Assign basic moves (in a real game, this would be more sophisticated)
    this.moves = [MOVES.tackle];
  }

  /**
   * Inflicts damage on the creature.
   * @param damage The amount of damage to inflict on the creature.
   * @returns The actual damage dealt to the creature.
   */
  public damage(damage: number): number {
    const actualDamage = Math.min(damage, this.health);
    this.health -= actualDamage;
    return actualDamage;
  }

  /**
   * Restores health to the creature.
   * @param amount The amount of health to restore.
   * @returns The actual amount of health restored.
   */
  public heal(amount: number): number {
    const actualHealing = Math.min(amount, this.stats.maxHealth - this.health);
    this.health += actualHealing;
    return actualHealing;
  }

  /**
   * Increases the creature's experience points.
   * @param amount The amount of experience points to gain.
   * @returns True if the creature leveled up, false otherwise.
   */
  public gainExperience(amount: number): boolean {
    const leveledUp = amount >= this.experienceToNextLevel;
    this.experience += amount;
    return leveledUp;
  }

  private calculateStats(): CreatureStats {
    const { baseStats, statMultipliers } = this.creature;

    const statFormula = <T extends keyof CreatureStats>(stat: T): number => {
      return Math.floor(baseStats[stat] + (this.level * statMultipliers[stat]));
    };

    return {
      maxHealth: statFormula('maxHealth'),
      attack: statFormula('attack'),
      defense: statFormula('defense'),
      specialAttack: statFormula('specialAttack'),
      specialDefense: statFormula('specialDefense'),
      speed: statFormula('speed'),
      stamina: statFormula('stamina'),
    };
  }
}