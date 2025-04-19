import { USER_LOGGED_IN, ADMIN_KEY  } from "./Constants";

export const isUserLoggedIn = () => {
    return window.sessionStorage.getItem(ADMIN_KEY) && (window.sessionStorage.getItem(ADMIN_KEY) === USER_LOGGED_IN);
}

export const camelString = (text: string) => {
    return text.split(" ").map(token => 
        token.trim().charAt(0).toUpperCase()+token.trim().substring(1,token.trim().length).toLowerCase())
                        .join(" ");

}