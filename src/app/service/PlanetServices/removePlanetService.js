import { isValidObjectId } from 'mongoose';
import PlanetRepository from '../../repository/planetRepository';

class RemovePlanetService {
  constructor() {
    this.repository = new PlanetRepository();
  }

  async remove(searchTerm) {
    if (isValidObjectId(searchTerm)) {
      return this.repository.removeById(searchTerm);
    }
    return this.repository.removeByName(searchTerm);
  }
}

export default new RemovePlanetService();
