import { Ng2EventsPage } from './app.po';

describe('ng2-events App', function() {
  let page: Ng2EventsPage;

  beforeEach(() => {
    page = new Ng2EventsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
