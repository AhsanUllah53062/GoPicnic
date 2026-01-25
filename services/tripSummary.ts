import * as FileSystem from "expo-file-system";
import { cacheDirectory } from "expo-file-system"; // ✅ explicitly import cacheDirectory
import * as Sharing from "expo-sharing";
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

  let text = `
╔═══════════════════════════════════════════════╗
║           TRIP SUMMARY - ${trip.toLocation.toUpperCase()}           ║
╚═══════════════════════════════════════════════╝

📍 TRIP DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From: ${trip.fromLocation}
To: ${trip.toLocation}
Dates: ${trip.startDate.toLocaleDateString()} - ${trip.endDate.toLocaleDateString()}
Duration: ${statistics.totalDays} days
Status: ${trip.status}

💰 BUDGET OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Budget: ${trip.currency} ${trip.budget.toLocaleString()}
Total Spent: ${trip.currency} ${statistics.totalSpent.toLocaleString()}
Remaining: ${trip.currency} ${statistics.budgetRemaining.toLocaleString()}
Expenses Count: ${statistics.totalExpenses}

📊 EXPENSES BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  if (expenses.length > 0) {
    expenses.forEach((expense, index) => {
      text += `${index + 1}. ${expense.category}
   Amount: ${expense.currency} ${expense.amount.toLocaleString()}
   Paid by: ${expense.paidBy}
   Split: ${expense.splitType}
   Date: ${expense.date.toLocaleDateString()}
   ${expense.description ? `Note: ${expense.description}` : ""}

`;
    });
  } else {
    text += `No expenses recorded.\n\n`;
  }

  text += `🗓️ DAILY ITINERARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  if (dayPlans.length > 0) {
    dayPlans.forEach((day) => {
      text += `
Day ${day.dayIndex + 1} - ${day.date.toLocaleDateString()}
${"-".repeat(50)}
`;

      if (day.places.length > 0) {
        text += `Places to Visit:\n`;
        day.places.forEach((place, index) => {
          text += `  ${index + 1}. ${place.placeName}
     Time: ${place.startTime || "TBD"} - ${place.endTime || "TBD"}
     ${place.expense ? `Cost: PKR ${place.expense}` : ""}
     ${place.notes ? `Notes: ${place.notes}` : ""}
`;
        });
      }

      if (day.todos.length > 0) {
        text += `\nTo-Do:\n`;
        day.todos.forEach((todo) => {
          text += `  ${todo.done ? "✓" : "○"} ${todo.text}\n`;
        });
      }

      if (day.notes.length > 0) {
        text += `\nNotes:\n`;
        day.notes.forEach((note) => {
          text += `  • ${note}\n`;
        });
      }
    });
  } else {
    text += `No itinerary planned yet.\n\n`;
  }

  if (carpools.length > 0) {
    text += `🚗 CARPOOL INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    carpools.forEach((carpool, index) => {
      text += `
${index + 1}. Driver: ${carpool.driverName}
   Car: ${carpool.carModel}${carpool.carColor ? ` (${carpool.carColor})` : ""}
   Contact: ${carpool.contactNumber}
   Seats: ${carpool.availableSeats}/${carpool.totalSeats} available
   Departure: ${carpool.departureDate.toLocaleDateString()} at ${carpool.departureTime}
   Meeting Point: ${carpool.meetingPoint}
   Charge: ${carpool.currency} ${carpool.chargePerPerson}/person
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

    const summaryText = generateTripSummaryText(summary);
    const fileName = `${summary.trip.toLocation.replace(/\s+/g, "_")}_Trip_Summary.txt`;
    const fileUri = `${cacheDirectory}${fileName}`; // ✅ use imported cacheDirectory

    // Write to file
    await FileSystem.writeAsStringAsync(fileUri, summaryText, {
      encoding: FileSystem.EncodingType.UTF8, // ✅ use enum instead of casting
    });

    console.log("✅ File created:", fileUri);

    // Share the file
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/plain",
        dialogTitle: "Save Trip Summary",
      });
      console.log("✅ File shared successfully");
    } else {
      console.log("❌ Sharing not available");
      throw new Error("Sharing is not available on this device");
    }
  } catch (error: any) {
    console.error("❌ Error downloading trip summary:", error);
    throw new Error(`Failed to download trip summary: ${error.message}`);
  }
};
