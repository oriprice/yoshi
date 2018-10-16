describe('something', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000');
  });

  it('should', async () => {
    expect(await page.title()).toMatchSnapshot();
  });
});
