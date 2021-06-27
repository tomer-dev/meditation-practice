/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { BottomTabParamList, MeditationPlannerParamList } from "../types";
import MeditationScreen from "../components/MeditationScreen/MeditationScreen";
import MeditationMenuScreen from "../components/MeditationMenuScreen/MeditationMenuScreen";
import CreateMeditationScreen from "../components/CreateMeditationScreen/CreateMeditationScreen";
import UploadSoundScreen from "../components/UploadSoundScreen/UploadSoundScreen";
import { SettingsScreen } from "../components/SettingsScreen/SettingsScreen";
import {
  Button,
  Pressable,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "../components/Themed";

const BottomTab = createStackNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="Meditation">
      <BottomTab.Screen
        name="Meditation"
        component={MeditationPlannerNavigator}
        options={{ headerShown: false }}
      />
    </BottomTab.Navigator>
  );
}

const MeditationPlannerStack =
  createStackNavigator<MeditationPlannerParamList>();

function MeditationPlannerNavigator() {
  return (
    <MeditationPlannerStack.Navigator>
      <MeditationPlannerStack.Screen
        name="MeditationPlannerScreen"
        component={MeditationMenuScreen}
        options={({ navigation }) => ({
          headerTitle: "Meditation Planner",
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                padding: 16,
              }}
              onPress={() => navigation.navigate("SettingsScreen")}
            >
              <MaterialIcons name="settings" color="#fff" size={24} />
            </TouchableOpacity>
          ),
        })}
      />
      <MeditationPlannerStack.Screen
        name="MeditationScreen"
        component={MeditationScreen}
        options={{ headerTitle: "Meditation" }}
      />
      <MeditationPlannerStack.Screen
        name="CreateMeditationScreen"
        component={CreateMeditationScreen}
        options={{ headerTitle: "Add Meditation" }}
      />
      <MeditationPlannerStack.Screen
        name="UploadSoundScreen"
        component={UploadSoundScreen}
        options={{ headerTitle: "Upload Sound" }}
      />
      <MeditationPlannerStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerTitle: "Settings" }}
      />
    </MeditationPlannerStack.Navigator>
  );
}
