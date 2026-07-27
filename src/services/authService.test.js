import {
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  logout,
  onAuthStateChangedListener
} from "./authService";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn()
}));

jest.mock("../firebase", () => ({
  auth: {},
}));

describe("authService", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("registerWithEmailAndPassword", () => {
    it("should successfully register a user", async () => {
      const mockUser = { uid: "user-123", email: "test@example.com" };
      createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

      const user = await registerWithEmailAndPassword("test@example.com", "password123");

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith({}, "test@example.com", "password123");
      expect(user).toEqual(mockUser);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should throw an error if registration fails", async () => {
      const mockError = new Error("Registration failed");
      createUserWithEmailAndPassword.mockRejectedValueOnce(mockError);

      await expect(registerWithEmailAndPassword("test@example.com", "password123")).rejects.toThrow("Registration failed");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("loginWithEmailAndPassword", () => {
    it("should successfully log in a user", async () => {
      const mockUser = { uid: "user-123", email: "test@example.com" };
      signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

      const user = await loginWithEmailAndPassword("test@example.com", "password123");

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, "test@example.com", "password123");
      expect(user).toEqual(mockUser);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should throw an error if login fails", async () => {
      const mockError = new Error("Login failed");
      signInWithEmailAndPassword.mockRejectedValueOnce(mockError);

      await expect(loginWithEmailAndPassword("test@example.com", "password123")).rejects.toThrow("Login failed");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should successfully log out the user", async () => {
      signOut.mockResolvedValueOnce();

      await logout();

      expect(signOut).toHaveBeenCalledWith({});
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should throw an error if logout fails", async () => {
      const mockError = new Error("Logout failed");
      signOut.mockRejectedValueOnce(mockError);

      await expect(logout()).rejects.toThrow("Logout failed");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("onAuthStateChangedListener", () => {
    it("should attach auth state change listener and return unsubscribe function", () => {
      const mockUnsubscribe = jest.fn();
      onAuthStateChanged.mockReturnValueOnce(mockUnsubscribe);

      const callback = jest.fn();
      const unsubscribe = onAuthStateChangedListener(callback);

      expect(onAuthStateChanged).toHaveBeenCalledWith({}, callback);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
});
