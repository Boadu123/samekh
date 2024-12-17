import { userModel } from "../models/userModels.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/userValidators.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    const newUser = await userModel.create({
      ...value,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "24h",
    });

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      accessToken: token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error, value } = loginValidator.validate(req.body);
    if (error) {
      res.status(422).json({
        status: "error",
        message: "validation error",
        details: error.details,
      });
    }
    const user = await userModel.findOne({ email: value.email });
    if (!user) {
      res.status(404).json({
        status: "error",
        message: "Invalid Credentials",
        details: error.details,
      });
    }
    const corrctPassword = bcrypt.compare(value.password, user.password);
    if (!corrctPassword) {
      res.status(404).json({
        status: "error",
        message: "Invalid Credentials",
        details: error.details,
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "24h",
    });
    res.status(200).json({
      message: "User logged In",
      accessToken: token,
    });
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.auth.id).select({
      password: false,
    });
    res.status(200).json({
      status: "success",
      message: "User Details",
      details: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    const deleteUser = await userModel.findByIdAndDelete(req.auth.id);
    if (!deleteUser) {
      res.status(404).json({
        status: "error",
        message: "User Not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { password, email, ...updateData } = req.body;

    const updateUser = await userModel.findByIdAndUpdate(
      req.auth.id,
      updateData,
      { new: true, select: "-password", select: "-email" }
    );
    if (!updateUser) {
      res.status(404).json({
        status: "error",
        message: "User Not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      details: updateUser,
    });
  } catch (error) {
    next(error);
  }
};

