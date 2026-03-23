import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

import BusinessDashboardScreen from "@/screens/business/DashboardScreen";
import RequestsListScreen from "@/screens/business/RequestsListScreen";
import NewRequestScreen from "@/screens/business/NewRequestScreen";
import RequestDetailScreen from "@/screens/business/RequestDetailScreen";
import ProposalsScreen from "@/screens/business/ProposalsScreen";
import ConversationsScreen from "@/screens/messages/ConversationsScreen";
import ChatScreen from "@/screens/messages/ChatScreen";
import SettingsScreen from "@/screens/settings/SettingsScreen";

import type {
  BusinessTabParamList,
  BusinessRequestsStackParamList,
  MessagesStackParamList,
} from "./types";

const Tab = createBottomTabNavigator<BusinessTabParamList>();
const RequestsStack =
  createNativeStackNavigator<BusinessRequestsStackParamList>();
const MessagesStack = createNativeStackNavigator<MessagesStackParamList>();

function RequestsNavigator() {
  return (
    <RequestsStack.Navigator>
      <RequestsStack.Screen
        name="RequestsList"
        component={RequestsListScreen}
        options={{ title: "My Requests" }}
      />
      <RequestsStack.Screen
        name="NewRequest"
        component={NewRequestScreen}
        options={{ title: "New Request" }}
      />
      <RequestsStack.Screen
        name="RequestDetail"
        component={RequestDetailScreen}
        options={{ title: "Request Details" }}
      />
    </RequestsStack.Navigator>
  );
}

function MessagesNavigator() {
  return (
    <MessagesStack.Navigator>
      <MessagesStack.Screen
        name="ConversationsList"
        component={ConversationsScreen}
        options={{ title: "Messages" }}
      />
      <MessagesStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: "Chat" }}
      />
    </MessagesStack.Navigator>
  );
}

export default function BusinessTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={BusinessDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="package-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Proposals"
        component={ProposalsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-multiple" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="message-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
