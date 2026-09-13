import axios from "axios";

const URL = "https://router.project-osrm.org/route/v1";
const OVERVEIW = "overview=full";

export async function getPreciseRoute(coordinate, transportation) {
  try {
    const queryParam = coordinate
      .map((prev) => {
        return prev.join();
      })
      .join(";");

    const res = await axios.get(
      `${URL}/${transportation}/${queryParam}?${OVERVEIW}`,
    );
    return {
      success: true,
      msg: "Routes received successfully",
      data: res.data,
    };
  } catch (err) {
    return {
      success: false,
      msg: err,
      data: null,
    };
  }
}
