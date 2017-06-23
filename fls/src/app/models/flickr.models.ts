export class ImageState {
  constructor(
    public label: string,
    public value: string
  ) {}

  static discarded = new ImageState('Discarded', 'discarded');
  static approved = new ImageState('Approved', 'approved');
  static processed = new ImageState('Processed', 'processed');
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
  id: number;
  name: string;
  url: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.url = data.url;
  }
}

export class FlickrSearch {
  query: string;
  exclude: string;
  userID: string;
  tagMode: TagMode;
  perPage: number;

  constructor(data: any) {
    this.query = data.query || '';
    this.exclude = data.exclude || '';
    this.userID = data.userID || '';
    this.tagMode = data.tagMode || TagMode.all;
    this.perPage = data.perPage || 40;
  }
}

export class FlickrImage {

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

  license: string;
  tags: string;

  is_public: boolean;
  is_friend: boolean;
  is_family: boolean;

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

    this.license = data.license;
    this.tags = data.tags;

    this.is_public = data.is_public;
    this.is_friend = data.is_friend;
    this.is_family = data.is_family;

    this.state = data.state;
  }

}
