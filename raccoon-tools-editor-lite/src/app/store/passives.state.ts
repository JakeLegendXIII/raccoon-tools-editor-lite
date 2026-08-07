import { Passive } from '../models/passive.model';

export interface PassiveState {
  passives: Passive[];
}

export const initialPassiveState: PassiveState = {
  passives: []
};