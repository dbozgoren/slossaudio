export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-text-dim">
          &copy; {new Date().getFullYear()} Sloss Audio. Seattle, WA.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://www.imdb.com/name/nm9069950/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-text-dim hover:text-accent transition-colors no-underline"
          >
            IMDB
          </a>
          <a
            href="mailto:brian@slossaudio.com"
            className="font-mono text-xs text-text-dim hover:text-accent transition-colors no-underline"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
