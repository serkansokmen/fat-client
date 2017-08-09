import {
  fabric,
  Group
} from 'fabric';


const generateUUID = (): string => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export interface GenderJSON {
  value: number;
  label: string;
}

export class Gender implements GenderJSON {

  label: string;

  constructor(public value: number) {
    switch (value) {
      case 0:
        this.label = 'Female';
        break;
      case 1:
        this.label = 'Male';
        break;
      default: break;
    }
  }

  static female = new Gender(0);
  static male = new Gender(1);
};

export interface AgeGroupJSON {
  value: number;
  label: string;
}

export class AgeGroup implements AgeGroupJSON {

  label: string;

  constructor(public value: number) {
    switch (value) {
      case 0:
        this.label = 'Child';
        break;
      case 1:
        this.label = 'Teen';
        break;
      case 2:
        this.label = 'Adult';
        break;
      case 3:
        this.label = 'Elder';
        break;
      default: break;
    }
  }

  toString() {
    return this.value;
  }

  static child = new AgeGroup(0);
  static teen = new AgeGroup(1);
  static adult = new AgeGroup(2);
  static elder = new AgeGroup(3);
}

export class ObjectXType {
  constructor(
    public id: number,
    public name: string,
    public pluralName: string,
    public color: string
  ) {}

  static face = new ObjectXType(0, 'Face', 'Faces', 'orange');
  static genital = new ObjectXType(1, 'Genital', 'Genitals', 'red');
  static buttock = new ObjectXType(2, 'Buttock', 'Buttocks', 'green');
  static breast = new ObjectXType(3, 'Breast', 'Breasts', 'blue');
  static foot = new ObjectXType(4, 'Foot', 'Feet', 'cyan');
  static hand = new ObjectXType(5, 'Hand', 'Hands', 'magenta');
  static arm = new ObjectXType(6, 'Arm', 'Arms', 'pink');

  static find(id: number): ObjectXType {
    switch (id) {
      case 0:
        return ObjectXType.face;
      case 1:
        return ObjectXType.genital;
      case 2:
        return ObjectXType.buttock;
      case 3:
        return ObjectXType.breast;
      case 4:
        return ObjectXType.foot;
      case 5:
        return ObjectXType.hand;
      case 6:
        return ObjectXType.arm;
      default: break;
    }
  }
}

export class ObjectX {

  public uuid: string;
  public graphics: Group;
  public type: ObjectXType;
  public gender?: Gender;
  public ageGroup?: AgeGroup;

  constructor(data: any) {
    this.uuid = data.uuid || generateUUID();

    const objectType = ObjectXType.find(data.object_type);
    const rect = new fabric.Rect({
      width: data.width,
      height: data.height,
      left: data.x,
      top: data.y,
      fill: 'transparent',
      stroke: objectType.color,
      selectable: true
    });

    let graphics = new fabric.Group();
    graphics.off('selected');
    graphics.lockRotation = true;
    graphics.lockMovementX = false;
    graphics.lockMovementY = false;
    graphics.lockScalingY = false;
    graphics.lockScalingY = false;
    graphics.lockUniScaling = false;
    graphics.addWithUpdate(new fabric.Rect({
      left: graphics.getLeft(),
      top: graphics.getTop(),
      width: rect.getWidth(),
      height: rect.getHeight(),
      originX: 'center',
      originY: 'center',
      fill: objectType.color,
      stroke: 'transparent',
      opacity: 0.25
    }));
    graphics.addWithUpdate(new fabric.Text(objectType.name, {
      fontFamily: 'Arial',
      fontSize: (rect.getWidth() + rect.getHeight()) / 20,
      fill: objectType.color,
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    }));
    graphics.set('top', rect.getTop());
    graphics.set('left', rect.getLeft());

    this.graphics = graphics;
    this.type = objectType;
    this.gender = new Gender(data.gender);
    this.ageGroup = new AgeGroup(data.age_group);
  }
}

export enum DrawMode {
  add,
  remove,
  edit
};

export const objectTypes = [
  ObjectXType.face,
  ObjectXType.genital,
  ObjectXType.buttock,
  ObjectXType.breast,
  ObjectXType.foot,
  ObjectXType.hand,
  ObjectXType.arm
];
export const genders = [Gender.male, Gender.female];
export const ageGroups = [AgeGroup.child, AgeGroup.teen, AgeGroup.adult, AgeGroup.elder];
