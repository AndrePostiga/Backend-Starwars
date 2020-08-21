import MoviesRepository from '../../repository/moviesRepository';

class FindMovieService {
  constructor() {
    this.repository = new MoviesRepository();
  }

  async getMoviesCount(planetName) {
    const moviesCount = await this.repository.getMoviesCount(planetName);
    return moviesCount;
  }

  async getPlanetWithMoviesCount(planet) {
    const movies = await this.getMoviesCount(planet.name);
    return {
      ...planet.toObject(),
      movies,
    };
  }
}

export default new FindMovieService();
