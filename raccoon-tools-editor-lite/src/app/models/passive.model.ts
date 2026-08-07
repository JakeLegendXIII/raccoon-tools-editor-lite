/**
 * Represents a passive ability and its state modifiers
 */
export class Passive {
	ID: number = 0;

	Name: string = '';
	Description: string = '';
	BonusAttack: boolean = false;
	BonusMove: boolean = false;
	BonusDamage: boolean = false;
	BonusRange: boolean = false;
	Stealth: boolean = false;
	Diagonal: boolean = false;
	Amount: number = 0;
}
