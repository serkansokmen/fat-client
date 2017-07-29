import { Group } from 'fabric';


const guid = (): string => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export class Gender {
  constructor(public value: string) {}

  toString() {
    return this.value;
  }

  static male = new Gender('Male');
  static female = new Gender('Female');
};

export class AgeGroup {
  constructor(public value: string) {}

  toString() {
    return this.value;
  }

  static child = new AgeGroup('Child');
  static teen = new AgeGroup('Teen');
  static adult = new AgeGroup('Adult');
  static elder = new AgeGroup('Elder');
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
  static arm = new ObjectXType(6, 'Arm', 'Arms', 'gray');
}

export class ObjectX {

  public guid: string;

  constructor(
    public graphics: Group,
    public type: ObjectXType,
    public gender?: Gender,
    public ageGroup?: AgeGroup
  ) {
    this.guid = guid();
    console.log(graphics);
  }
}

enum DrawMode {
  add,
  remove,
  edit
};

export { guid, DrawMode };
