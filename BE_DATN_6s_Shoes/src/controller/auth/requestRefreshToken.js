import {
  generalAccessToken,
  generalRefreshToken,
} from "../../service/jwtService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const requestRefreshToken = async (req, res) => {
  try {
    const refesh_Token = req.cookies.refreshToken;
    if (!refesh_Token) {
      return res.status(400).json({
        message: "bạn chưa đăng nhập (you're not authenticated) ",
      });
    }

    jwt.verify(refesh_Token, process.env.jWT_SECRET_KEY, (err, decode) => {
      if (err) {
        return res.status(400).json({
          message: "Token error",
        });
      }
      const { _id, role_id, slug } = decode;

      const newAccessToken = generalAccessToken({ _id, role_id, slug });
      const newRefreshToken = generalRefreshToken({ _id, role_id, slug });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || " error server :((",
    });
  }
};
