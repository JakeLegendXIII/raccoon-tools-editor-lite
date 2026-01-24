/**
 * Represents a game item with all its properties and entities
 */
export class Item {
    ID: number = 0;

    Name: string = '';
    Description: string = '';
    ParentEntity: any = 0;
    ChangeValue: number = 0;
    TargetEntity: any = 0;
    ItemType: number = 0;
    UseCount: number = 1;    
}