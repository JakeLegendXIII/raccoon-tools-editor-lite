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
    UsageRange: number = 0;
}