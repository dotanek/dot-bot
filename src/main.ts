import { Application } from './application/application';

const application = Application.create();
application.initialize().catch();

// Keeps process alive
setInterval(function () {}, 1000 * 60);
