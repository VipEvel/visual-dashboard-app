import { fulfilled } from "helpers/api";

const initial = {
  dashboard: {},
};

const dashboardReducer = (state = initial, action)=> {
  switch (action.type) {
    case fulfilled("GET_DAHBOARD_DATA"):
      return { ...state, dashboard: action.payload, msg:'hi' };
    default:
      return state;
  }
}

export default dashboardReducer;