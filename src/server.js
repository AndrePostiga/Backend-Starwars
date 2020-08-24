import bootstrapApp from './app';

bootstrapApp().then((app) => {
  app.listen(process.env.SERVER_PORT, '0.0.0.0');
});
