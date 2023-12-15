import * as SecureStore from "expo-secure-store";

export const save = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const getValueFor = async (key: string) => {
  const result = await SecureStore.getItemAsync(key);
  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert("No values stored under that key.");
  }
  return result;
};
