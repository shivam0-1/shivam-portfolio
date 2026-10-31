// Coloured phrase inside a headline. Ember by default; pass a colour class to override.
const Accent = ({ children, className = "" }) => (
  <span className={className || "text-signal"}>{children}</span>
);

export default Accent;
