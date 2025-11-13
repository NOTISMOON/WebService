import { ViewMiddleware } from './view.middleware';

describe('ViewMiddleware', () => {
  it('should be defined', () => {
    expect(new ViewMiddleware()).toBeDefined();
  });
});