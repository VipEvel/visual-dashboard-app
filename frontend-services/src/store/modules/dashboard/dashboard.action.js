import { newRequest } from "helpers/api";

export function getDashboardData() {
  return async (dispatch) => {
    const requestObject = {
      method: "GET",
      url: `/dashboard/fetch`,
    };

    try {
      // Make the API request using newRequest and get the response
      const response = await newRequest(requestObject);

      // Dispatch a success action with the response data
      return dispatch({ type: "GET_DAHBOARD_DATA", ...response });
    } catch (error) {
      // Dispatch a failure action with the error
      return dispatch({ type: "GET_DAHBOARD_DATA", ...error });
    }
  };
}
