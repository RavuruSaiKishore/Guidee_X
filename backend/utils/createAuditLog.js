import AuditLog from "../models/AuditLog.js";

const createAuditLog = async ({
  req,
  user,
  action,
  module,
  description,
  targetId = null,
  targetType = null,
}) => {
  try {
    await AuditLog.create({
      userId: user.id || user._id,
      userType: user.role.charAt(0).toUpperCase() + user.role.slice(1),

      userName: `${user.firstName} ${user.lastName}`,
      email: user.email,

      action,
      module,
      description,

      targetId,
      targetType,

      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],

    });
  } catch (err) {
    console.error("Audit Log Error:", err.message);
  }
};

export default createAuditLog;
