module.exports = function(app) {
  app.get('/manage-service', function(req, res) {
    const servicesJson = require('../../resources/services');
    res.render('pages/serviceManager', {
      services: servicesJson['services']
    });
  });

  app.post('/service/remove', function(req, res) {
    console.log("This is req body", Object.keys(req.body));
  });
};

// function removeService(servicesObject) {
//
// }
