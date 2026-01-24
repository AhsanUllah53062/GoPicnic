import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import BudgetingTab from './BudgetingTab';
import CarpoolTab from './CarpoolTab';
import ItineraryTab from './ItineraryTab';
import OverviewTab from './OverviewTab';

const Tab = createMaterialTopTabNavigator();

export default function TripDetailsTabs({ days }: { days: Date[] }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#888',
        tabBarIndicatorStyle: {
          backgroundColor: '#000',
          height: 3,
          borderRadius: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
      }}
    >
      <Tab.Screen name="Itinerary">
        {() => <ItineraryTab days={days} />}
      </Tab.Screen>
      <Tab.Screen name="Budgeting" component={BudgetingTab} />
      <Tab.Screen name="Carpooling" component={CarpoolTab} />
      <Tab.Screen name="Overview" component={OverviewTab} />
    </Tab.Navigator>
  );
}
