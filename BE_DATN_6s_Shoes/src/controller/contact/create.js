import moment from "moment";
import Contact from "../../model/contact.js";
import { ContactSchema } from "../../schema/contact.js";

const ipRequests = {};
const maxRequestsPerMinute = 3;
const lockoutTime = 60000;

export const createContact = async (req, res) => {
  const formData = req.body;
  const clientIP = req.ip;

  try {
    // Kiểm tra số lượng yêu cầu từ cùng một IP trong khoảng thời gian ngắn
    if (
      ipRequests[clientIP] &&
      ipRequests[clientIP].count >= maxRequestsPerMinute
    ) {
      const currentTime = moment().valueOf();
      const lastRequestTime = ipRequests[clientIP].lastRequestTime;

      if (currentTime - lastRequestTime < lockoutTime) {
        const unlockTime = moment(lastRequestTime + lockoutTime).format(
          "HH:mm:ss DD-MM-YYYY"
        );
        return res.status(429).json({
          success: false,
          message: `Quá nhiều yêu cầu từ cùng một địa chỉ IP. Vui lòng thử lại sau ${unlockTime}.`,
        });
      } else {
        // Nếu đã qua thời gian lockout, reset số lượng yêu cầu
        ipRequests[clientIP].count = 1;
        ipRequests[clientIP].lastRequestTime = currentTime;
      }
    } else {
      // Tăng số lượng yêu cầu và ghi thời điểm lần yêu cầu cuối cùng
      ipRequests[clientIP] = {
        count: ipRequests[clientIP] ? ipRequests[clientIP].count + 1 : 1,
        lastRequestTime: moment().valueOf(),
      };
    }

    const { error } = ContactSchema.validate(formData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const dataContact = {
      ...formData,
    };

    const contact = await Contact.create(dataContact);
    if (!contact || contact.length === 0) {
      return res.status(400).json({
        message: "Gửi thông tin thất bại",
      });
    }

    return res.json({
      success: true,
      message: "Gửi thông tin thành công",
      contact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};
