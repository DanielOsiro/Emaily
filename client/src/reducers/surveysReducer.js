import { FETCH_SURVEYS } from "../actions/types";

export default function (
  state = { data: [], currentPage: 1, totalPages: 1 },
  action
) {
  switch (action.type) {
    case FETCH_SURVEYS:
      return action.payload;

    default:
      return state;
  }
}
