/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import axios from 'axios';
import { MoviesRepository } from './moviesRepository';

const swapiPlanetResource = axios.create({
  baseURL: 'https://swapi.dev/api/planets',
});

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
  const externalApiStub = makeExternalApiResource();
  const sut = new MoviesRepository(externalApiStub);
  return {
    sut,
    externalApiStub,
  };
};

describe('Movies Repository', () => {
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
