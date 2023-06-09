import mongoose from "mongoose";
import { config } from "../config/dev";
import makeNewConnection from "../utils/connection";
import bcrypt from "bcrypt";
export const familySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      require: [true, "You need to provide a family name"],
    },
    password: {
      type: String,
      require: [true, "You need to provide the family password"],
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      require: [true, "You need to provide an admi"],
    },
    members: [
      {
        type: Object,
        role: {
          type: Number,
          default: 5077,
        },
      },
    ],
  },
  { timestamps: true }
);

familySchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      console.error(err.message);
    }
    this.password = hash;
    next();
  });
});

const familyConnection = mongoose.createConnection(config.familiesDB);
const Family = familyConnection.model("family", familySchema);

export default Family;
