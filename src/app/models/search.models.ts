export class ImageState {

  constructor(
    public value: number,
    public label: string,
  ) {}

  static selected = new ImageState(0, 'Selected');
  static discarded = new ImageState(1, 'Discarded');

  static statesAvailable = [
    ImageState.selected,
    ImageState.discarded,
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
  public image: string;
  public flickr_thumbnail: string;
  public flickr_url: string;

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
    this.image = data.image;
    this.flickr_thumbnail = data.flickr_thumbnail;
    this.flickr_url = data.flickr_url;
  }

  static getImageURL(image: Image): string {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`;
  }

  static getThumbnail(image: Image): string {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}_q.jpg`;
  }

}
