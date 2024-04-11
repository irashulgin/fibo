module.exports = class UserDto {
  //data transfer object
  email;
  id;
  isActivated;
  role;
  name;
  lastName;
  about;
  interests;
  phone;
  imageUrl;
  city;
  institute;
  birthDate;
  currentWork;
  company;
  constructor(model) {
    this.email = model.email;
    this.id = model._id; //in mongo field id is unchangeble will be with _
    this.isActivated = model.isActivated;
    this.role = model.role;
    this.name = model.name;
    this.lastName = model.lastName;
    this.phone=model.phone;
    this.interests = model.interests;
    this.about = model.about;
    this.imageUrl = model.imageUrl;
    this.company = model.company;
    this.institute = model.institute;
    this.birthDate = model.birthDate;
    this.currentWork = model.currentWork;
    this.city = model.city;
  }
};
