"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, User, Bot, Shield, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleChat, incrementUnreadMessages, clearUnreadMessages } from "@/lib/store/slices/uiSlice";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateSessionId } from "@/lib/utils/session";
import { chatWithGemini } from "@/app/actions/ai-actions";

interface ChatMessage {
  id: string;
  session_id: string;
  sender_role: string;
  content: string;
  created_at: string;
}

export function ChatWidget() {
  const dispatch = useAppDispatch();
  const isChatOpen = useAppSelector((state) => state.ui.isChatOpen);
  const unreadCount = useAppSelector((state) => state.ui.unreadChatMessages);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);

    // Fetch initial messages for this session
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", id)
        .order("created_at", { ascending: true });
      
      if (data) setMessages(data as ChatMessage[]);
    };
    fetchMessages();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("chat_room_" + id)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${id}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
          
          // If message is from admin and chat is closed, increment unread count
          if (newMsg.sender_role === "admin") {
            dispatch(incrementUnreadMessages());
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dispatch, supabase]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  const handleToggle = () => {
    dispatch(toggleChat());
    if (!isChatOpen) {
      dispatch(clearUnreadMessages());
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    const content = newMessage.trim();
    setNewMessage(""); // Optimistic clear

    if (isAiMode) {
      // 1. Add visitor message locally instantly
      const localVisitorMsg: ChatMessage = {
        id: "local_" + Date.now(),
        session_id: sessionId,
        sender_role: "visitor",
        content: content,
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, localVisitorMsg]);
      
      // 2. Call Gemini API
      setIsAiTyping(true);
      const res = await chatWithGemini(content);
      setIsAiTyping(false);
      
      // 3. Add AI response locally
      const aiResponseMsg: ChatMessage = {
        id: "ai_" + Date.now(),
        session_id: sessionId,
        sender_role: "ai",
        content: res.success ? res.text! : res.error!,
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, aiResponseMsg]);
      
    } else {
      // Standard Live Chat via Supabase
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        sender_role: "visitor",
        content: content,
      });
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-background border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex flex-col gap-3 text-primary-foreground">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold flex items-center gap-1.5">
                    {isAiMode ? (
                      <>AI Assistant <Sparkles className="h-4 w-4 text-purple-400" /></>
                    ) : "Live Chat"}
                  </h3>
                  <p className="text-xs opacity-80">
                    {isAiMode ? "Ask me about Wajid's skills!" : "Ask me anything!"}
                  </p>
                </div>
                <button onClick={handleToggle} className="hover:bg-primary-foreground/20 p-1 rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* AI Toggle Switch */}
              <div className="flex items-center gap-2 bg-primary-foreground/10 p-1 rounded-lg w-full">
                <button
                  onClick={() => setIsAiMode(false)}
                  className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${!isAiMode ? "bg-background text-foreground shadow-sm" : "opacity-70 hover:opacity-100"}`}
                >
                  Admin
                </button>
                <button
                  onClick={() => setIsAiMode(true)}
                  className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${isAiMode ? "bg-background text-foreground shadow-sm" : "opacity-70 hover:opacity-100"}`}
                >
                  AI Bot
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <MessageCircle className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-sm text-center px-4">
                    {isAiMode 
                      ? "Hi! I'm an AI trained on Wajid's resume. Ask me about his experience!" 
                      : "Send a message to start chatting!"}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 items-end ${msg.sender_role === "visitor" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center shadow-sm ${
                      msg.sender_role === "visitor" ? "bg-primary text-primary-foreground" :
                      msg.sender_role === "ai" ? "bg-purple-500 text-white" :
                      "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {msg.sender_role === "visitor" ? <User className="h-3.5 w-3.5" /> :
                       msg.sender_role === "ai" ? <Bot className="h-3.5 w-3.5" /> :
                       <Shield className="h-3.5 w-3.5" />}
                    </div>

                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                        msg.sender_role === "visitor"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : msg.sender_role === "ai" 
                            ? "bg-purple-500/10 border border-purple-500/20 text-foreground rounded-bl-sm shadow-sm"
                            : "bg-card border border-border/50 text-foreground rounded-bl-sm shadow-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isAiTyping && (
                <div className="flex gap-2 items-end flex-row">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center shadow-sm bg-purple-500 text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background border-t border-border/50">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-muted/50 border border-border/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-primary text-primary-foreground p-2.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg relative flex items-center justify-center"
      >
        {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        
        {/* Unread Badge */}
        {!isChatOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background animate-in zoom-in">
            {unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}
