export class ViewMode {
  constructor(
    public id: number,
    public name: string,
    public containerClassName: string,
    public iconName: string,
    public thumbMinWidth: string,
    public thumbMaxWidth: string,
    public thumbMinHeight: string,
    public thumbMaxHeight: string,
  ) {}

  static list = new ViewMode(0, 'List', 'view-mode-list', 'view_list', '120px', '120px', '120px', '120px');
  static thumbnails = new ViewMode(1, 'Thumbnails', 'view-mode-thumbnails', 'dashboard', '200px', '600px', '200px', '600px');
}
