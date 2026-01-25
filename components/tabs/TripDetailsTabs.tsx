import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Trip } from "../../services/trips";
import BudgetingTab from "./BudgetingTab";
import CarpoolTab from "./CarpoolTab";
import ItineraryTab from "./ItineraryTab";
import OverviewTab from "./OverviewTab";

type Props = {
  tripId: string;
  trip: Trip;
  days: Date[];
  userId: string;
};

type TabType = "itinerary" | "budget" | "carpool" | "overview";

export default function TripDetailsTabs({ tripId, trip, days, userId }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("itinerary");

  const tabs = [
    { id: "itinerary" as TabType, label: "Itinerary" },
    { id: "budget" as TabType, label: "Budget" },
    { id: "carpool" as TabType, label: "Carpool" },
    { id: "overview" as TabType, label: "Overview" },
  ];

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === "itinerary" && (
          <ItineraryTab tripId={tripId} trip={trip} days={days} />
        )}
        {activeTab === "budget" && <BudgetingTab tripId={tripId} trip={trip} />}
        {activeTab === "carpool" && (
          <CarpoolTab tripId={tripId} trip={trip} userId={userId} />
        )}
        {activeTab === "overview" && (
          <OverviewTab tripId={tripId} trip={trip} days={days} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    position: "relative",
  },
  activeTab: {
    // Active tab styling handled by indicator
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
  activeTabText: {
    color: "#6366F1",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#6366F1",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabContent: {
    flex: 1,
  },
  placeholderTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  placeholderText: {
    fontSize: 16,
    color: "#8E8E93",
  },
});
