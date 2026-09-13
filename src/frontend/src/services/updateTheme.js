import axios from "axios";

import { backEndUrl } from "@utils/constants";

export default async function updateTheme(val, setTheme) {
  const res = await axios.patch(
    `${backEndUrl}/setting/updateTheme`,
    { theme: val },
    {
      withCredentials: true,
    },
  );

  const response = res.data;

  setTheme(response.data.theme);

  return response;
}
