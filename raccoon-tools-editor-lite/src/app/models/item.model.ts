/**
 * Enum representing the type of item effect
 */
export enum ItemType {
    Attack = 0,
    Heal = 1,
    Push = 2,
    Increase = 3,
    Decrease = 4
}

/**
 * Enum representing the target type of an item
 */
export enum TargetType {
    Self = 0,
    Ally = 1,
    Enemy = 2,
    Area = 3,
    Line = 4,
    Star = 5,
    Cross = 6
}

/**
 * Represents a game item with all its properties and entities
 */
export class Item {
    ID: number = 0;

    Name: string = '';
    Description: string = '';
    ChangeValue: number = 0;
    ItemType: ItemType = ItemType.Attack;
    UseCount: number = 1;    
    TargetRange: number = 0;
    TargetType: TargetType = TargetType.Self;
    UsageRange: number = 0;
}