import cron from "node-cron";
import ProductGroup from "../../model/group.js";

const updateGroupStatus = async () => {
  const currentTime = new Date();
  try {
    const groups = await ProductGroup.find({});

    for (const group of groups) {
      if (group.start_date <= currentTime && group.end_date > currentTime) {
        group.status = false;
      } else {
        group.status = true;
      }

      await group.save();
    }
  } catch (error) {
    console.error("Error updating group status:", error.message);
  }
};

cron.schedule("* * * * *", () => {
  updateGroupStatus();
});
