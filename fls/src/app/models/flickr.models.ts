export class FlickrSearch {
  userID: string;
  query: string;
  exclude: string;
  tagMode: string = 'any';
  perPage: number;
  images: FlickrImage[];
}

export class FlickrImage {
  title: string;
  flickr_image_id: number;
  flickr_image_url: string;
  thumbnail: string;
  tags: string;
  license: number;
  is_discarded: boolean;

  constructor(data: any) {
    this.title = data.title || '';
    this.flickr_image_id = data.id || data.flickr_image_id;
    this.flickr_image_url = data.flickr_image_url || `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}.jpg`;
    this.thumbnail = `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}_q.jpg`;
    this.tags = data.tags;
    this.license = data.license;
    this.is_discarded = data.is_discarded || false;
  }

  toggleDiscarded() {
    this.is_discarded = !this.is_discarded;
  }
}
