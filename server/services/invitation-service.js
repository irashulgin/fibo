const uuid = require("uuid");
const mailService = require("./mail-service");
const InvitationModel = require("../models/invintation-model");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");

class invitationService {
  async send(email, referrer) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with email: ${email} exists`);
    }
    const invitationSent = await InvitationModel.findOne({ email });
    if (invitationSent) {
      throw ApiError.BadRequest(
        `Invitation with email: ${email} already has been sent`
      );
    }
    const invitationLink = uuid.v4();

    const invitation = new InvitationModel({ email, invitationLink, referrer });
    await invitation.save();
    await mailService.sendInvitationMail(
      email,
      `${process.env.API_URL}/api/accept-invitation/${invitationLink}`
    );
  }
  async acceptInvitation(invitationLink) {}
}
module.exports = new invitationService();
