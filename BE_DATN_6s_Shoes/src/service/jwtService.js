import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generalAccessToken = (payload) => {
  const accessToken = jwt.sign(
    { _id: payload._id, role_name: payload.role_name },
    process.env.jWT_SECRET_KEY,
    {
      expiresIn: "3d",
    }
  );
  return accessToken;
};

export const generalRefreshToken = (payload) => {
  const refreshToken = jwt.sign(
    { _id: payload._id, role_id: payload.role_id, slug: payload.slug },
    process.env.jWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  return refreshToken;
};
