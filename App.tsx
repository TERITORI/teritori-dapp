import Constants from "expo-constants";

import Root from "./Root";
Object.entries(Constants.expoConfig?.extra?.env).forEach(([key, value]) => {
  process.env[key] = `${value}`;
});
export default Root;
