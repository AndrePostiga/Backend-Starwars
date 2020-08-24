import nock from 'nock';

export default function swapiMock() {
  const Tatooine = {
    count: 1,
    next: null,
    previous: null,
    results: [
      {
        name: 'Tatooine',
        rotation_period: '23',
        orbital_period: '304',
        diameter: '10465',
        climate: 'arid',
        gravity: '1 standard',
        terrain: 'desert',
        surface_water: '1',
        population: '200000',
        residents: [
          'http://swapi.dev/api/people/1/',
          'http://swapi.dev/api/people/2/',
          'http://swapi.dev/api/people/4/',
          'http://swapi.dev/api/people/6/',
          'http://swapi.dev/api/people/7/',
          'http://swapi.dev/api/people/8/',
          'http://swapi.dev/api/people/9/',
          'http://swapi.dev/api/people/11/',
          'http://swapi.dev/api/people/43/',
          'http://swapi.dev/api/people/62/',
        ],
        films: [
          'http://swapi.dev/api/films/1/',
          'http://swapi.dev/api/films/3/',
          'http://swapi.dev/api/films/4/',
          'http://swapi.dev/api/films/5/',
          'http://swapi.dev/api/films/6/',
        ],
        created: '2014-12-09T13:50:49.641000Z',
        edited: '2014-12-20T20:58:18.411000Z',
        url: 'http://swapi.dev/api/planets/1/',
      },
    ],
  };
  const Alderann = {
    count: 1,
    next: null,
    previous: null,
    results: [
      {
        name: 'Alderaan',
        rotation_period: '24',
        orbital_period: '364',
        diameter: '12500',
        climate: 'temperate',
        gravity: '1 standard',
        terrain: 'grasslands, mountains',
        surface_water: '40',
        population: '2000000000',
        residents: [
          'http://swapi.dev/api/people/5/',
          'http://swapi.dev/api/people/68/',
          'http://swapi.dev/api/people/81/',
        ],
        films: [
          'http://swapi.dev/api/films/1/',
          'http://swapi.dev/api/films/6/',
        ],
        created: '2014-12-10T11:35:48.479000Z',
        edited: '2014-12-20T20:58:18.420000Z',
        url: 'http://swapi.dev/api/planets/2/',
      },
    ],
  };
  const Yavin = {
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
  };

  nock('https://swapi.dev/api/planets')
    .get('/')
    .query({ search: 'Tatooine' })
    .reply(200, Tatooine);

  nock('https://swapi.dev/api/planets')
    .get('/')
    .query({ search: 'Alderaan' })
    .reply(200, Alderann);

  nock('https://swapi.dev/api/planets')
    .get('/')
    .query({ search: 'Yavin IV' })
    .reply(200, Yavin);
}
