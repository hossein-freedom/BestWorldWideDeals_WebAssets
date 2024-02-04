import { USER_LOGGED_IN, ADMIN_KEY  } from "./Constants";

export const isUserLoggedIn = () => {
    return window.sessionStorage.getItem(ADMIN_KEY) && (window.sessionStorage.getItem(ADMIN_KEY) === USER_LOGGED_IN);
}