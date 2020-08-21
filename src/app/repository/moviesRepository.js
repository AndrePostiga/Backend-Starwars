import axios from 'axios';

class MoviesRepository {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://swapi.dev/api/planets',
    });
  }

  async getMoviesCount(planetName) {
    const response = await this.api.get(`/?search=${planetName}`);
    const movies = response.data.results.shift();

    if (!movies) {
      return 0;
    }

    return movies.films.length;
  }
}

export default MoviesRepository;
