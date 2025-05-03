export default function AuthCard({ title, children }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-700 p-6">
        <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md animate-fade-in">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-tight">
            {title}
          </h2>
          {children}
        </div>
      </div>
    );
  }
  