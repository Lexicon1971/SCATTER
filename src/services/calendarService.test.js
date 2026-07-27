import { addCalendarEvent, addEvent, fetchEvents, getEventsForUserInDateRange } from "./calendarService";
import { addDoc, getDocs, query, where, collection } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  Timestamp: {
    fromDate: jest.fn((date) => `Timestamp-${date.toISOString()}`),
  },
}));

jest.mock("../firebase", () => ({
  db: {},
}));

describe("calendarService", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("addCalendarEvent / addEvent", () => {
    it("should successfully add an event and return it with an ID using addCalendarEvent", async () => {
      const mockEvent = {
        userId: "user-123",
        title: "Theology Class",
        description: "Introductory seminar",
        startDate: "Timestamp-2026-03-10T17:00:00.000Z",
        endDate: "Timestamp-2026-03-10T18:00:00.000Z",
        category: "personal",
      };

      const mockDocRef = { id: "new-doc-id-999" };
      addDoc.mockResolvedValueOnce(mockDocRef);

      const result = await addCalendarEvent(mockEvent);

      expect(collection).toHaveBeenCalledWith({}, "events");
      expect(addDoc).toHaveBeenCalledWith(undefined, mockEvent);
      expect(result).toEqual({
        id: "new-doc-id-999",
        ...mockEvent,
      });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should successfully add an event and return it with an ID using addEvent", async () => {
      const mockEvent = {
        userId: "user-123",
        title: "Systematic Theology Study",
        description: "Reading session",
        startDate: "Timestamp-2026-03-11T14:00:00.000Z",
        endDate: "Timestamp-2026-03-11T16:00:00.000Z",
        category: "study",
      };

      const mockDocRef = { id: "event-id-123" };
      addDoc.mockResolvedValueOnce(mockDocRef);

      const result = await addEvent(mockEvent);

      expect(collection).toHaveBeenCalledWith({}, "events");
      expect(addDoc).toHaveBeenCalledWith(undefined, mockEvent);
      expect(result).toEqual({
        id: "event-id-123",
        ...mockEvent,
      });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should throw an error if addDoc fails", async () => {
      const mockEvent = {
        userId: "user-123",
        title: "Theology Class",
        description: "Introductory seminar",
        startDate: "Timestamp-2026-03-10T17:00:00.000Z",
        endDate: "Timestamp-2026-03-10T18:00:00.000Z",
        category: "personal",
      };

      const mockError = new Error("Firestore write failed");
      addDoc.mockRejectedValueOnce(mockError);

      await expect(addCalendarEvent(mockEvent)).rejects.toThrow("Firestore write failed");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("fetchEvents / getEventsForUserInDateRange", () => {
    it("should successfully fetch events for a user within a date range using fetchEvents", async () => {
      const mockEvents = [
        { id: "1", userId: "user-123", title: "Class 1", description: "Class session", startDate: "Timestamp-2026-03-10T00:00:00.000Z", endDate: "Timestamp-2026-03-10T01:00:00.000Z", category: "personal" },
        { id: "2", userId: "user-123", title: "Class 2", description: "Class session", startDate: "Timestamp-2026-03-11T00:00:00.000Z", endDate: "Timestamp-2026-03-11T01:00:00.000Z", category: "personal" },
      ];

      const mockDocs = mockEvents.map(event => ({
        id: event.id,
        data: () => {
          const { id, ...data } = event;
          return data;
        }
      }));

      const mockQuerySnapshot = {
        forEach: (callback) => mockDocs.forEach(callback),
      };

      getDocs.mockResolvedValueOnce(mockQuerySnapshot);

      const result = await fetchEvents("user-123", "Timestamp-2026-03-09T00:00:00.000Z", "Timestamp-2026-03-12T00:00:00.000Z");

      expect(collection).toHaveBeenCalledWith({}, "events");
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledTimes(3);
      expect(getDocs).toHaveBeenCalled();
      expect(result).toEqual(mockEvents);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should successfully fetch events using getEventsForUserInDateRange", async () => {
      const mockEvents = [
        { id: "3", userId: "user-456", title: "Hermeneutics Lecture", description: "Reading scripture", startDate: "Timestamp-2026-03-10T09:00:00.000Z", endDate: "Timestamp-2026-03-10T10:00:00.000Z", category: "study" },
      ];

      const mockDocs = mockEvents.map(event => ({
        id: event.id,
        data: () => {
          const { id, ...data } = event;
          return data;
        }
      }));

      const mockQuerySnapshot = {
        forEach: (callback) => mockDocs.forEach(callback),
      };

      getDocs.mockResolvedValueOnce(mockQuerySnapshot);

      const result = await getEventsForUserInDateRange("user-456", "Timestamp-2026-03-09T00:00:00.000Z", "Timestamp-2026-03-12T00:00:00.000Z");

      expect(collection).toHaveBeenCalledWith({}, "events");
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledTimes(3);
      expect(getDocs).toHaveBeenCalled();
      expect(result).toEqual(mockEvents);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should throw an error if getDocs fails", async () => {
      const mockError = new Error("Firestore read failed");
      getDocs.mockRejectedValueOnce(mockError);

      await expect(fetchEvents("user-123", "Timestamp-2026-03-09T00:00:00.000Z", "Timestamp-2026-03-12T00:00:00.000Z")).rejects.toThrow("Firestore read failed");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
