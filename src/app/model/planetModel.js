import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import Planet from '../domain/planet';

const PlanetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  climate: String,
  terrain: String,
});

PlanetSchema.loadClass(Planet);
PlanetSchema.plugin(mongoosePaginate);
const PlanetModel = mongoose.model('Planet', PlanetSchema);

export default PlanetModel;
