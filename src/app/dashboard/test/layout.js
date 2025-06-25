export default function TestLayout({ children }) {
  return (
    <div style={{ border: "2px solid red", padding: "1rem" }}>
      <h2>Test Section</h2>
      {children}
    </div>
  )
}