import { currentMeditation } from "../../constants/Meditation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getCurrentMeditation() {
  try {
    const jsonValue = await AsyncStorage.getItem("@" + currentMeditation);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Getting the current meditation from storage has failed:", e);
  }
}
