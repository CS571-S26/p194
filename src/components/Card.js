export default function Card({ children, className = "" }) {
  return <section className={`app-card ${className}`.trim()}>{children}</section>;
}
