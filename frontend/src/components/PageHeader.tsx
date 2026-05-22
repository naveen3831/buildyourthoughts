const PageHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <section className="relative h-44 md:h-96 flex items-center justify-center text-center overflow-hidden border-b border-border">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-secondary/10" />
    <div className="absolute inset-0 bg-card/30 dark:bg-transparent" />
    <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/12 blur-3xl" />
    <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-secondary/12 blur-3xl" />
    <div
      className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />

    <div className="relative z-10 animate-fade-in-up px-4">
      <h1 className="text-2xl md:text-5xl font-heading font-bold text-foreground mb-2 md:mb-3 tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base leading-relaxed font-medium">
          {subtitle}
        </p>
      )}
    </div>
  </section>
);

export default PageHeader;
