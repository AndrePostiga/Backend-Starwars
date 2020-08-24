/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { MoviesRepository } from './moviesRepository';

const makeCacheStub = () => {
  class CacheStub {
    get(name) {
      return undefined;
    }

    set(name) {
      return undefined;
    }
  }

  return new CacheStub();
};

const makeExternalApiResource = () => {
  class ExternalApiStub {
    get(fakeEndpoint) {
      const fakeResponse = {
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              name: 'Yavin IV',
              rotation_period: '24',
              orbital_period: '4818',
              diameter: '10200',
              climate: 'temperate, tropical',
              gravity: '1 standard',
              terrain: 'jungle, rainforests',
              surface_water: '8',
              population: '1000',
              residents: [],
              films: ['http://swapi.dev/api/films/1/'],
              created: '2014-12-10T11:37:19.144000Z',
              edited: '2014-12-20T20:58:18.421000Z',
              url: 'http://swapi.dev/api/planets/3/',
            },
          ],
        },
      };

      return fakeResponse;
    }
  }

  return new ExternalApiStub();
};

const makeSut = () => {
  const cacheStub = makeCacheStub();
  const externalApiStub = makeExternalApiResource();
  const sut = new MoviesRepository(externalApiStub, cacheStub);
  return {
    sut,
    externalApiStub,
    cacheStub,
  };
};

describe('Movies Repository', () => {
  describe('getMovies', () => {
    it('Should get movies by name', async () => {
      // Arrange
      const { sut } = makeSut();

      // act
      const act = await sut.getMovies('Yavin IV');

      // assert
      expect(act).toStrictEqual({
        name: 'Yavin IV',
        rotation_period: '24',
        orbital_period: '4818',
        diameter: '10200',
        climate: 'temperate, tropical',
        gravity: '1 standard',
        terrain: 'jungle, rainforests',
        surface_water: '8',
        population: '1000',
        residents: [],
        films: ['http://swapi.dev/api/films/1/'],
        created: '2014-12-10T11:37:19.144000Z',
        edited: '2014-12-20T20:58:18.421000Z',
        url: 'http://swapi.dev/api/planets/3/',
      });
    });

    it('Should throw error if response breaks', () => {
      const { sut, externalApiStub } = makeSut();
      jest.spyOn(externalApiStub, 'get').mockImplementationOnce(() => {
        throw new Error('AnyError');
      });

      const act = () => sut.getMovies('AnyMovie');

      expect(act).rejects.toThrow(new Error('AnyError'));
    });

    it('Should return undefined if no data returns from external service ', async () => {
      const { sut, externalApiStub } = makeSut();
      jest.spyOn(externalApiStub, 'get').mockImplementationOnce(() => {
        return { data: { count: 0, next: null, previous: null, results: [] } };
      });

      const act = await sut.getMovies('AnyMovie');

      expect(act).toBe(undefined);
    });

    it('Should call getMovies with right planet name', async () => {
      const { sut, externalApiStub } = makeSut();
      const spyGetMovies = jest.spyOn(sut, 'getMovies');

      const act = await sut.getMovies('anyPlanetName');

      expect(spyGetMovies).toHaveBeenCalledWith('anyPlanetName');
    });
  });

  describe('getMoviesCount', () => {
    it('Should count movies correctly', async () => {
      const { sut } = makeSut();

      const act = await sut.getMoviesCount('Yavin IV');

      expect(act).toBe(1);
    });

    it('Should return zero if getMovies return undefined', async () => {
      const { sut } = makeSut();
      jest.spyOn(sut, 'getMovies').mockImplementationOnce(() => {
        return undefined;
      });

      const act = await sut.getMoviesCount('AnyMovie');

      expect(act).toBe(0);
    });

    it('Should return zero if getMovies return null', async () => {
      const { sut } = makeSut();
      jest.spyOn(sut, 'getMovies').mockImplementationOnce(() => {
        return null;
      });

      const act = await sut.getMoviesCount('AnyMovie');

      expect(act).toBe(0);
    });

    it('Should throw error if getMovies return error', () => {
      const { sut } = makeSut();
      jest.spyOn(sut, 'getMovies').mockImplementationOnce(() => {
        throw new Error('AnyError');
      });

      const act = () => sut.getMoviesCount('AnyMovie');

      expect(act).rejects.toThrow(new Error('AnyError'));
    });
  });

  describe('Test Cache', () => {
    it('Should return correct value if name is cached', async () => {
      const { sut, cacheStub } = makeSut();
      jest.spyOn(cacheStub, 'get').mockReturnValue(10);

      const act = await sut.getMoviesCount('AnyName');

      expect(act).toBe(10);
    });

    it('Should return correct value if name is not cached', async () => {
      const { sut, cacheStub } = makeSut();

      const act = await sut.getMoviesCount('AnyName');

      expect(act).toBe(1);
    });
  });
});
