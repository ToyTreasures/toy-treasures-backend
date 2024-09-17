const { Schema, model } = require("mongoose");
const util = require("util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSignAsync = util.promisify(jwt.sign);

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password should be at least 8 characters"],
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [
        /^(010|011|012|015)\d{8}$/,
        "Please enter a valid Egyptian phone number",
      ],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateAccessToken = async function () {
  const accessToken = await jwtSignAsync(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: 60 * 15 }
  );
  return accessToken;
};

userSchema.methods.generateRefreshToken = async function () {
  const refreshToken = await jwtSignAsync(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
  return refreshToken;
};

const User = model("User", userSchema);

module.exports = User;
