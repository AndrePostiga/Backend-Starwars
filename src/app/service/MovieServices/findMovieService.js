export class FindMovieService {
  constructor(moviesRepository) {
    this.moviesRepository = moviesRepository;
  }

  async getMoviesCount(planetName) {
    const moviesCount = await this.moviesRepository.getMoviesCount(planetName);
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
