export class FlickrQuery {
  userID: string;
  query: string;
  exclude: string;
  tagMode: string = 'any';
  perPage: number;
}

export class FlickrSearch {
  image: string;
  flickr_image_id: string;
}

export class FlickrResult {
  id: number;
  url: string;
  thumbnail: string;
  tags: string;
  license: number;
  isSelected: boolean = true;
}
