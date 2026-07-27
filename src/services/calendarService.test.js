import { addCalendarEvent, fetchEvents } from "./calendarService";
import { addDoc, getDocs, query, where, collection } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
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

  describe("addCalendarEvent", () => {
    it("should successfully add an event and return it with an ID", async () => {
      const mockEvent = {
        userId: "user-123",
        title: "Theology Class",
        date: "2026-03-10",
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

    it("should throw an error if addDoc fails", async () => {
      const mockEvent = {
        userId: "user-123",
        title: "Theology Class",
        date: "2026-03-10",
      };

      const mockError = new Error("Firestore write failed");
      addDoc.mockRejectedValueOnce(mockError);

      await expect(addCalendarEvent(mockEvent)).rejects.toThrow("Firestore write failed");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("fetchEvents", () => {
    it("should successfully fetch events for a user within a date range", async () => {
      const mockEvents = [
        { id: "1", userId: "user-123", title: "Class 1", date: "2026-03-10" },
        { id: "2", userId: "user-123", title: "Class 2", date: "2026-03-11" },
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

      const result = await fetchEvents("user-123", "2026-03-09", "2026-03-12");

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

      await expect(fetchEvents("user-123", "2026-03-09", "2026-03-12")).rejects.toThrow("Firestore read failed");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
