import { Group } from 'fabric';


const generateGUID = (): string => {
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
      case 1:
        this.label = 'Male';
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
      case 1:
        this.label = 'Teen';
      case 2:
        this.label = 'Adult';
      case 3:
        this.label = 'Elder';
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

  constructor(
    public graphics: Group,
    public type: ObjectXType,
    public gender?: Gender,
    public ageGroup?: AgeGroup,
    public uuid?: string,
  ) {
    this.uuid = uuid || generateGUID();
  }
}

enum DrawMode {
  add,
  remove,
  edit
};

export { generateGUID, DrawMode };
