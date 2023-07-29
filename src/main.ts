import { Application } from './application/application';

const application = Application.create();
application.initialize().catch((exception: unknown) => {
  console.error(exception)
  process.exit(1)
});

// Keeps process alive
setInterval(function () {}, 1000 * 60);
