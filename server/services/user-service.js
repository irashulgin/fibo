const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const invitationModel = require("../models/invintation-model");
const userModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");
const fileModel = require("../models/file-model");

class UserService {
  async registration(userData) {
    const {
      email,
      password,
      role,
      lastName,
      name,
      city,
      phone,
      interests,
      about,
      imageUrl,
      profession,
    } = userData;
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with email: ${email} exists`);
    }

    const invitation = await invitationModel.findOne({ email });
    const referrer = invitation.referrer;

    if (!invitation) {
      throw ApiError.BadRequest("Incorrect invitation link");
    }
    //
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4(); // random string

    const user = await UserModel.create({
      password: hashPassword,
      activationLink,
      email,
      role,
      lastName,
      name,
      city,
      phone,
      interests,
      about,
      profession,
      imageUrl,
      referrer,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });
   
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    await invitationModel.deleteOne({ email });
    return {
      ...tokens,
      user: userDto,
    };
  }
  async checkReference(reference) {
    const user = await userModel.findOne({ _id: reference });
    if (!user) {
      throw ApiError.BadRequest("Incorrect reference number");
    }
  }

  async inviteUser(email) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with email: ${email} exists`);
    }
    //send email with invintation
  }

  async activate(activationLink) {
    const user = await userModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Incorrect activation link");
    }
    user.isActivated = true;
    await user.save();
  }
  async resetPassword(token, password) {
    if (!token) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateResetToken(token);
    const tokenFromDB = tokenService.findToken(token);
    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    // const userDto = new UserDto(user);

    if (!user) {
      throw ApiError.BadRequest("Incorrect activation link");
    }
    const hashPassword = await bcrypt.hash(password, 3);
    user.password = hashPassword;
    await user.save();
  }
  async updateUser(userData) {
    try {
      UserModel.updateOne(
        {
          email: email,
        },
        {
          $set: {
            ...userData,
          },
        }
      );
    } catch (e) {
      throw ApiError.BadRequest("Error updating user data");
    }
  }
  async collectData(userData) {
    try {
      const update = { $set: userData };
      const result = await UserModel.updateOne(
        { email: userData.email },
        update
      );
      const user = await userModel.findOne({ email: userData.email });
      const userDto = new UserDto(user);
      return userDto;
    } catch (e) {
      throw ApiError.BadRequest("Error updating user data");
    }
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("user not found");
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      throw ApiError.BadRequest("Bad password");
    }
    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
  async forgotPassword(email) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`User with email: ${email} doesn't exist`);
    }
    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });

    await mailService.sendResetMail(
      email,
      `${process.env.CLIENT_URL}/reset-password/${tokens.forgotPasswordToken}`
    );
    await tokenService.saveToken(userDto.id, tokens.forgotPasswordToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
  async getAllUsers(filter) {
    let users;
    if (filter.length > 0) {
      users = userModel.find({ email: { $regex: filter, $options: "i" } });
    } else {
      users = userModel.find();
    }
    return users;
  }

  async saveFile(email, originalname, buffer, mimetype) {
    // Save the file to MongoDB
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`User with email: ${email} doesn't exist`);
    }

    const newFile = new fileModel({
      filename: originalname,
      contentType: mimetype,
      data: buffer,
      email: email,
    });

    await newFile.save();
    const imageUrl = `/images/${originalname}`; // Assuming you have a route to serve files

    UserModel.updateOne(
      {
        email,
      },
      {
        $set: { imageUrl },
      }
    );

    return { url: imageUrl };
  }

  async getFile(filename) {
    const file = await fileModel.findOne({ filename });

    if (!file) {
      throw ApiError.BadRequest("Image not found");
    }

    return file;
  }
}

module.exports = new UserService();
