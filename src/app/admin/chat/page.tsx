import { createClient } from "@/lib/supabase/server";
import { AdminChatClient } from "./client";

export default async function AdminChatPage() {
  const supabase = await createClient();
  
  // Fetch all sessions (we just get distinct sessions by fetching all messages)
  // In a real app we'd have a separate 'sessions' table or use RPC, but this is simple and fine for low traffic
  const { data: messages } = await supabase
    .from("chat_messages")
    .select("session_id, created_at, content")
    .order("created_at", { ascending: false });

  // Group into sessions: array of unique session IDs
  const sessionSet = new Set<string>();
  const activeSessions: string[] = [];

  if (messages) {
    messages.forEach((msg) => {
      if (!sessionSet.has(msg.session_id)) {
        sessionSet.add(msg.session_id);
        activeSessions.push(msg.session_id);
      }
    });
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Live Chat</h1>
        <p className="text-muted-foreground mt-2">Communicate with website visitors in real-time.</p>
      </div>
      
      <div className="flex-1 min-h-[600px] border border-border/50 rounded-xl overflow-hidden shadow-sm bg-card">
        <AdminChatClient initialSessions={activeSessions} />
      </div>
    </div>
  );
}
