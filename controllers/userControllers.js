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
      return res.status(422).json({
        status: "error",
        message: "Validation error",
        details: error.details,
      });
    }
    // check if user does not exist already
    const user = await userModel.findOne({ email: value.email });

    if (user) {
      return res.status(409).json({
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

    res.status(201).json({
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
      return res.status(422).json({
        status: "error",
        message: "validation error",
        details: error.details,
      });
    }
    const user = await userModel.findOne({ email: value.email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Invalid Credentials",
        details: error.details,
      });
    }
    const corrctPassword = bcrypt.compare(value.password, user.password);
    if (!corrctPassword) {
      return res.status(404).json({
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
      return res.status(404).json({
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
      { new: true, select: "-password -email" }
    );
    if (!updateUser) {
      return res.status(404).json({
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

export const changeEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required.",
      });
    }

    const updateEmail = await userModel.findByIdAndUpdate(req.auth.id, { email }, {
      new: true,
      select: "-password -firstName -lastName",
    });
    if (!updateEmail) {
      return res.status(404).json({
        status: "error",
        message: "User Not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User email updated successfully",
      details: updateEmail,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Old password and new password are required.",
      });
    }
    const user = await userModel.findById(req.auth.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Old password is incorrect.",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
