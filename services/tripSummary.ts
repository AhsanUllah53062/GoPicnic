import { documentDirectory } from "expo-file-system/legacy";
import { Carpool } from "./carpool";
import { Expense } from "./expenses";
import { DayPlan } from "./itinerary";
import { Trip } from "./trips";

export type TripSummary = {
  trip: Trip;
  expenses: Expense[];
  carpools: Carpool[];
  dayPlans: DayPlan[];
  statistics: {
    totalDays: number;
    totalExpenses: number;
    totalSpent: number;
    budgetRemaining: number;
    placesVisited: number;
    carpoolsOrganized: number;
  };
};

/**
 * Generate trip summary text
 */
export const generateTripSummaryText = (summary: TripSummary): string => {
  const { trip, expenses, carpools, dayPlans, statistics } = summary;

  // Ensure dates are Date objects
  const startDate =
    trip.startDate instanceof Date ? trip.startDate : new Date(trip.startDate);
  const endDate =
    trip.endDate instanceof Date ? trip.endDate : new Date(trip.endDate);

  let text = `
╔═══════════════════════════════════════════════╗
║           TRIP SUMMARY - ${trip.toLocation?.toUpperCase() || "TRIP"}           ║
╚═══════════════════════════════════════════════╝

📍 TRIP DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From: ${trip.fromLocation || "N/A"}
To: ${trip.toLocation || "N/A"}
Dates: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}
Duration: ${statistics.totalDays || 0} days
Status: ${trip.status || "Active"}

💰 BUDGET OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Budget: ${trip.currency || "USD"} ${(trip.budget || 0).toLocaleString()}
Total Spent: ${trip.currency || "USD"} ${(statistics.totalSpent || 0).toLocaleString()}
Remaining: ${trip.currency || "USD"} ${(statistics.budgetRemaining || 0).toLocaleString()}
Expenses Count: ${statistics.totalExpenses || 0}

📊 EXPENSES BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  if (expenses && expenses.length > 0) {
    expenses.forEach((expense, index) => {
      const expenseDate =
        expense.date instanceof Date
          ? expense.date
          : new Date(expense.date || new Date());
      text += `${index + 1}. ${expense.category || "Other"}
   Amount: ${expense.currency || trip.currency || "USD"} ${(expense.amount || 0).toLocaleString()}
   Paid by: ${expense.paidBy || "Unknown"}
   Split: ${expense.splitType || "Even"}
   Date: ${expenseDate.toLocaleDateString()}
   ${expense.description ? `Note: ${expense.description}` : ""}

`;
    });
  } else {
    text += `No expenses recorded.\n\n`;
  }

  text += `🗓️ DAILY ITINERARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  if (dayPlans && dayPlans.length > 0) {
    dayPlans.forEach((day) => {
      const dayDate =
        day.date instanceof Date ? day.date : new Date(day.date || new Date());
      text += `
Day ${(day.dayIndex || 0) + 1} - ${dayDate.toLocaleDateString()}
${"-".repeat(50)}
`;

      if (day.places && day.places.length > 0) {
        text += `Places to Visit:\n`;
        day.places.forEach((place, index) => {
          text += `  ${index + 1}. ${place.placeName || "Unnamed Place"}
     Time: ${place.startTime || "TBD"} - ${place.endTime || "TBD"}
     ${place.expense ? `Cost: ${place.expense}` : ""}
     ${place.notes ? `Notes: ${place.notes}` : ""}
`;
        });
      }

      if (day.todos && day.todos.length > 0) {
        text += `\nTo-Do:\n`;
        day.todos.forEach((todo) => {
          text += `  ${todo.done ? "✓" : "○"} ${todo.text || ""}\n`;
        });
      }

      if (day.notes && day.notes.length > 0) {
        text += `\nNotes:\n`;
        day.notes.forEach((note) => {
          text += `  • ${note}\n`;
        });
      }
    });
  } else {
    text += `No itinerary planned yet.\n\n`;
  }

  if (carpools && carpools.length > 0) {
    text += `🚗 CARPOOL INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    carpools.forEach((carpool, index) => {
      const departureDate =
        carpool.departureDate instanceof Date
          ? carpool.departureDate
          : new Date(carpool.departureDate || new Date());
      text += `
${index + 1}. Driver: ${carpool.driverName || "Unknown"}
   Car: ${carpool.carModel || "N/A"}${carpool.carColor ? ` (${carpool.carColor})` : ""}
   Contact: ${carpool.contactNumber || "N/A"}
   Seats: ${carpool.availableSeats || 0}/${carpool.totalSeats || 0} available
   Departure: ${departureDate.toLocaleDateString()} at ${carpool.departureTime || "TBD"}
   Meeting Point: ${carpool.meetingPoint || "N/A"}
   Charge: ${carpool.currency || trip.currency || "USD"} ${carpool.chargePerPerson || 0}/person
   ${carpool.preferences ? `Preferences: ${carpool.preferences}` : ""}

`;
    });
  }

  text += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated on: ${new Date().toLocaleString()}
Powered by goPicnic
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  return text;
};

/**
 * Download trip summary as text file
 */
export const downloadTripSummary = async (
  summary: TripSummary,
): Promise<void> => {
  try {
    console.log("📥 Generating trip summary...");

    // Import legacy API
    const { writeAsStringAsync } = await import("expo-file-system/legacy");

    const summaryText = generateTripSummaryText(summary);
    const safeLocation = (summary.trip.toLocation || "Trip").replace(
      /\s+/g,
      "_",
    );
    const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const fileName = `goPicnic_${safeLocation}_${timestamp}.txt`;

    // Save to document directory (accessible in file manager)
    const fileUri = `${documentDirectory}${fileName}`;

    // Write to file using legacy API
    await writeAsStringAsync(fileUri, summaryText);

    console.log("✅ File saved:", fileUri);
    console.log("📱 File is available in your device's file manager");
  } catch (error: any) {
    console.error("❌ Error downloading trip summary:", error);
    throw new Error(`Failed to download trip summary: ${error.message}`);
  }
};
