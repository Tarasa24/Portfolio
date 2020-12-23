const gitSync = require('./routes/gitSync.js');
const contact = require('./routes/contact.js');

module.exports = (app) => {
   app.get('/gitSync', gitSync);
   app.post('/contact', contact);

   return app; 
};
