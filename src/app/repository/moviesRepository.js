export class MoviesRepository {
  constructor(externalApiResource, cache) {
    this.externalApiResource = externalApiResource;
    this.cache = cache;
  }

  async getMovies(planetName) {
    const planet = await this.externalApiResource.get(`/?search=${planetName}`);
    const movies = planet.data.results.shift();
    return movies;
  }

  async getMoviesCount(planetName) {
    const cachedValue = this.cache.get(planetName);
    if (cachedValue) {
      return this.cache.get(planetName);
    }

    const movies = await this.getMovies(planetName);

    if (!movies) {
      return 0;
    }

    this.cache.set(planetName, movies.films.length);
    return movies.films.length;
  }
}
