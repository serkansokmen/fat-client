import { FlsPage } from './app.po';

describe('fls App', () => {
  let page: FlsPage;

  beforeEach(() => {
    page = new FlsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
