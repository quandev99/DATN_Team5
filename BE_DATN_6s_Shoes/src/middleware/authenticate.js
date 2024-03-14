import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
dotenv.config();

export const middlewareController = async (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.jWT_SECRET_KEY, (err, decode) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(401).json({
            message: "Token không hợp lệ",
          });
        }
        if (err.name == "TokenExpiredError") {
          return res.status(401).json({
            message: "Token hết hạn",
          });
        }
      }
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      message: "chưa xác thực ( you are not authenticaed)",
    });
  }
};

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({
        message: "Bạn phải đăng nhập để thực hiện hành động này",
      });
    }

    const token = authHeader.split(" ")[1];
    const secretKey = process.env.jWT_SECRET_KEY;

    jwt.verify(token, secretKey, async (error, decode) => {
      if (error) {
        if (error.name === "JsonWebTokenError") {
          return res.status(401).json({
            message: "Token không hợp lệ",
          });
        }
        if (error.name == "TokenExpiredError") {
          return res.status(401).json({
            message: "Token hết hạn",
          });
        }
      }
      const user = await User.findById(decode);
      if (!user) {
        return res.status(400).json({
          message: "Không tìm tháy người dùng",
        });
      }
      req.user = decode;
      next();
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};
