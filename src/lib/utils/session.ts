export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = localStorage.getItem("chat_session_id");
  if (!sessionId) {
    // Generate a simple random string for visitor identification
    sessionId = "visitor_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("chat_session_id", sessionId);
  }
  return sessionId;
}
