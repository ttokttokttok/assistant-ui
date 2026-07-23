export default function Page() {
  return (
    <main className="flex min-h-screen min-w-0 items-center justify-center bg-[var(--background)] p-4 text-[var(--foreground)] sm:p-6">
      <section className="max-w-xl min-w-0 flex-1 rounded-3xl border border-[var(--border)] bg-[var(--muted)]/40 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-[var(--muted-foreground)]">
          Learn Mode prototype
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight break-words">
          Welcome to assistant-ui
        </h1>
        <p className="mt-4 leading-7 text-[var(--muted-foreground)]">
          This placeholder is the complete first stage. Continue to see it
          become a working assistant.
        </p>
      </section>
    </main>
  );
}
