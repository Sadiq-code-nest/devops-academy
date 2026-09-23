export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-prefix">Dev</span>
          <span className="brand-suffix">Ops</span>
          <span className="brand-dot">.</span>Academy
        </div>
        <div className="footer-links">
          {[['#home','Home'],['#curriculum','Curriculum'],
            ['#projects','Projects'],['#pricing','Enroll']].map(([href, label]) => (
            <a key={label} href={href}>{label}</a>
          ))}
        </div>
        <div className="footer-copy">
          © 2025 DevOps Academy. Built with the tools we teach.
        </div>
      </div>
    </footer>
  );
}
