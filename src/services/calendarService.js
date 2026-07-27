import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Adds a calendar event to the Firestore database.
 * @param {Object} event - The calendar event data (e.g., { userId, title, date, etc. })
 * @returns {Promise<Object>} The added event containing the generated Firestore document ID.
 */
export async function addCalendarEvent(event) {
  try {
    const docRef = await addDoc(collection(db, "events"), event);
    return { id: docRef.id, ...event };
  } catch (error) {
    console.error("Error adding calendar event: ", error);
    throw error;
  }
}

/**
 * Fetches events for a specific user within a date range (start date to end date).
 * @param {string} userId - The ID of the user.
 * @param {Date|string} startDate - The start of the date range.
 * @param {Date|string} endDate - The end of the date range.
 * @returns {Promise<Array<Object>>} A list of matching calendar events.
 */
export async function fetchEvents(userId, startDate, endDate) {
  try {
    const eventsRef = collection(db, "events");
    const q = query(
      eventsRef,
      where("userId", "==", userId),
      where("date", ">=", startDate),
      where("date", "<=", endDate)
    );
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return events;
  } catch (error) {
    console.error("Error fetching calendar events: ", error);
    throw error;
  }
}
