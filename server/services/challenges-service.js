const challengeModel = require("../models/challenge-model");
const UserDto = require("../dtos/user-dto");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");

class ChallengesService {
  async get(filter, email) {
    //to do add filter

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`User with email: ${creator} doesn't exist`);
    }

    const userDto = new UserDto(user);

    const challenges = await challengeModel.find({ creator: userDto.id });
    return challenges;
  }
  async addChallenge(challengeData) {
    const user = await UserModel.findOne({ email: challengeData.creator });
    if (!user) {
      throw ApiError.BadRequest(
        `User with email: ${challengeData.creator} doesn't exist`
      );
    }

    const userDto = new UserDto(user);

    const challenge = await challengeModel.create({
      ...challengeData,
      creator: userDto.id,
    });

    return challenge;
  }
}

module.exports = new ChallengesService();
