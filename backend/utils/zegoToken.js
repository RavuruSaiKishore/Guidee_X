import { generateKitTokenForTest } from "zego-token";

export const generateZegoToken = (
  appID,
  serverSecret,
  userID,
  userName,
  roomID
) => {
  return generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);
};
