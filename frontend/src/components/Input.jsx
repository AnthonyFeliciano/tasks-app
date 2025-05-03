export default function Input({ type = "text", placeholder, ...props }) {
    return (
      <input
        type={type}
        placeholder={placeholder}
        className="border rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
        {...props}
      />
    );
  }
  