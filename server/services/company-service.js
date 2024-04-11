const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");
const companyModel = require("../models/company-model");
const UserDto = require("../dtos/user-dto");

class companyService {
  async create(companyData) {
    const companyExists = await companyModel.findOne({
      name: companyData.name,
    });
    if (companyExists) {
      throw ApiError.BadRequest(
        `Company with name: ${companyData.name} exists`
      );
    }
    const user = await UserModel.findOne({ email: companyData.email });
    delete companyData.email;
    if (!user) {
      throw ApiError.BadRequest(`User with email: ${creator} doesn't exist`);
    }

    const userDto = new UserDto(user);
    const company = await companyModel.create({
      ...companyData,
      creator: userDto.id,
    });

    return company;
  }
}
module.exports = new companyService();
