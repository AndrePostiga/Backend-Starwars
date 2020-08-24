/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import supertest from 'supertest';
import bootstrapApp from '../app';
import mockExternalServices from './mockExternalServices';

let request;
beforeAll(async () => {
  const app = await bootstrapApp();
  request = supertest(app);
});

beforeEach(async () => {
  mockExternalServices();
  await request.delete('/api/v1/planets/Test');
});

describe('E2E app test', () => {
  describe('Planet Controller', () => {
    describe('index endpoint', () => {
      const expected = [
        {
          _id: '5f42fd067ee9eb00564f9fcd',
          name: 'Alderaan',
          climate: 'temperate',
          terrain: 'grasslands, mountains',
        },
        {
          _id: '5f42fd0c7ee9eb00564f9fce',
          name: 'Yavin IV',
          climate: 'temperate, tropical',
          terrain: 'jungle, rainforests',
        },
        {
          _id: '5f42fd137ee9eb00564f9fcf',
          name: 'Tatooine',
          climate: 'temperate',
          terrain: 'jungle',
        },
      ];
      const expectedSorted = expected.map((e) => e.id).sort();
      it('Should response with json', async (done) => {
        const response = await request.get('/api/v1/planets');

        expect(response.header['content-type']).toBe(
          'application/json; charset=utf-8'
        );
        expect(response.status).toBe(200);

        done();
      });

      it('Should return all planets that were inserted with seed', async (done) => {
        const response = await request.get('/api/v1/planets');

        expect(response.status).toBe(200);

        expect(response.body.statusCode).toBe(200);
        expect(response.body.data.total).toBe(3);
        expect(response.body.data.limit).toBe(10);
        expect(response.body.data.page).toBe(1);
        expect(response.body.data.pages).toBe(1);
        expect(response.body.data.planet.map((e) => e.id).sort()).toEqual(
          expectedSorted
        );
        done();
      });

      it('Should throw error if string page number is passed', async (done) => {
        const response = await request.get('/api/v1/planets?page=asd');

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
          errors: 'Invalid request page is not a number',
        });

        done();
      });

      it('Should return planets if float page number is passed', async (done) => {
        const response = await request.get('/api/v1/planets?page=1.4');

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.data.total).toBe(3);
        expect(response.body.data.limit).toBe(10);
        expect(response.body.data.page).toBe(1);
        expect(response.body.data.pages).toBe(1);
        expect(response.body.data.planet.map((e) => e.id).sort()).toEqual(
          expectedSorted
        );
        done();
      });

      it('Should return empty if out of bounds page is passed', async (done) => {
        const response = await request.get('/api/v1/planets?page=999');

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          statusCode: 200,
          data: {
            total: 3,
            limit: 10,
            page: 999,
            pages: 1,
            planet: [],
          },
        });

        done();
      });
    });

    describe('indexBySearchTerm endpoint', () => {
      it('Should response with json', async (done) => {
        const response = await request.get('/api/v1/planets/Tatooine');

        expect(response.header['content-type']).toBe(
          'application/json; charset=utf-8'
        );
        expect(response.status).toBe(200);
        done();
      });

      it('Should return planet searched by name', async (done) => {
        const response = await request.get('/api/v1/planets/Tatooine');

        expect(response.header['content-type']).toBe(
          'application/json; charset=utf-8'
        );
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          statusCode: 200,
          data: {
            _id: '5f42fd137ee9eb00564f9fcf',
            name: 'Tatooine',
            climate: 'temperate',
            movies: 5,
            terrain: 'jungle',
          },
        });
        done();
      });

      it('Should return planet searched by id', async (done) => {
        const response = await request.get(
          '/api/v1/planets/5f42fd067ee9eb00564f9fcd'
        );

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          statusCode: 200,
          data: {
            _id: '5f42fd067ee9eb00564f9fcd',
            name: 'Alderaan',
            climate: 'temperate',
            movies: 2,
            terrain: 'grasslands, mountains',
          },
        });
        done();
      });

      it('Should return NotFoundError if searchedTerm does not exist', async (done) => {
        const response = await request.get('/api/v1/planets/AnyName');

        expect(response.header['content-type']).toBe(
          'application/json; charset=utf-8'
        );
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
          statusCode: 404,
          errors: 'Cannot found AnyName',
        });
        done();
      });
    });

    describe('add endpoint', () => {
      it('Should response with json', async (done) => {
        const response = await request.post('/api/v1/planets').send({
          name: 'Test',
          climate: 'AnyClimate',
          terrain: 'AnyTerrain',
        });
        expect(response.header['content-type']).toBe(
          'application/json; charset=utf-8'
        );
        expect(response.status).toBe(201);

        done();
      });

      it('Should create a planet and returns it', async (done) => {
        const response = await request.post('/api/v1/planets').send({
          name: 'Test',
          climate: 'AnyClimate',
          terrain: 'AnyTerrain',
        });

        delete response.body.data._id;

        expect(response.header['content-type']).toBe(
          'application/json; charset=utf-8'
        );
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          statusCode: 201,
          data: {
            __v: 0,
            climate: 'AnyClimate',
            name: 'Test',
            terrain: 'AnyTerrain',
          },
        });

        done();
      });

      it('Should throw badRequestError if name is not capitalized', async (done) => {
        const response = await request.post('/api/v1/planets').send({
          name: 'test',
          climate: 'AnyClimate',
          terrain: 'AnyTerrain',
        });

        expect(response.header['content-type']).toBe(
          'application/json; charset=utf-8'
        );
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
          errors:
            'Invalid request ValidationError: Every first letter should be capitalized',
        });

        done();
      });

      it('Should throw badRequestError if name is not passed', async (done) => {
        const response = await request.post('/api/v1/planets').send({
          climate: 'AnyClimate',
          terrain: 'AnyTerrain',
        });

        expect(response.header['content-type']).toBe(
          'application/json; charset=utf-8'
        );
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
          errors: 'Invalid request ValidationError: name is a required field',
        });

        done();
      });

      it('Should throw badRequestError if climate is not passed', async (done) => {
        const response = await request.post('/api/v1/planets').send({
          name: 'Test',
          terrain: 'AnyTerrain',
        });

        expect(response.header['content-type']).toBe(
          'application/json; charset=utf-8'
        );
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
          errors:
            'Invalid request ValidationError: climate is a required field',
        });

        done();
      });

      it('Should throw badRequestError if climate is not passed', async (done) => {
        const response = await request.post('/api/v1/planets').send({
          name: 'Test',
          climate: 'AnyClimate',
        });

        expect(response.header['content-type']).toBe(
          'application/json; charset=utf-8'
        );
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
          errors:
            'Invalid request ValidationError: terrain is a required field',
        });

        done();
      });

      it('Should throw conflict error if data already exists', async (done) => {
        const response = await request.post('/api/v1/planets').send({
          name: 'Tatooine',
          climate: 'AnyClimate',
          terrain: 'AnyTerrain',
        });

        expect(response.header['content-type']).toBe(
          'application/json; charset=utf-8'
        );
        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
          statusCode: 409,
          errors: 'Invalid request planet Tatooine already exists',
        });

        done();
      });
    });

    describe('Remove endpoint', () => {
      describe('Removing test', () => {
        beforeEach(async () => {
          await request.post('/api/v1/planets').send({
            name: 'Test',
            climate: 'AnyClimate',
            terrain: 'AnyTerrain',
          });
        });

        it('Should return the planet that was removed by name', async (done) => {
          const response = await request.delete('/api/v1/planets/Test');

          expect(response.header['content-type']).toBe(
            'application/json; charset=utf-8'
          );
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject({
            statusCode: 200,
            data: {
              __v: 0,
              climate: 'AnyClimate',
              name: 'Test',
              terrain: 'AnyTerrain',
            },
          });

          done();
        });
      });

      describe('Error test', () => {
        it('Should return not found if data is not on the database', async (done) => {
          const response = await request.delete('/api/v1/planets/AnyName');

          expect(response.header['content-type']).toBe(
            'application/json; charset=utf-8'
          );
          expect(response.status).toBe(404);
          expect(response.body).toMatchObject({
            statusCode: 404,
            errors: 'Cannot found AnyName',
          });

          done();
        });

        it('Should return not found if id is not on the database', async (done) => {
          const response = await request.delete(
            '/api/v1/planets/507f1f77bcf86cd799439011'
          );

          expect(response.header['content-type']).toBe(
            'application/json; charset=utf-8'
          );
          expect(response.status).toBe(404);
          expect(response.body).toMatchObject({
            statusCode: 404,
            errors: 'Cannot found 507f1f77bcf86cd799439011',
          });

          done();
        });
      });
    });
  });
});
