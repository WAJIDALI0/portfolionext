import { FadeUp } from "@/components/animations/fade-up";
import { ContactForm } from "@/features/contact/components/ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="relative container mx-auto py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16">
        <FadeUp delay={0.1} className="flex-1">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground mb-6">
            Get In Touch
          </h2>
          <p className="text-muted-foreground md:text-xl leading-relaxed mb-8">
            Whether you have a complex IT infrastructure challenge or a visionary software project, I'm ready to help you build it securely and at scale.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-foreground/80">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-lg">📧</span>
              </div>
              <span className="font-medium">Direct Inquiry</span>
            </div>
            <div className="flex items-center gap-4 text-foreground/80">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <span className="font-medium">Fast Response Times</span>
            </div>
          </div>
        </FadeUp>
        
        <FadeUp delay={0.3} className="flex-1">
          <div className="bg-card rounded-3xl p-8 sm:p-10 shadow-xl border border-border/50">
            <ContactForm />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
