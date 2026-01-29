import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            </div>
            
            <div className="relative">
              <h1 className="text-9xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-bounce">
                404
              </h1>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
            </div>
            
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Oops! The page you're looking for seems to have wandered off. 
              It might have been moved or deleted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button 
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Back to Home
            </button>
          </div>

          <div className="pt-12">
            <div className="flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}