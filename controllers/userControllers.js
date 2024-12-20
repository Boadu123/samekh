import { userModel } from "../models/userModels.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/userValidators.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { mailTransporter } from "../utils/mail.js";

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

    const updateEmail = await userModel.findByIdAndUpdate(
      req.auth.id,
      { email },
      {
        new: true,
        select: "-password -firstName -lastName",
      }
    );
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

const otpStore = new Map(); // Key: email, Value: { otp, otpExpiry }

export const generateOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required.",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    otpStore.set(email, { otp, otpExpiry });

    await mailTransporter.sendMail({
      from: "Samekh <bboaduboateng2000@gmail.com>",
      to: user.email,
      subject: "Samekh Account Password Reset",
      text: `Your password reset code is ${otp}. It expires in 10 minutes.`,
    });

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: "error",
        message: "Email and OTP are required.",
      });
    }

    const storedOTP = otpStore.get(email);
    if (!storedOTP) {
      return res.status(400).json({
        status: "error",
        message: "OTP not found or expired.",
      });
    }

    if (storedOTP.otp !== otp || storedOTP.otpExpiry < Date.now()) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired OTP.",
      });
    }

    // OTP verified; clear it from memory
    otpStore.set(`${email}_verified`, true);
    otpStore.delete(email);

    res.status(200).json({
      status: "success",
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Email and new password are required.",
      });
    }

    const isVerified = otpStore.get(`${email}_verified`);
    if (!isVerified) {
      return res.status(403).json({
        status: "error",
        message: "OTP verification is required before resetting the password.",
      });
    }
    otpStore.delete(`${email}_verified`);

    // Find the user in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Clear the OTP verification flag
    otpStore.delete(`${email}_verified`);

    res.status(200).json({
      status: "success",
      message: "Password reset successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();
    if (!users) {
      return res.status(404).json({
        status: "error",
        message: "No users Found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Password reset successfully.",
      details: users,
    });
  } catch (error) {
    next(error);
  }
};
