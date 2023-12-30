const ticketController = require('../controllers/ticket.controller');
const auth = require('../middlewares/auth.middleware');
const ticketValidator = require('../middlewares/ticket.middleware');

module.exports = function (app) {
    app.post('/crm/api/v1/tickets', [auth.verifyToken, ticketValidator.validateTicketReqBody], ticketController.createTicket);
}