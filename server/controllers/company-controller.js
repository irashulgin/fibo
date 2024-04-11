const ApiError = require("../exceptions/api-error");
const companyService = require("../services/company-service");

class CompanyController {
  async createCompany(req, res, next) {
    const companyData = req.body;
    try {
      const result = await companyService.create(companyData);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CompanyController();
