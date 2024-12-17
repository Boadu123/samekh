import { userModel } from "../models/userModels.js";
import { registerValidator } from "../validators/userValidators.js";
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {
  try {
    // check if required inputs were provided
    const { error, value } = registerValidator.validate(req.body);
    
    if (error) {
      res.status(422).json({
        status: "error",
        message: "Validation error",
        details: error.details,
      });
    }
    // check if user does not exist already
    const user = await userModel.findOne({ email: value.email });
    

    if (user) {
      res.status(409).json({
        message: "error",
        status: "User already exist",
      });
    }

    const hashedPassword = bcrypt.hashSync(value.password, 10);

    await userModel.create({
      ...value,
      password: hashedPassword,
    });

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};
