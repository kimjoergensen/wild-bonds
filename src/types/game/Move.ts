import { MoveType } from './MoveType';
import { MoveVariant } from './MoveVariant';

export interface Move {
  id: string;
  name: string;
  power: number;
  accuracy: number;
  cost: number;
  type: MoveType;
  variant: MoveVariant;
  description: string;
}