
export interface CardLayoutOptions {
  id: number;
  name: string;
  iconName: string;
  containerClassName: string;
  cardScale: number;
  isActionsVisible: boolean;
}

export class CardLayoutOptions {

  constructor(
    public id: number,
    public name: string,
    public iconName: string,
    public containerClassName: string,
    public cardScale: number,
    public isActionsVisible: boolean,
  ) {}

  static list = new CardLayoutOptions(0, 'List', 'th-list', 'view-mode-list', 100, false);
  static thumbs = new CardLayoutOptions(1, 'Thumbnails', 'th-large', 'view-mode-thumbnails', 33.3, false);
}
