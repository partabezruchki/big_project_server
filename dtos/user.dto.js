module.exports = class UserDto {
  email;
  password;
  name;
  isActivated;
  isAdmin;
  image;
  id;
  constructor(model) {
    this.name = model.name;
    this.email = model.email;
    this.password = model.password;
    this.isActivated = model.isActivated;
    this.isAdmin = model.isAdmin;
    this.image = model.image;
    this.id = model._id;
  }
};
