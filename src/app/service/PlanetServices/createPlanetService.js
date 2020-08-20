import * as Yup from 'yup';
import PlanetRepository from '../../repository/planetRepository';
import { ConflictError, NotFoundError, BadRequestError } from '../../errors';

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

  // se passar na validacao ele procura na base
  // se achar ele retorna falso
  // se nao encontrar ele estoura o erro do notfound e retorna verdadeiro
  // caso de erro na requisicao ele retorna badrequest
  async isInDatabase(data) {
    try {
      await this.repository.findByName(data.name);
      return true;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return false;
      }
      throw error;
    }
  }

  async isValidForCreation(data) {
    try {
      await CREATE_VALIDATION_SCHEMA.validate(data, { abortEarly: false });
      return true;
    } catch (error) {
      throw new BadRequestError(error);
    }
  }

  async create(data) {
    await this.isValidForCreation(data);
    const isInDatabase = await this.isInDatabase(data);

    if (isInDatabase) {
      throw new ConflictError(`planet ${data.name} already exists`);
    }

    return this.repository.create(data);
  }
}

export default new CreatePlanetService();
