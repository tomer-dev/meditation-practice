/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Meditation: undefined;
};

export type MeditationPlannerParamList = {
  MeditationPlannerScreen: undefined;
  MeditationScreen: undefined;
  CreateMeditationScreen: undefined;
  UploadSoundScreen: undefined;
  SettingsScreen: undefined;
};

export interface Meditation {
  name: string;
  duration: number;
  breathIn: BreathInfo;
  breathOut: BreathInfo;
}

export interface BreathInfo {
  duration: number;
  trackName: string;
  uri: string;
}
