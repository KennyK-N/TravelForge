import axios from "axios";

import { backEndUrl } from "@utils/constants";

const api = axios.create({
  baseURL: backEndUrl,
  withCredentials: true,
  timeout: 60000,
});

export async function getAuthAndSettings() {
  try {
    const userInfo = await api.get("/auth/me");

    const userSetting = await api.get("/setting/getSetting");

    return {
      success: true,
      msg: "User is signed in",
      data: {
        userInfo: userInfo.data,
        userSetting: userSetting.data,
      },
    };
  } catch (err) {
    if (err.response?.status === 401) {
      return {
        success: false,
        msg: "User is not signed in",
        data: null,
      };
    }

    throw err;
  }
}
