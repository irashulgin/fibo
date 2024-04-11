const ApiError = require("../exceptions/api-error");
const invitationService = require("../services/invitation-service");

class InvitationController {
  async sendInvitation(req, res, next) {
    const { email, user, note } = req.body;

    try {
      await invitationService.send(email, user, note);
      res.json({ message: "Invitaiton sent successfully" });
    } catch (e) {
      next(e);
    }
  }
  async acceptInvitation(req, res, next) {
    try {
      const invitationLink = req.params.link;
      await invitationService.acceptInvitation(invitationLink);
      res.redirect(`${process.env.CLIENT_URL}/welcome`);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new InvitationController();
