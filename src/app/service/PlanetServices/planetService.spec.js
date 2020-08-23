/* eslint-disable no-undef */
/* eslint-disable max-classes-per-file */
import { BadRequestError, ConflictError, NotFoundError } from '../../errors';
import {
  CreatePlanetService,
  FindPlanetService,
  RemovePlanetService,
} from './index';

const makePlanetRepository = () => {
  class PlanetRepositoryStub {
    removeById() {
      return {
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      };
    }

    removeByName() {
      return {
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      };
    }

    create() {
      return {
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      };
    }

    findByName() {
      return {
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      };
    }

    findById() {
      return {
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      };
    }

    findAll() {
      return {
        docs: [
          {
            _id: '5f4046ed337d7b002a10d864',
            name: 'Tatooine',
            climate: 'Desertico',
            terrain: 'cerrado',
            __v: 0,
          },
          {
            _id: '5f40470f337d7b002a10d865',
            name: 'Naboo',
            climate: 'Desertico',
            terrain: 'cerrado',
            __v: 0,
          },
          {
            _id: '5f404723337d7b002a10d866',
            name: 'Alderaan',
            climate: 'Desertico',
            terrain: 'cerrado',
            __v: 0,
          },
          {
            _id: '5f4089a23adf5b0306b1ae28',
            name: 'Andre IIV',
            climate: 'Desertico',
            terrain: 'cerrado',
            __v: 0,
          },
        ],
        total: 4,
        limit: 10,
        page: 1,
        pages: 1,
      };
    }
  }
  return new PlanetRepositoryStub();
};

const makeMovieServiceStub = () => {
  class FindMovieServiceStub {
    async getPlanetWithMoviesCount(planet) {
      return {
        ...planet,
        movies: 5,
      };
    }
  }
  return new FindMovieServiceStub();
};

const makeSut = () => {
  const planetRepositoryStub = makePlanetRepository();
  const movieServiceStub = makeMovieServiceStub();
  const createSut = new CreatePlanetService(planetRepositoryStub);
  const findSut = new FindPlanetService(planetRepositoryStub, movieServiceStub);
  const removeSut = new RemovePlanetService(planetRepositoryStub);
  return {
    createSut,
    findSut,
    removeSut,
    planetRepositoryStub,
    movieServiceStub,
  };
};

describe('PlanetService', () => {
  describe('removePlanetService', () => {
    it('Should return planet that was removedByName', async () => {
      const { removeSut } = makeSut();

      const act = await removeSut.remove('AnyPlanet');

      expect(act).toStrictEqual({
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      });
    });

    it('Should return planet that was removedById', async () => {
      const { removeSut } = makeSut();

      const act = await removeSut.remove('5f40470f337d7b002a10d865');

      expect(act).toStrictEqual({
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      });
    });

    it('Should throw BadRequest error if id is invalid', () => {
      const { removeSut, planetRepositoryStub } = makeSut();
      jest
        .spyOn(planetRepositoryStub, 'removeById')
        .mockImplementationOnce(() => {
          throw new BadRequestError('id is not an valid objectId');
        });

      const act = () => removeSut.remove('5f40470f337d7b002a10d865');

      expect(act).rejects.toThrowError(
        new BadRequestError('id is not an valid objectId')
      );
    });

    it('Should throw if removeById throws ', () => {
      const { removeSut, planetRepositoryStub } = makeSut();
      jest
        .spyOn(planetRepositoryStub, 'removeById')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      const act = () => removeSut.remove('5f40470f337d7b002a10d865');

      expect(act).rejects.toThrowError(new Error());
    });
  });

  describe('createPlanetService', () => {
    it('Should create planet', async () => {
      const { createSut } = makeSut();
      jest.spyOn(createSut, 'isInDatabase').mockReturnValueOnce(false);

      const act = await createSut.create({
        name: 'AnyName',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
      });

      expect(act).toStrictEqual({
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      });
    });

    it('Should throw conflict error if data already exists', () => {
      const { createSut } = makeSut();
      jest.spyOn(createSut, 'isInDatabase').mockReturnValueOnce(true);

      const act = () =>
        createSut.create({
          name: 'AnyName',
          climate: 'AnyClimate',
          terrain: 'AnyTerrain',
        });

      expect(act).rejects.toThrowError(
        new ConflictError(`planet AnyName already exists`)
      );
    });

    it('Should return BadRequest error if name is invalid', () => {
      const { createSut } = makeSut();
      jest.spyOn(createSut, 'isInDatabase').mockReturnValueOnce(false);

      const act = () =>
        createSut.isValidForCreation({
          name: 'anyName',
          climate: 'AnyClimate',
          terrain: 'AnyTerrain',
        });

      expect(act).rejects.toThrowError(
        new BadRequestError(
          'ValidationError: Every first letter should be capitalized'
        )
      );
    });

    it('Should return BadRequest error if name is not passed', () => {
      const { createSut } = makeSut();
      jest.spyOn(createSut, 'isInDatabase').mockReturnValueOnce(false);

      const act = () =>
        createSut.isValidForCreation({
          climate: 'AnyClimate',
          terrain: 'AnyTerrain',
        });

      expect(act).rejects.toThrowError(
        new BadRequestError('ValidationError: name is a required field')
      );
    });

    it('Should return BadRequest error if climate is not passed', () => {
      const { createSut } = makeSut();
      jest.spyOn(createSut, 'isInDatabase').mockReturnValueOnce(false);

      const act = () =>
        createSut.isValidForCreation({
          name: 'AnyName',
          terrain: 'AnyTerrain',
        });

      expect(act).rejects.toThrowError(
        new BadRequestError('ValidationError: climate is a required field')
      );
    });

    it('Should return BadRequest error if terrain is not passed', () => {
      const { createSut } = makeSut();
      jest.spyOn(createSut, 'isInDatabase').mockReturnValueOnce(false);

      const act = () =>
        createSut.isValidForCreation({
          name: 'AnyName',
          climate: 'AnyClimate',
        });

      expect(act).rejects.toThrowError(
        new BadRequestError('ValidationError: terrain is a required field')
      );
    });

    it("Should return true if planetRepository doesn't throw error", async () => {
      const { createSut } = makeSut();

      const act = await createSut.isInDatabase('AnyData');

      expect(act).toBe(true);
    });

    it("Should return false if planetRepository doesn't in database", async () => {
      const { createSut, planetRepositoryStub } = makeSut();
      jest
        .spyOn(planetRepositoryStub, 'findByName')
        .mockImplementationOnce(() => {
          throw new NotFoundError();
        });

      const act = await createSut.isInDatabase('AnyData');

      expect(act).toBe(false);
    });

    it('Should throw if isInDatabase throws', () => {
      const { createSut, planetRepositoryStub } = makeSut();
      jest
        .spyOn(planetRepositoryStub, 'findByName')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      const act = () => createSut.isInDatabase('AnyData');

      expect(act).rejects.toThrowError(new Error());
    });
  });

  describe('findPlanetService', () => {
    it('Should throws BadRequestError if page is not integer', () => {
      const { findSut } = makeSut();

      const act = () => findSut.isValidPageNumber('asd');

      expect(act).toThrowError(new BadRequestError(`page is not a number`));
    });

    it('Should throws BadRequestError if page is not integer', () => {
      const { findSut } = makeSut();

      const act = () => findSut.isValidPageNumber(NaN);

      expect(act).toThrowError(new BadRequestError(`page is not a number`));
    });

    it('Should return page number if a correct number is passed', () => {
      const { findSut } = makeSut();

      const act = findSut.isValidPageNumber(1);

      expect(act).toBe(1);
    });

    it('Should return planets with pagination and movies', async () => {
      const { findSut } = makeSut();

      const act = await findSut.findAll(1);

      expect(act).toStrictEqual({
        total: 4,
        limit: 10,
        page: 1,
        pages: 1,
        planet: [
          {
            _id: '5f4046ed337d7b002a10d864',
            name: 'Tatooine',
            climate: 'Desertico',
            terrain: 'cerrado',
            __v: 0,
            movies: 5,
          },
          {
            _id: '5f40470f337d7b002a10d865',
            name: 'Naboo',
            climate: 'Desertico',
            terrain: 'cerrado',
            __v: 0,
            movies: 5,
          },
          {
            _id: '5f404723337d7b002a10d866',
            name: 'Alderaan',
            climate: 'Desertico',
            terrain: 'cerrado',
            __v: 0,
            movies: 5,
          },
          {
            _id: '5f4089a23adf5b0306b1ae28',
            name: 'Andre IIV',
            climate: 'Desertico',
            terrain: 'cerrado',
            __v: 0,
            movies: 5,
          },
        ],
      });
    });

    it('Should return one planet with movies founded by id', async () => {
      const { findSut } = makeSut();

      const act = await findSut.find('5f40470f337d7b002a10d865');

      expect(act).toStrictEqual({
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
        movies: 5,
      });
    });

    it('Should return one planet with movies founded by name', async () => {
      const { findSut } = makeSut();

      const act = await findSut.find('AnyPlanet');

      expect(act).toStrictEqual({
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
        movies: 5,
      });
    });

    it('Should throw error if repository throws', () => {
      const { findSut, planetRepositoryStub } = makeSut();
      jest
        .spyOn(planetRepositoryStub, 'findById')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      const act = () => findSut.find('5f40470f337d7b002a10d865');

      expect(act).rejects.toThrowError(new Error());
    });

    it('Should throw error if repository throws', () => {
      const { findSut, planetRepositoryStub } = makeSut();
      jest
        .spyOn(planetRepositoryStub, 'findByName')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      const act = () => findSut.find('AnyName');

      expect(act).rejects.toThrowError(new Error());
    });
  });
});
