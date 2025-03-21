import { subscription_frequency } from "@/constants/frequency";
import { addDays, addMonths } from "date-fns";


export function getNextSubscriptionDate(startDate: string, frequency: typeof subscription_frequency[number]): string {
  const date = new Date(startDate);

  switch (frequency) {
    case "Weekly":
      return addDays(date, 7).toISOString().split("T")[0];
    case "Every 2 weeks":
      return addDays(date, 14).toISOString().split("T")[0];
    case "Every 4 weeks":
      return addDays(date, 28).toISOString().split("T")[0];
    case "Monthly":
      return addMonths(date, 1).toISOString().split("T")[0];
    case "Quarterly":
      return addMonths(date, 3).toISOString().split("T")[0];
    case "Every 6 months":
      return addMonths(date, 6).toISOString().split("T")[0];
    case "Yearly":
      return addMonths(date, 12).toISOString().split("T")[0];
    default:
      throw new Error("Invalid frequency");
  }
}
