/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
import { FindMovieService } from './findMovieService';
import { ServerError } from '../../errors';

const makeMovieRepository = () => {
  class MovieRepositoryStub {
    getMoviesCount() {
      return 5;
    }
  }

  return new MovieRepositoryStub();
};

const makeSut = () => {
  const movieRepositoryStub = makeMovieRepository();
  const sut = new FindMovieService(movieRepositoryStub);
  return {
    sut,
    movieRepositoryStub,
  };
};

describe('FindMovieService', () => {
  describe('getMoviesCount', () => {
    it('Should return a number', async () => {
      const { sut } = makeSut();

      const act = await sut.getMoviesCount('AnyPlanet');

      expect(typeof act).toBe('number');
    });

    it('Should throw error if moviesRepository throws', () => {
      const { sut, movieRepositoryStub } = makeSut();
      jest
        .spyOn(movieRepositoryStub, 'getMoviesCount')
        .mockImplementationOnce(() => {
          throw new Error('AnyError');
        });

      const act = () => sut.getMoviesCount('AnyName');

      expect(act).rejects.toThrow(new Error('AnyError'));
    });

    it('Should throw error if movies count less than zero', () => {
      const { sut, movieRepositoryStub } = makeSut();
      jest
        .spyOn(movieRepositoryStub, 'getMoviesCount')
        .mockImplementationOnce(() => {
          return -1;
        });

      const act = () => sut.getMoviesCount('AnyName');

      expect(act).rejects.toThrow(new ServerError());
    });

    it('Should throw error if moviesCount is not a number', () => {
      const { sut, movieRepositoryStub } = makeSut();
      jest
        .spyOn(movieRepositoryStub, 'getMoviesCount')
        .mockImplementationOnce(() => {
          return 'AnyString';
        });

      const act = () => sut.getMoviesCount('AnyName');

      expect(act).rejects.toThrow(new ServerError());
    });
  });

  describe('getPlanetWithMoviesCount', () => {
    it('Should return planet with moviesCount', async () => {
      const { sut } = makeSut();
      class PlanetModelStub {
        toObject() {
          return {
            _id: '5f40470f337d7b002a10d865',
            name: 'AnyPlanet',
            climate: 'AnyClimate',
            terrain: 'AnyTerrain',
            __v: 0,
          };
        }
      }
      const act = await sut.getPlanetWithMoviesCount(new PlanetModelStub());

      expect(act).toStrictEqual({
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
        movies: 5,
      });
    });

    it('Should throw error if getMoviesCount throws', () => {
      const { sut } = makeSut();
      jest.spyOn(sut, 'getMoviesCount').mockImplementationOnce(() => {
        throw new Error('AnyError');
      });

      const act = () => sut.getPlanetWithMoviesCount('AnyName');

      expect(act).rejects.toThrow(new Error('AnyError'));
    });
  });
});
