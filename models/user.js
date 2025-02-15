const { Schema, model } = require("mongoose");

const { createHmac, randomBytes } = require("crypto");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "/images/avatar.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashPass = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashPass;
  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("UserNotFound");

  const salt = user.salt;
  const HashPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (HashPassword !== userProvidedHash) throw new Error("IncorrectPassword");

  return user;
});

const User = model("User", userSchema);

module.exports = User;
