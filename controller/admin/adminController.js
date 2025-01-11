const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../../model/user");
const Alert = require("../../email-templates/alert")
const SendOTP = require("../../email-templates/sendOtpMail")
const LogInFailAlert = require("../../email-templates/login-failed-alert");
const ChangePasswordFail_Alert = require("../../email-templates/password-change-alert");
const jwt = require("jsonwebtoken");
const Mutual = require("../../model/mutual")
const Posts = require("../../model/post");
const { UploadImage } = require("../../utils/imageUpload");
const { deleteImgFromFolder } = require("../../utils/removeImages");
const getAllMutualPost = async (req, res) => {
  try {
    const response = await Mutual.find()
    if (!response?.length > 0) {
      return res.status(403).json({ success: false, message: "Data Not Found" });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const response = await Posts.find()
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const UserRegister = async (req, res) => {
  const { name, email, mobile, password, role } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(409).json({ success: false, message: "User already exists", });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name: name, email: email, mobile: mobile, password: hashPassword, role: role, });

    await newUser.save();

    res.status(201).json({ success: true, message: "User register successfully", data: newUser, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};
const UserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const min = 100000;
    const max = 999999;
    const OTP = Math.floor(Math.random() * (max - min + 1)) + min;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Email credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      LogInFailAlert(email)
      return res.status(401).json({ success: false, message: "Invalid Password credentials" });
    }

    await User.findByIdAndUpdate(user._id, { otp: OTP }, { new: true });
    const sentmail = await SendOTP(email, OTP)
    if (!sentmail.success) {
      return res.status(403).json({ success: false, message: "Something Went Wrong While Sending OTP " });
    }

    return res.status(200).json({ success: true, message: "OTP has been sent on you email " });
    // const token = jwt.sign(
    //   { _id: user._id, email: user?.email, role: user?.role },
    //   process.env.JWT_SECRET_KEY,
    //   {
    //     expiresIn: process.env.JWT_EXPIRE_TIME,
    //   }
    // );
    // return res
    //   .cookie("authorization", token, {
    //     httpOnly: true,
    //     expires: new Date(Date.now() + 240 * 60 * 60 * 1000),
    //   })
    //   .status(200)
    //   .json({ success: true, message: "Login successful", token: token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const VeriFyOTP = async (req, res) => {
  try {
    const { otp, email, newPassword } = req.body;
    const user = await User.findOne({ email, otp });

    if (!user) {
      ChangePasswordFail_Alert(email);
      return res.status(401).json({ success: false, message: "Invalid OTP or email." });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const response = await User.findByIdAndUpdate(user._id, { password: hashPassword }, { new: true });
    if (!response) return res.status(401).json({ success: false, message: "password Not Update" });
    res.status(200).json({ success: true, message: "Password has been changed", });

  } catch (error) {
    res.status(500).json({ error: error.message, message: "Something went wrong..." });
  }
};
const UserLoginOTP_Verify = async (req, res) => {
  const { email, otp } = req.body;

  try {
    console.log(email, otp);
    const user = await User.findOne({ email, otp });

    if (!user) {
      ChangePasswordFail_Alert(email);
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    const token = jwt.sign(
      { _id: user._id, email: user?.email, role: user?.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRE_TIME,
      }
    );
    return res
      .cookie("authorization", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 240 * 60 * 60 * 1000),
      })
      .status(200)
      .json({ success: true, message: "Login successful", token: token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .select("-otp");
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "user Not Found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await User.find({ role: "user" }).sort({ createdAt: -1 }).select("-password").select("-otp");
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id).select("-password").select("-otp");
    if (!user) {
      return res.status(403).json({ success: false, message: "user Not Found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const UpdateUser = async (req, res) => {
  const { id } = req.params
  const data = req.body;
  const image = req.files.image
  try {
    const checkUserExists = await User.findById(id).select("-password -otp")
    if (!checkUserExists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (image) {
      const filename = await UploadImage(image, 'userProfile');
      data.image = filename;
      if (checkUserExists.image) {
        await deleteImgFromFolder(checkUserExists.image, 'userProfile');
      }
    }
    const updatedUser = await User.findByIdAndUpdate(id, { $set: data }, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(202).send({ success: true, message: "user Updated", data: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
}

const deleteUser = async (req, res) => {
  try {
    const response = await User.findByIdAndDelete(req.params.id);
    if (response) {
      if (response.image) {
        await deleteImgFromFolder(response.image, 'userProfile');
      }
      res.status(200).json({ success: true, message: "User deleted" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ForGetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const min = 100000;
    const max = 999999;
    const OTP = Math.floor(Math.random() * (max - min + 1)) + min;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Email credentials" });
    }
    await User.findByIdAndUpdate(user._id, { otp: OTP }, { new: true });
    const sentmail = await SendOTP(email, OTP)
    if (!sentmail.success) {
      return res.status(403).json({ success: false, message: "Something Went Wrong While Sending OTP " });
    }

    return res.status(200).json({ success: true, message: "OTP has been sent on you email " });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const UserRegisterdByAdmin = async (req, res) => {
  const { name, email, mobile, password, designation, division } = req.body;
  const image = req.files.image
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(409).json({ success: false, message: "User already exists", });
    }

    let imageName;
    if (image) {
      imageName = await UploadImage(image, 'userProfile');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ image: imageName, name: name, email: email, mobile: mobile, password: hashPassword, designation: designation, division: division, });

    await newUser.save();

    res.status(201).json({ success: true, message: "User created successfully", data: newUser, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

module.exports = { getAllPosts, getAllMutualPost, UserRegisterdByAdmin, getUser, UserRegister, UserLogin, getAllUsers, getUserById, UpdateUser, deleteUser, ForGetPassword, VeriFyOTP, UserLoginOTP_Verify } 