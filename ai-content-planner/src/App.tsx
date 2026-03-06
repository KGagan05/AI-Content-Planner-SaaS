import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@insforge/react';
import Dashboard from './components/Dashboard.tsx';

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-6 drop-shadow-xl animate-fade-in-up">
        AI Content Planner SaaS
      </h1>
      <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-100">
        Stop staring at a blank page. Enter a topic, and let our AI engine instantly generate production-ready content ideas, perfectly organized and ready for you to build upon.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
        <SignInButton>
          <button className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all w-full sm:w-auto hover:scale-105 active:scale-95">
            Get Started
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="px-8 py-4 rounded-full font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all w-full sm:w-auto">
            Create Free Account
          </button>
        </SignUpButton>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl opacity-80">
        {[
          { icon: '🚀', title: 'Instant Ideas', desc: 'Get 5 tailored content angles in seconds.' },
          { icon: '🔄', title: 'Real-time Sync', desc: 'Edits save instantly and collaborate easily.' },
          { icon: '🔗', title: 'Shareable Dashboard', desc: 'Share your plans easily with a public link.' }
        ].map((feat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="text-4xl mb-4">{feat.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
            <p className="text-gray-400 text-sm">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-sans">
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              CP
            </div>
            <span className="font-bold text-xl tracking-tight">ContentPlanner</span>
          </div>
          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <button className="text-sm font-medium hover:text-indigo-400 transition-colors">Log in</button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <SignedIn>
          <Dashboard />
        </SignedIn>

        <SignedOut>
          <Hero />
        </SignedOut>
      </main>
    </div>
  );
}

export default App;
