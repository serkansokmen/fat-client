export class ImageState {
  constructor(
    public value: number,
    public label: string,
  ) {}

  static discarded = new ImageState(0, 'Discarded');
  static approved = new ImageState(1, 'Approved');
  static processed = new ImageState(2, 'Processed');
}

export class TagMode {
  constructor(
    public label: string,
    public value: string
  ) {}

  static all = new TagMode('ALL', 'all');
  static any = new TagMode('OR', 'any');
}

export class License {
  constructor(
    public id: string,
    public name: string,
    public url: string
  ) {}

  static licensesAvailable = [
    new License('0', 'All Rights Reserved', ''),
    new License('1', 'Attribution-NonCommercial-ShareAlike', 'http://creativecommons.org/licenses/by-nc-sa/2.0/'),
    new License('2', 'Attribution-NonCommercial', 'http://creativecommons.org/licenses/by-nc/2.0/'),
    new License('3', 'Attribution-NonCommercial-NoDerivs', 'http://creativecommons.org/licenses/by-nc-nd/2.0/'),
    new License('4', 'Attribution', 'http://creativecommons.org/licenses/by/2.0/'),
    new License('5', 'Attribution-ShareAlike', 'http://creativecommons.org/licenses/by-sa/2.0/'),
    new License('6', 'Attribution-NoDerivs', 'http://creativecommons.org/licenses/by-nd/2.0/'),
    new License('7', 'No known copyright restrictions', 'http://flickr.com/commons/usage/'),
    new License('8', 'United States Government Work', 'http://www.usa.gov/copyright.shtml'),
  ];

  static getLicense(id: string): License {
    return License.licensesAvailable.filter(l => l.id == id)[0];
  }

}

export class Search {
  query: string;
  exclude: string;
  userID: string;
  tagMode: TagMode;

  constructor(data: any) {
    this.query = data.query || '';
    this.exclude = data.exclude || '';
    this.userID = data.userID || '';
    this.tagMode = data.tagMode || TagMode.all;
  }
}

export class Image {

  state: ImageState;

  title: string;

  id: string;
  flickr_id: string;
  flickr_url: string;
  flickr_thumbnail: string;

  owner: string;
  secret: string;
  server: string;
  farm: string;

  license: License;
  tags: string;

  // is_public: boolean;
  // is_friend: boolean;
  // is_family: boolean;

  constructor(data: any = {}) {
    this.id = data.id;
    this.title = data.title;
    this.flickr_id = data.flickr_id || data.id;
    this.flickr_url = data.flickr_url;
    this.flickr_thumbnail = data.flickr_thumbnail;

    this.owner = data.owner;
    this.secret = data.secret;
    this.server = data.server;
    this.farm = data.farm;
    this.license = data.license.id ? data.license : License.getLicense(data.license);
    this.tags = data.tags;

    // this.is_public = data.is_public;
    // this.is_friend = data.is_friend;
    // this.is_family = data.is_family;

    this.state = data.state;
  }

}
