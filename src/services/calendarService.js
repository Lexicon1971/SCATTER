import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Adds a calendar event to the Firestore database.
 * Optimized structure:
 * {
 *   "userId": "user_12345",
 *   "title": "Dentist Appointment",
 *   "description": "Routine checkup",
 *   "startDate": Timestamp,
 *   "endDate": Timestamp,
 *   "category": "personal"
 * }
 * @param {Object} event - The calendar event data
 * @returns {Promise<Object>} The added event containing the generated Firestore document ID.
 */
export async function addCalendarEvent(event) {
  try {
    const formattedEvent = {
      userId: event.userId,
      title: event.title || "",
      description: event.description || "",
      startDate: event.startDate instanceof Date ? Timestamp.fromDate(event.startDate) : event.startDate,
      endDate: event.endDate instanceof Date ? Timestamp.fromDate(event.endDate) : event.endDate,
      category: event.category || "personal"
    };
    const docRef = await addDoc(collection(db, "events"), formattedEvent);
    return { id: docRef.id, ...formattedEvent };
  } catch (error) {
    console.error("Error adding calendar event: ", error);
    throw error;
  }
}

/**
 * Alias for addCalendarEvent. Adds a calendar event to the Firestore database.
 * @param {Object} eventData - The calendar event data
 * @returns {Promise<Object>} The added event containing the generated Firestore document ID.
 */
export async function addEvent(eventData) {
  return addCalendarEvent(eventData);
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
    const startTimestamp = startDate instanceof Date ? Timestamp.fromDate(startDate) : startDate;
    const endTimestamp = endDate instanceof Date ? Timestamp.fromDate(endDate) : endDate;

    const eventsRef = collection(db, "events");
    const q = query(
      eventsRef,
      where("userId", "==", userId),
      where("startDate", ">=", startTimestamp),
      where("startDate", "<=", endTimestamp)
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

/**
 * Alias for fetchEvents. Fetches events for a specific user within a date range (start date to end date).
 * @param {string} userId - The ID of the user.
 * @param {Date|string} startDate - The start of the date range.
 * @param {Date|string} endDate - The end of the date range.
 * @returns {Promise<Array<Object>>} A list of matching calendar events.
 */
export async function getEventsForUserInDateRange(userId, startDate, endDate) {
  return fetchEvents(userId, startDate, endDate);
}
