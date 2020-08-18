/* eslint-disable no-undef */
import { soma, subtrai } from './server';

describe('server', () => {
  it('Should return correct value ', () => {
    const act = soma(3, 5);
    const expected = 8;

    // assert
    expect(act).toBe(expected);
  });
});

describe('server', () => {
  it('Should return correct value ', () => {
    const act = subtrai(3, 5);
    const expected = -2;

    // assert
    expect(act).toBe(expected);
  });
});
