/* eslint-disable no-undef */
import MoviesRepository from './moviesRepository';

describe('Movies repository service', () => {
  it('Should get planet films by name', async () => {
    const sut = new MoviesRepository();

    const data = await sut.getMoviesCount('Tatooine');

    expect(data).toBe(5);
  });
});
