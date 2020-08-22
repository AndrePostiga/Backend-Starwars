export class MoviesRepository {
  constructor(externalApiResource) {
    this.externalApiResource = externalApiResource;
  }

  async getMovies(planetName) {
    const planet = await this.externalApiResource.get(`/?search=${planetName}`);
    const movies = planet.data.results.shift();
    return movies;
  }

  async getMoviesCount(planetName) {
    const movies = await this.getMovies(planetName);

    if (!movies) {
      return 0;
    }

    return movies.films.length;
  }
}
