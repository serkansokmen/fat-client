export class TagMode {
  constructor(
    public label: string,
    public value: string
  ) {}

  static all = new TagMode('ALL', 'all');
  static any = new TagMode('OR', 'any');
}

export class FlickrSearch {
  query: string;
  exclude: string;
  userID: string;
  tagMode: TagMode;
  perPage: number;
  images: FlickrImage[];

  constructor(data: any) {
    this.query = data.query || '';
    this.exclude = data.exclude || '';
    this.userID = '';
    this.tagMode = data.tagMode || TagMode.all;
    this.perPage = 10;
    this.images = [];
  }
}

export class FlickrImage {
  title: string;
  flickr_image_id: number;
  flickr_image_url: string;
  thumbnail: string;
  tags: string;
  license: number;
  is_discarded: boolean;

  constructor(data: any = {}) {
    this.title = data.title || '';
    this.flickr_image_id = data.id || data.flickr_image_id;
    this.flickr_image_url = data.flickr_image_url || `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}.jpg`;
    if (data.farm && data.server & data.secret) {
      this.thumbnail =  `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}_q.jpg`;
    } else {
      this.thumbnail = '';
    }
    this.tags = data.tags || '';
    this.license = data.license || -1;
    this.is_discarded = data.is_discarded || false;
  }

  toggleDiscarded() {
    this.is_discarded = !this.is_discarded;
  }
}
