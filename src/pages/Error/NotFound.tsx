import { Link } from 'react-router'

const NotFound = () => {
    return (
        <div className="w-full min-h-screen flex items-center justify-center px-4 bg-[#0F0F14] text-white overflow-hidden">
            <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#171720] overflow-hidden shadow-2xl">
                
                {/* Glow Effect */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#C667F7] opacity-20 blur-3xl rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#C667F7] opacity-10 blur-3xl rounded-full" />

                <div className="relative z-10 flex flex-col items-center text-center px-6 py-14 sm:px-10">
                    
                    {/* 404 */}
                    <h1 className="text-7xl sm:text-8xl font-black tracking-widest text-[#C667F7] drop-shadow-lg">
                        *-*
                    </h1>

                    {/* Subtitle */}
                    <h2 className="mt-4 text-2xl sm:text-3xl font-bold">
                        Page Not Found
                    </h2>

                    <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-md leading-relaxed">
                        This page maybe not found, If it's not correct contact developer
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-10 w-full sm:w-auto">
                        <Link
                            to="/"
                            className="px-6 py-3 rounded-2xl bg-[#C667F7] hover:brightness-110 transition-all duration-200"
                        >
                            Restart App
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound