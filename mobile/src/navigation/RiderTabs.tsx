import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

import RiderDashboardScreen from "@/screens/rider/DashboardScreen";
import BrowseScreen from "@/screens/rider/BrowseScreen";
import RequestDetailScreen from "@/screens/rider/RequestDetailScreen";
import MyDeliveriesScreen from "@/screens/rider/MyDeliveriesScreen";
import ActiveDeliveryScreen from "@/screens/rider/ActiveDeliveryScreen";
import ProfileScreen from "@/screens/rider/ProfileScreen";
import BusinessesScreen from "@/screens/rider/BusinessesScreen";
import ConversationsScreen from "@/screens/messages/ConversationsScreen";
import ChatScreen from "@/screens/messages/ChatScreen";
import SettingsScreen from "@/screens/settings/SettingsScreen";

import type {
  RiderTabParamList,
  RiderBrowseStackParamList,
  RiderDeliveriesStackParamList,
  RiderProfileStackParamList,
  MessagesStackParamList,
} from "./types";

const Tab = createBottomTabNavigator<RiderTabParamList>();
const BrowseStack = createNativeStackNavigator<RiderBrowseStackParamList>();
const DeliveriesStack =
  createNativeStackNavigator<RiderDeliveriesStackParamList>();
const ProfileStack = createNativeStackNavigator<RiderProfileStackParamList>();
const MessagesStack = createNativeStackNavigator<MessagesStackParamList>();

function BrowseNavigator() {
  return (
    <BrowseStack.Navigator>
      <BrowseStack.Screen
        name="BrowseList"
        component={BrowseScreen}
        options={{ title: "Browse Requests" }}
      />
      <BrowseStack.Screen
        name="BrowseDetail"
        component={RequestDetailScreen}
        options={{ title: "Request Details" }}
      />
    </BrowseStack.Navigator>
  );
}

function DeliveriesNavigator() {
  return (
    <DeliveriesStack.Navigator>
      <DeliveriesStack.Screen
        name="DeliveriesList"
        component={MyDeliveriesScreen}
        options={{ title: "My Deliveries" }}
      />
      <DeliveriesStack.Screen
        name="ActiveDelivery"
        component={ActiveDeliveryScreen}
        options={{ title: "Active Delivery" }}
      />
    </DeliveriesStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "My Profile" }}
      />
      <ProfileStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </ProfileStack.Navigator>
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

export default function RiderTabs() {
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
        component={RiderDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Deliveries"
        component={DeliveriesNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="truck-delivery" size={size} color={color} />
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
        name="Profile"
        component={ProfileNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
