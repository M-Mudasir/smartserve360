import Cookies from 'js-cookie';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
  currentUser: boolean;
  role: string;
  id: number,
  fullName: string,
}

const initialState: LoginState = {
  currentUser: false,
  role: "",
  id: 0,
  fullName: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<void>) => {
      state.currentUser = true;
      let user = Cookies.get("user");
      if (user) {
        const parsedUser = JSON.parse(user) as {
          role: string, id: number,
          fullName: string
        } | undefined;
        state.role = parsedUser?.role || "";
        state.fullName = parsedUser?.fullName || "";
        state.id = parsedUser?.id || 0;


      }

    },
    userLogout: (state, action: PayloadAction<void>) => {
      Cookies.remove('user');
      Cookies.remove('accessToken');
      state.currentUser = false;
      state.role = "";
    },
  },

});


export const { userLogin, userLogout } = loginSlice.actions;
export default loginSlice.reducer;
