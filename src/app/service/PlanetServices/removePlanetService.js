import { isValidObjectId } from 'mongoose';

export class RemovePlanetService {
  constructor(planetRepository) {
    this.planetRepository = planetRepository;
  }

  async remove(searchTerm) {
    if (isValidObjectId(searchTerm)) {
      return this.planetRepository.removeById(searchTerm);
    }
    return this.planetRepository.removeByName(searchTerm);
  }
}
