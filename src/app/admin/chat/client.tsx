"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, UserCircle2, Trash2 } from "lucide-react";

interface ChatMessage {
  id: string;
  session_id: string;
  sender_role: string;
  content: string;
  created_at: string;
}

export function AdminChatClient({ initialSessions }: { initialSessions: string[] }) {
  const [sessions, setSessions] = useState<string[]>(initialSessions);
  const [activeSession, setActiveSession] = useState<string | null>(initialSessions[0] || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Listen for brand new sessions globally
  useEffect(() => {
    const globalChannel = supabase
      .channel("global_chat_listener")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setSessions((prev) => {
            if (!prev.includes(newMsg.session_id)) {
              return [newMsg.session_id, ...prev];
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(globalChannel);
    };
  }, [supabase]);

  // Listen to the active session specifically
  useEffect(() => {
    if (!activeSession) return;

    // Load history
    const fetchHistory = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", activeSession)
        .order("created_at", { ascending: true });
      if (data) setMessages(data as ChatMessage[]);
    };
    fetchHistory();

    // Subscribe to active session
    const channel = supabase
      .channel("active_session_" + activeSession)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${activeSession}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeSession, supabase]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeSession) return;

    const content = newMessage.trim();
    setNewMessage("");

    await supabase.from("chat_messages").insert({
      session_id: activeSession,
      sender_role: "admin",
      content: content,
    });
  };

  const deleteSession = async (e: React.MouseEvent, sessionToDelete: string) => {
    e.stopPropagation();
    
    // Optimistically update UI
    setSessions((prev) => prev.filter(s => s !== sessionToDelete));
    if (activeSession === sessionToDelete) {
      setActiveSession(null);
      setMessages([]);
    }

    // Delete from Supabase backend
    await supabase.from("chat_messages").delete().eq("session_id", sessionToDelete);
  };

  const deleteAllSessions = async () => {
    if (!confirm("Are you sure you want to delete ALL chat history? This cannot be undone.")) return;
    
    // Optimistically update UI
    setSessions([]);
    setActiveSession(null);
    setMessages([]);

    // Delete from Supabase backend
    await supabase.from("chat_messages").delete().not("id", "is", null);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar / Session List */}
      <div className="w-1/3 border-r border-border/50 bg-muted/10 overflow-y-auto">
        <div className="p-4 border-b border-border/50 flex justify-between items-center">
          <h3 className="font-semibold text-foreground">Active Visitors</h3>
          {sessions.length > 0 && (
            <button 
              onClick={deleteAllSessions}
              className="text-xs text-red-500 hover:text-red-600 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4">No active chats.</p>
        ) : (
          <div className="flex flex-col">
            {sessions.map((session) => (
              <button
                key={session}
                onClick={() => setActiveSession(session)}
                className={`flex items-center gap-3 p-4 text-left transition-colors border-b border-border/50 ${
                  activeSession === session ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-muted/50"
                }`}
              >
                <UserCircle2 className="h-8 w-8 text-muted-foreground" />
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    Visitor {session.split("_")[1]}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteSession(e, session)}
                  className="text-muted-foreground hover:text-red-500 transition-colors opacity-50 hover:opacity-100"
                  title="Delete this chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-background">
        {activeSession ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-card flex justify-between items-center">
              <h3 className="font-bold text-foreground">Chat with Visitor {activeSession.split("_")[1]}</h3>
              <button 
                onClick={(e) => deleteSession(e, activeSession)}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                title="Permanently delete this chat history"
              >
                <Trash2 className="h-4 w-4" />
                End Chat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_role === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                      msg.sender_role === "admin"
                        ? "bg-primary text-primary-foreground rounded-tr-sm shadow-sm"
                        : "bg-muted text-foreground rounded-tl-sm border border-border/50 shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-card border-t border-border/50">
              <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a reply to the visitor..."
                  className="flex-1 bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                >
                  <Send className="h-4 w-4" />
                  Reply
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a visitor from the list to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
