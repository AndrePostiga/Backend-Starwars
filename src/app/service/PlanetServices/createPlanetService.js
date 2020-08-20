import * as Yup from 'yup';
import PlanetRepository from '../../repository/planetRepository';
import { ConflictError, NotFoundError } from '../../errors';

const CREATE_VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string()
    .required()
    .matches(/^(\b[A-Z]\w*\s*)+$/, 'Every first letter should be capitalized')
    .typeError('Name must be a string'),
  climate: Yup.string().required().typeError('Climate must be a string'),
  terrain: Yup.string().required().typeError('Terrain must be a string'),
});

class CreatePlanetService {
  constructor() {
    this.repository = new PlanetRepository();
  }

  async create(data) {
    try {
      await CREATE_VALIDATION_SCHEMA.validate(data, { abortEarly: false });
      const planet = await this.repository.findByName(data.name);
      if (planet) {
        throw new ConflictError(`Planet ${planet.name} already exists`);
      }
      return null;
    } catch (err) {
      if (!(err instanceof NotFoundError)) {
        throw err;
      }
      return this.repository.create(data);
    }
  }
}

export default new CreatePlanetService();
