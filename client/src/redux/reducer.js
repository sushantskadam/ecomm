import { encryptStorage } from "../config/EncryptStorage";

const initialState = { count: 0, index: null, login: "" };

function reducer(state = initialState, actions) {
  switch (actions.type) {
    case "count":
      return { count: actions.payload };

    case "countcalc":
      let array = JSON.parse(localStorage.getItem("cart"));
      if (array) {
        const count = array
          .map((item) => Number(item.quantity))
          .reduce((prev, curr) => prev + curr, 0);
        return { ...state, count: count };
        // dispatch({ type: "count", payload: count });
        // console.log(count)
      } else {
        return { ...state, count: 0 };
        // dispatch({ type: "count", payload: 0 });
      }

    case "isuser":
      if (localStorage.getItem("_token") != undefined)
        return { ...state, login: true };
      else {
        return { ...state, login: false };
      }
    case "session_logout":
      setTimeout(() => {
        localStorage.removeItem("login");
        encryptStorage.removeItem("user");
        localStorage.removeItem("_token");
        localStorage.removeItem("cart");
      }, 600000);
    default:
      return state;
  }
}
export default reducer;
