import Sequelize from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const User = db.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: "user",
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    defaultScope: { attributes: { exclude: ["password"] } },
  }
);

const cryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  return hash;
};

User.beforeUpdate(async (user, options) => {
  if (user.password) {
    const hashedPassword = await cryptPassword(user.password);
    user.password = hashedPassword;
  }
});

User.beforeCreate(async (user, options) => {
  const hashedPassword = await cryptPassword(user.password);
  user.password = hashedPassword;
});

User.prototype.validatePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.getToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export default User;
