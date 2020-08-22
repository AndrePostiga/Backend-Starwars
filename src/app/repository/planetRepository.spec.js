/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { PlanetRepository } from './planetRepository';
import { ServerError, NotFoundError, BadRequestError } from '../errors';

const makePlanetModelStub = () => {
  class PlanetModelStub {
    paginate() {
      const fakeResponse = {
        docs: [
          {
            _id: '5f4046ed337d7b002a10d864',
            name: 'AnyPlanet',
            climate: 'AnyClimate',
            terrain: 'AnyTerrain',
            __v: 0,
          },
          {
            _id: '5f40470f337d7b002a10d865',
            name: 'AnyPlanet2',
            climate: 'AnyClimate',
            terrain: 'AnyTerrain',
            __v: 0,
          },
          {
            _id: '5f404723337d7b002a10d866',
            name: 'AnyPlanet3',
            climate: 'AnyClimate',
            terrain: 'AnyTerrain',
            __v: 0,
          },
          {
            _id: '5f4089a23adf5b0306b1ae28',
            name: 'AnyPlanet4',
            climate: 'AnyClimate',
            terrain: 'AnyTerrain',
            __v: 0,
          },
        ],
        total: 4,
        limit: 10,
        page: 1,
        pages: 1,
      };

      return fakeResponse;
    }

    findOne(options) {
      const response = {
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      };
      return response;
    }

    findById(id) {
      const response = {
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      };
      return response;
    }

    create(data) {
      const response = {
        _id: '5f413021e3d370041ca6d637',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      };
      return response;
    }

    deleteOne({ name }) {
      const response = { n: 1, ok: 1, deletedCount: 1 };
      return response;
    }
  }

  return new PlanetModelStub();
};

const makeSut = () => {
  const planetModelStub = makePlanetModelStub();
  const sut = new PlanetRepository(planetModelStub);
  return {
    sut,
    planetModelStub,
  };
};

describe('Planet repository', () => {
  describe('findAll', () => {
    it('Should return planets with page information', async () => {
      const { sut } = makeSut();

      const planets = await sut.findAll(1);

      expect(planets).toStrictEqual({
        docs: [
          {
            _id: '5f4046ed337d7b002a10d864',
            name: 'AnyPlanet',
            climate: 'AnyClimate',
            terrain: 'AnyTerrain',
            __v: 0,
          },
          {
            _id: '5f40470f337d7b002a10d865',
            name: 'AnyPlanet2',
            climate: 'AnyClimate',
            terrain: 'AnyTerrain',
            __v: 0,
          },
          {
            _id: '5f404723337d7b002a10d866',
            name: 'AnyPlanet3',
            climate: 'AnyClimate',
            terrain: 'AnyTerrain',
            __v: 0,
          },
          {
            _id: '5f4089a23adf5b0306b1ae28',
            name: 'AnyPlanet4',
            climate: 'AnyClimate',
            terrain: 'AnyTerrain',
            __v: 0,
          },
        ],
        total: 4,
        limit: 10,
        page: 1,
        pages: 1,
      });
    });

    it('Should return correct planet count', async () => {
      const { sut } = makeSut();

      const planets = await sut.findAll(1);
      const items = planets.docs.length;
      const { total, page } = planets;

      expect(items).toBe(4);
      expect(total).toBe(4);
      expect(page).toBe(1);
    });

    it('Should throw error if model throws', () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'paginate').mockImplementationOnce(() => {
        throw new Error('AnyError');
      });

      const act = () => sut.findAll(1);

      expect(act).rejects.toThrow(new Error('AnyError'));
    });

    it('Should throw error if model.paginate returns null', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'paginate').mockImplementationOnce(() => {
        return null;
      });

      const act = () => sut.findAll(1);

      expect(act).rejects.toThrow(new ServerError());
    });

    it('Should throw error if model returns undefined', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'paginate').mockImplementationOnce(() => {
        return undefined;
      });

      const act = () => sut.findAll(1);

      expect(act).rejects.toThrow(new ServerError());
    });
  });

  describe('findByName', () => {
    it('Should return planet if name were given', async () => {
      const { sut } = makeSut();

      const act = await sut.findByName('AnyName');

      expect(act).toStrictEqual({
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      });
    });

    it('Should throw error if model.findone throws', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'findOne').mockImplementationOnce(() => {
        throw new Error();
      });

      const act = () => sut.findByName('AnyName');

      expect(act).rejects.toThrow(new Error());
    });

    it('Should throw NotFoundError if model.findone return null', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'findOne').mockImplementationOnce(() => {
        return null;
      });

      const act = () => sut.findByName('AnyName');

      expect(act).rejects.toThrow(new NotFoundError('AnyName'));
    });

    it('Should throw NotFoundError if model.findone return undefined', () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'findOne').mockImplementationOnce(() => {
        return undefined;
      });

      const act = () => sut.findByName('AnyName');

      expect(act).rejects.toThrowError(new NotFoundError('AnyName'));
    });
  });

  describe('findById', () => {
    it('Should return planet id name were given', async () => {
      const { sut } = makeSut();

      const act = await sut.findById('5f40470f337d7b002a10d865');

      expect(act).toStrictEqual({
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      });
    });

    it('Should throw BadRequestError if invalid id was passed', () => {
      const { sut, planetModelStub } = makeSut();

      const act = () => sut.findById('AnyId');

      expect(act).rejects.toThrowError(
        new BadRequestError('id is not an valid objectId')
      );
    });

    it('Should throw error if model.findById throws', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'findById').mockImplementationOnce(() => {
        throw new Error();
      });

      const act = () => sut.findById('5f40470f337d7b002a10d865');

      expect(act).rejects.toThrow(new Error());
    });

    it('Should throw error if model returns null', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'findById').mockImplementationOnce(() => {
        return null;
      });

      const act = () => sut.findById('5f40470f337d7b002a10d865');

      expect(act).rejects.toThrow(
        new NotFoundError('5f40470f337d7b002a10d865')
      );
    });

    it('Should throw error if model returns undefined', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'findById').mockImplementationOnce(() => {
        return undefined;
      });

      const act = () => sut.findById('5f40470f337d7b002a10d865');

      expect(act).rejects.toThrow(
        new NotFoundError('5f40470f337d7b002a10d865')
      );
    });
  });

  describe('create', () => {
    it('Should return planet with id', async () => {
      const { sut } = makeSut();

      const act = await sut.create({
        name: 'AnyName',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
      });

      expect(act).toStrictEqual({
        _id: '5f413021e3d370041ca6d637',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      });
    });

    it('Should throw error if model.create throws', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'create').mockImplementationOnce(() => {
        throw new Error();
      });

      const act = () =>
        sut.create({
          name: 'AnyName',
          climate: 'AnyClimate',
          terrain: 'AnyTerrain',
        });

      expect(act).rejects.toThrow(new Error());
    });

    it('Should throw error if model returns null', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'create').mockImplementationOnce(() => {
        return null;
      });

      const act = () =>
        sut.create({
          name: 'AnyName',
          climate: 'AnyClimate',
          terrain: 'AnyTerrain',
        });

      expect(act).rejects.toThrow(new ServerError());
    });

    it('Should throw error if model returns undefined', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'create').mockImplementationOnce(() => {
        return undefined;
      });

      const act = () =>
        sut.create({
          name: 'AnyName',
          climate: 'AnyClimate',
          terrain: 'AnyTerrain',
        });

      expect(act).rejects.toThrow(new ServerError());
    });
  });

  describe('removeByID', () => {
    it('Should return planet after delete', async () => {
      const { sut } = makeSut();

      const act = await sut.removeById('5f40470f337d7b002a10d865');

      expect(act).toStrictEqual({
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      });
    });

    it('Should throw BadRequestError if invalid id was passed', () => {
      const { sut } = makeSut();

      const act = () => sut.removeById('AnyId');

      expect(act).rejects.toThrowError(
        new BadRequestError('id is not an valid objectId')
      );
    });

    it('Should throw NotFoundError if cannot find planet to delete', () => {
      const { sut } = makeSut();
      jest.spyOn(sut, 'findById').mockImplementationOnce(() => {
        throw new NotFoundError('AnyId');
      });

      const act = () => sut.removeById('AnyId');

      expect(act).rejects.toThrowError(new NotFoundError('AnyId'));
    });

    it('Should throw error if model.deleteOne throws', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'deleteOne').mockImplementationOnce(() => {
        throw new Error();
      });

      const act = () => sut.removeById('5f40470f337d7b002a10d865');

      expect(act).rejects.toThrowError(new Error());
    });

    it('Should throw error if model.deleteOne return null', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'deleteOne').mockImplementationOnce(() => {
        return null;
      });

      const act = () => sut.removeById('5f40470f337d7b002a10d865');

      expect(act).rejects.toThrowError(new ServerError());
    });

    it('Should throw error if model.deleteOne return undefined', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'deleteOne').mockImplementationOnce(() => {
        return undefined;
      });

      const act = () => sut.removeById('5f40470f337d7b002a10d865');

      expect(act).rejects.toThrow(new ServerError());
    });
  });

  describe('removeByName', () => {
    it('Should return planet after delete', async () => {
      const { sut } = makeSut();

      const act = await sut.removeByName('AnyPlanet');

      expect(act).toStrictEqual({
        _id: '5f40470f337d7b002a10d865',
        name: 'AnyPlanet',
        climate: 'AnyClimate',
        terrain: 'AnyTerrain',
        __v: 0,
      });
    });

    it('Should throw NotFoundError if cannot find planet to delete', () => {
      const { sut } = makeSut();
      jest.spyOn(sut, 'findByName').mockImplementationOnce(() => {
        throw new NotFoundError('AnyName');
      });

      const act = () => sut.removeByName('AnyName');

      expect(act).rejects.toThrowError(new NotFoundError('AnyName'));
    });

    it('Should throw error if model.deleteOne throws', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'deleteOne').mockImplementationOnce(() => {
        throw new Error();
      });

      const act = () => sut.removeByName('AnyName');

      expect(act).rejects.toThrow(new Error());
    });

    it('Should throw error if model.deleteOne return null', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'deleteOne').mockImplementationOnce(() => {
        return null;
      });

      const act = () => sut.removeByName('AnyName');

      expect(act).rejects.toThrowError(new ServerError());
    });

    it('Should throw error if model.deleteOne return undefined', async () => {
      const { sut, planetModelStub } = makeSut();
      jest.spyOn(planetModelStub, 'deleteOne').mockImplementationOnce(() => {
        return undefined;
      });

      const act = () => sut.removeByName('AnyName');

      expect(act).rejects.toThrowError(new ServerError());
    });
  });
});
