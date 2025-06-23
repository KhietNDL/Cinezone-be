// Session Manager for Password Reset Flow
class SessionManager {
  static SESSION_KEY = "verificationSession";
  static EMAIL_KEY = "resetEmail";
  static SESSION_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

  // Create a new verification session
  static createSession(email, resetCode) {
    const session = {
      email: email,
      verified: true,
      verifiedAt: new Date().toISOString(),
      resetCode: resetCode,
      expiresAt: new Date(Date.now() + this.SESSION_DURATION).toISOString(),
      sessionId: this.generateSessionId(),
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(this.EMAIL_KEY, email);

    return session;
  }

  // Get current session
  static getSession() {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);

      // Check if session is expired
      if (new Date() > new Date(session.expiresAt)) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error("Error parsing session:", error);
      this.clearSession();
      return null;
    }
  }

  // Check if user is verified for password reset
  static isVerified() {
    const session = this.getSession();
    return session && session.verified === true;
  }

  // Get verified email
  static getVerifiedEmail() {
    const session = this.getSession();
    return session ? session.email : null;
  }

  // Get reset code from session
  static getResetCode() {
    const session = this.getSession();
    return session ? session.resetCode : null;
  }

  // Check if session is valid and not expired
  static isSessionValid() {
    const session = this.getSession();
    if (!session) return false;

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    return now < expiresAt;
  }

  // Extend session duration
  static extendSession() {
    const session = this.getSession();
    if (!session) return false;

    session.expiresAt = new Date(
      Date.now() + this.SESSION_DURATION
    ).toISOString();
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

    return true;
  }

  // Clear all session data
  static clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    localStorage.removeItem("resetCode");
    localStorage.removeItem("otpVerified");
    localStorage.removeItem("verifiedEmail");
  }

  // Generate unique session ID
  static generateSessionId() {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  // Get remaining time in seconds
  static getRemainingTime() {
    const session = this.getSession();
    if (!session) return 0;

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));

    return remaining;
  }

  // Validate session before allowing password reset
  static validateForPasswordReset() {
    const session = this.getSession();

    if (!session) {
      throw new Error(
        "No verification session found. Please verify your email first."
      );
    }

    if (!session.verified) {
      throw new Error(
        "Email not verified. Please complete verification first."
      );
    }

    if (!this.isSessionValid()) {
      this.clearSession();
      throw new Error(
        "Verification session expired. Please verify your email again."
      );
    }

    return session;
  }

  // Store email for reset process
  static storeEmail(email) {
    localStorage.setItem(this.EMAIL_KEY, email);
  }

  // Get stored email
  static getStoredEmail() {
    return localStorage.getItem(this.EMAIL_KEY);
  }
}

export default SessionManager;
