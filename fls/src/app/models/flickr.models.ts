export class FlickrSearch {
  userID: string;
  query: string;
  exclude: string;
  tagMode: string = 'any';
  perPage: number;
}

export class FlickrImage {
  flickr_image_id: string;
  flickr_image_url: string;
}

export class FlickrResult {
  id: number;
  url: string;
  thumbnail: string;
  tags: string;
  license: number;
  isSelected: boolean = true;
}
