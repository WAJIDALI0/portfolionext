import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { Mail, Trash2, CheckCircle2 } from "lucide-react";
import { markAsRead, deleteMessage } from "@/app/actions/admin";
import { DeleteButton } from "./delete-button";

export default async function ContactsPage() {
  const supabase = await createClient();
  
  const { data: contacts, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-xl">
        Failed to load contacts: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Contact Submissions</h1>
        <p className="text-muted-foreground mt-2">Manage inquiries received from your portfolio.</p>
      </div>

      <div className="grid gap-4">
        {contacts?.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border/50 text-muted-foreground">
            No messages received yet.
          </div>
        ) : (
          contacts?.map((contact) => (
            <div 
              key={contact.id} 
              className={`bg-card border p-6 rounded-xl shadow-sm transition-all relative ${
                contact.read ? "border-border/50 opacity-80" : "border-primary/50"
              }`}
            >
              {!contact.read && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">New</span>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{contact.name}</h3>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="text-sm text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors mt-1"
                  >
                    <Mail className="h-4 w-4" />
                    {contact.email}
                  </a>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })}
                </div>
              </div>

              <div className="bg-background/50 p-4 rounded-lg border border-border/50 mb-6">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {contact.message}
                </p>
              </div>

              <div className="flex gap-3 justify-end border-t border-border/50 pt-4 mt-4">
                {!contact.read && (
                  <form action={markAsRead.bind(null, contact.id)}>
                    <button 
                      type="submit" 
                      className="flex items-center gap-2 text-sm px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark as Read
                    </button>
                  </form>
                )}
                <form action={deleteMessage.bind(null, contact.id)}>
                  <DeleteButton />
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
