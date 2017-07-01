export class ImageState {

  constructor(
    public value: number,
    public label: string,
  ) {}

  static indeterminate = new ImageState(0, 'Indeterminate');
  static discarded = new ImageState(1, 'Discarded');
  static approved = new ImageState(2, 'Approved');
  static processed = new ImageState(3, 'Processed');

  static statesAvailable = [
    ImageState.discarded,
    ImageState.approved,
    ImageState.processed,
    ImageState.indeterminate
  ];

  static getState(value: number): ImageState {
    return ImageState.statesAvailable.filter(l => l.value == value)[0];
  }

  static getStateWithLabel(label: string): ImageState {
    return ImageState.statesAvailable.filter(l => l.label == label)[0];
  }
}

// licenses: json.licenses ? json.licenses.map(license_id => License.getLicense(license_id)) : []
export class License {

  constructor(
    public id: string,
    public name: string,
    public url: string,
    public isSelected: boolean = false
  ) {}

  static availableLicenses = [
    new License('0','All Rights Reserved', ''),
    new License('1','Attribution-NonCommercial-ShareAlike', 'http://creativecommons.org/licenses/by-nc-sa/2.0/'),
    new License('2','Attribution-NonCommercial', 'http://creativecommons.org/licenses/by-nc/2.0/'),
    new License('3','Attribution-NonCommercial-NoDerivs', 'http://creativecommons.org/licenses/by-nc-nd/2.0/'),
    new License('4','Attribution', 'http://creativecommons.org/licenses/by/2.0/'),
    new License('5','Attribution-ShareAlike', 'http://creativecommons.org/licenses/by-sa/2.0/'),
    new License('6','Attribution-NoDerivs', 'http://creativecommons.org/licenses/by-nd/2.0/'),
    new License('7','No known copyright restrictions', 'http://flickr.com/commons/usage/'),
    new License('8','United States Government Work', 'http://www.usa.gov/copyright.shtml'),
  ];

  static getLicense(id: string): License {
    let filtered = License.availableLicenses.filter(license => license.id === id);
    if (filtered.length > 0) {
      let first = filtered[0];
      return new License(first.id, first.name, first.url);
    }
  }
}

export class Search {

  public tags: string;
  public tagMode: string;
  public userID: string;

  toJSON(): any {
    // let tags = this.query ? this.query.replace(' ', '') : '';
    // let exclude = this.exclude ? this.exclude.replace(' ', '').split(',').map(str => `-${str.trim()}`).join(',') : '';
    // if (exclude != '-') {
    //   tags += `,${exclude}`;
    // }
    return Object.assign({}, this, {
      tags: this.tags,
      tag_mode: this.tagMode,
      user_id: this.userID
    });
  }

  static fromJSON(json: any): Search {
    if (typeof json === 'string') {
      return JSON.parse(json, Search.reviver);
    } else {
      let search = Object.create(Search.prototype);
      let tags = json.tags ? json.tags.split(',').map(str => str.trim()).join(',') : '';
      return Object.assign({}, search, {
        // query: tags ? tags.filter(str => str.charAt(0) != '-').join(', ') : '',
        // exclude: tags ? tags.filter(str => str.charAt(0) == '-').map(str => str.substr(1)).join(', ') : '',
        tags,
        tagMode: json.tag_mode,
        userID: json.user_id || null
      });
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? Search.fromJSON(value) : value;
  }
}

export class Image {
  public id: string;
  public title: string;
  public owner: string;
  public secret: string;
  public server: string;
  public farm: string;
  public license: License;
  public tags: string;
  public isPublic: boolean;
  public isFriend: boolean;
  public isFamily: boolean;
  public state: ImageState;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.owner = data.owner;
    this.secret = data.secret;
    this.server = data.server;
    this.farm = data.farm;
    this.license = data.license;
    this.tags = data.tags;
    this.isPublic = data.isPublic;
    this.isFriend = data.isFriend;
    this.isFamily = data.isFamily;
    this.state = data.state;
  }

  toJSON(): any {
    return Object.assign({}, this, {
      license: this.license ? this.license.id : null,
      ispublic: this.isPublic ? 1 : 0,
      isfriend: this.isFriend ? 1 : 0,
      isfamily: this.isFamily ? 1 : 0,
      state: this.state ? this.state.value : ImageState.indeterminate,
    });
  }

  static fromJSON(json: any): Image {
    if (typeof json === 'string') {
      return JSON.parse(json, Image.reviver);
    } else {
      let image = Object.create(Image.prototype);
      return Object.assign({}, image, {
        license: json.license ? License.getLicense(json.license) : null,
        isPublic: json.ispublic == 1 ? true : (json.ispublic == 0 ? false : null),
        isFriend: json.isfriend == 1 ? true : (json.ispublic == 0 ? false : null),
        isFamily: json.isfamily == 1 ? true : (json.ispublic == 0 ? false : null),
        state: json.state ? ImageState.getState(json.state) : ImageState.indeterminate,
      });
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? Image.fromJSON(value) : value;
  }

  static getImageURL(image: Image): string {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`;
  }

  static getThumbnail(image: Image): string {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}_q.jpg`;
  }

}
