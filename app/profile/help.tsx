import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HelpPage() {
  const router = useRouter();

  const faqs = [
    {
      question: "How do I create a trip?",
      answer: 'Tap the "Create Plan" tab and follow the step-by-step process.',
    },
    {
      question: "How do I add expenses?",
      answer: 'Go to your trip, select the Budget tab, and tap "Add Expense".',
    },
    {
      question: "How do I join a carpool?",
      answer:
        "Navigate to the Carpool tab in any trip to view and join carpools.",
    },
    {
      question: "Can I share my trip plan?",
      answer:
        'Yes! Go to the Overview tab and tap "Download Trip Plan" to share.',
    },
  ];

  return (
    <View style={helpStyles.container}>
      <View style={helpStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={helpStyles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={helpStyles.content}>
        {/* Quick Actions */}
        <View style={helpStyles.section}>
          <Text style={helpStyles.sectionTitle}>Get Help</Text>
          <View style={helpStyles.card}>
            <TouchableOpacity
              style={helpStyles.item}
              onPress={() =>
                Alert.alert("Coming Soon", "Chat support coming soon")
              }
            >
              <View style={helpStyles.itemIcon}>
                <MaterialIcons name="chat" size={22} color="#6366F1" />
              </View>
              <Text style={helpStyles.itemText}>Chat Support</Text>
              <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity
              style={helpStyles.item}
              onPress={() =>
                Alert.alert("Coming Soon", "Report feature coming soon")
              }
            >
              <View
                style={[helpStyles.itemIcon, { backgroundColor: "#FEE2E2" }]}
              >
                <MaterialIcons name="flag" size={22} color="#EF4444" />
              </View>
              <Text style={helpStyles.itemText}>Report an Issue</Text>
              <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQs */}
        <View style={helpStyles.section}>
          <Text style={helpStyles.sectionTitle}>
            Frequently Asked Questions
          </Text>
          {faqs.map((faq, index) => (
            <View key={index} style={helpStyles.faqCard}>
              <Text style={helpStyles.faqQuestion}>{faq.question}</Text>
              <Text style={helpStyles.faqAnswer}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const helpStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  content: { flex: 1 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: { flex: 1, fontSize: 15, fontWeight: "500", color: "#111827" },
  faqCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  faqAnswer: { fontSize: 14, color: "#6B7280", lineHeight: 20 },
});
