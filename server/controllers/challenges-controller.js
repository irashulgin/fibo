const ApiError = require("../exceptions/api-error");
const challengesService = require("../services/challenges-service");
const { validationResult } = require("express-validator");

class ChallengesController {
  async get(req, res, next) {
    try {
      const filter = req.query.search;
      const email = req.query.email;

      const data = await challengesService.get(filter, email);
      return res.json(data);
    } catch (e) {
      next(e);
    }
  }
  async addChallenge(req, res, next) {
    try {
      const challenge = req.body;

      const data = await challengesService.addChallenge(challenge);
      return res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ChallengesController();
