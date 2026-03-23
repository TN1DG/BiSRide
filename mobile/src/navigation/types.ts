import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Business Screens
export type BusinessRequestsStackParamList = {
  RequestsList: undefined;
  NewRequest: undefined;
  RequestDetail: { id: string };
};

export type BusinessTabParamList = {
  Dashboard: undefined;
  Requests: NavigatorScreenParams<BusinessRequestsStackParamList>;
  Proposals: undefined;
  Messages: NavigatorScreenParams<MessagesStackParamList>;
  Settings: undefined;
};

// Rider Screens
export type RiderBrowseStackParamList = {
  BrowseList: undefined;
  BrowseDetail: { id: string };
};

export type RiderDeliveriesStackParamList = {
  DeliveriesList: undefined;
  ActiveDelivery: { id: string };
};

export type RiderProfileStackParamList = {
  ProfileMain: undefined;
  SettingsScreen: undefined;
};

export type RiderTabParamList = {
  Dashboard: undefined;
  Browse: NavigatorScreenParams<RiderBrowseStackParamList>;
  Deliveries: NavigatorScreenParams<RiderDeliveriesStackParamList>;
  Messages: NavigatorScreenParams<MessagesStackParamList>;
  Profile: NavigatorScreenParams<RiderProfileStackParamList>;
};

// Messages
export type MessagesStackParamList = {
  ConversationsList: undefined;
  Chat: { conversationId: string };
};

// Root
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  BusinessTabs: NavigatorScreenParams<BusinessTabParamList>;
  RiderTabs: NavigatorScreenParams<RiderTabParamList>;
};

// Screen props helpers
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type BusinessTabProps<T extends keyof BusinessTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BusinessTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type RiderTabProps<T extends keyof RiderTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RiderTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
