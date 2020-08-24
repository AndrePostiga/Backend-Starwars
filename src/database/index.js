/* eslint-disable no-console */
import mongoose from 'mongoose';

export async function initDb() {
  const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

  mongoose.connect(
    `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  mongoose.Promise = global.Promise;

  mongoose.set('useCreateIndex', true);

  // mongoose.connection.on('error', () => console.error('connection error:'));
  // mongoose.connection.once('open', () => console.log('database connected'));
}
