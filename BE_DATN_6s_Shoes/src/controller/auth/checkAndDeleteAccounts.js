import User from "../../model/user.js";
import dotenv from "dotenv";
dotenv.config();
import cron from "node-cron";

export const checkAndDeleteAccounts = async () => {
  try {
    const users = await User.find();
    const currentDate = new Date();

    for (const user of users) {
      if (user.verifyToken && user.verifyToken.expiration) {
        const verifyTokenExpiration = new Date(user.verifyToken.expiration);
        const expirationDate = new Date(
          verifyTokenExpiration.getTime() + 3 * 24 * 60 * 60 * 1000
        );

        if (currentDate > expirationDate && !user.isVerified) {
          await User.findByIdAndDelete(user._id);
        }
      }
    }
  } catch (error) {
    console.error(error.message);
  }
};

cron.schedule("0 0 * * *", () => {
  checkAndDeleteAccounts();
});
