import { Middleware } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

import { checkAndBootWeshModule } from "@/weshnet/services";
export const afterRehydrateMiddleware: Middleware =
  () => (next) => async (action) => {
    if (action.type === REHYDRATE) {
      checkAndBootWeshModule();
    }
    return next(action);
  };
