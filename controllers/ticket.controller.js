const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

exports.createTicket = async (req, res) => {
  const ticketObj = {
    title: req.body.title,
    description: req.body.description,
    ticketPriority: req.body.ticketPriority,
    status: req.body.status,
    reporter: req.userId,
  };
  const engineer = await User.findOne({
    userType: "engineer",
    userStatus: "approved",
  });

  if (engineer) {
    ticketObj.assignee = engineer.userId;
  }

  const ticket = await Ticket.create(ticketObj);

  if (ticket) {
    const user = await User.findOne({ userId: req.userId });
    user.ticketsCreated.push(ticket._id);
    await user.save();

    if (engineer) {
      engineer.ticketsAssigned.push(ticket._id);
      await engineer.save();
    }
  }

  res.status(201).send({ ticket });
};