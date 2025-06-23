import { useState, useEffect } from "react";
import SessionManager from "../utils/sessionManager";

export const useSession = () => {
  const [session, setSession] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      try {
        const currentSession = SessionManager.getSession();
        if (currentSession) {
          setSession(currentSession);
          setIsValid(true);
          setError(null);
        } else {
          setSession(null);
          setIsValid(false);
          setError("No active session found");
        }
      } catch (err) {
        setSession(null);
        setIsValid(false);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up interval to check session validity every minute
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, []);

  const createSession = (email, resetCode) => {
    try {
      const newSession = SessionManager.createSession(email, resetCode);
      setSession(newSession);
      setIsValid(true);
      setError(null);
      return newSession;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearSession = () => {
    SessionManager.clearSession();
    setSession(null);
    setIsValid(false);
    setError(null);
  };

  const extendSession = () => {
    try {
      const extended = SessionManager.extendSession();
      if (extended) {
        setSession(SessionManager.getSession());
      }
      return extended;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const validateForPasswordReset = () => {
    try {
      const validSession = SessionManager.validateForPasswordReset();
      setSession(validSession);
      setIsValid(true);
      setError(null);
      return validSession;
    } catch (err) {
      setError(err.message);
      setIsValid(false);
      throw err;
    }
  };

  const getRemainingTime = () => {
    return SessionManager.getRemainingTime();
  };

  return {
    session,
    isValid,
    isLoading,
    error,
    createSession,
    clearSession,
    extendSession,
    validateForPasswordReset,
    getRemainingTime,
    getVerifiedEmail: () => session?.email || null,
    getResetCode: () => session?.resetCode || null,
  };
};
