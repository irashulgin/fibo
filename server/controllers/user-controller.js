const ApiError = require("../exceptions/api-error");
const userService = require("../services/user-service");
const { validationResult } = require("express-validator");

class UserController {
  async registration(req, res, next) {
    try {
      const userData = await userService.registration(req.body);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
      }); // if using https - secure true
      // res.redirect(`${process.env.CLIENT_URL}/account-info`);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async collectData(req, res, next) {
    const userData = req.body;
    try {
      const user = await userService.collectData(userData);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async updateUser(req, res, next) {
    const userData = req.body;
    try {
      await userService.updateUser(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookie;
      const token = userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      res.redirect(`${process.env.CLIENT_URL}/login`);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async checkReference(req, res, next) {
    try {
      const { reference } = req.params.reference;
      await userService.checkReference(reference);
    } catch (e) {
      next(e);
    }
  }
  async inviteUser(req, res, next) {
    try {
      const email = req.body.email;
      await userService.inviteUser(email);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      await userService.resetPassword(token, password);
      res.json({ message: "Password reset successfully" });
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
      }); // if using https -  secure true
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
      }); // if using https - secure true
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const filter = req.query.search;
      const users = await userService.getAllUsers(filter);
      return res.json(users);
    } catch (e) {
      next(e);
      console.log("error", e);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await userService.forgotPassword(email);
      res.json({ message: "Reset email sent successfully" });
      // res.redirect(process.env.CLIENT_URL + '/reset-password');
    } catch (e) {
      next(e);
    }
  }

  async saveFile(req, res, next) {
    const { originalname, buffer, mimetype } = req.file;
    const { email } = req.body;
    try {
      const response = await userService.saveFile(
        email,
        originalname,
        buffer,
        mimetype
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getFile(req, res) {
    const { filename } = req.params;
    try {
      const response = await userService.getFile(filename);
      res.setHeader("Content-Type", response.contentType);
      res.send(response.data);
    } catch (error) {
      console.error("Error retrieving image:", error);
      return res.status(404).json({ message: "Image not found" });
    }
  }
}
module.exports = new UserController();
