export default function Button({ children, ...props }) {
    return (
      <button
        className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl p-3 font-semibold transition-all"
        {...props}
      >
        {children}
      </button>
    );
  }
  