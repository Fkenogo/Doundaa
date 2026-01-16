
import React, { useState, useEffect } from 'react';

interface WelcomePageProps {
    onGetStarted: () => void;
}

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1000',
        headline: "Let's Doundaa! 🔥",
        copy: "Find activities near you. Match with adventurers. Show up together."
    },
    {
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000',
        headline: "Discover What's Happening",
        copy: "From hiking Mount Kigali to brunch clubs, find your next adventure."
    },
    {
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
        headline: "Find Your Crew 👥",
        copy: "See who else wants to doundaa. Connect with your adventure squad."
    },
    {
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000',
        headline: "Just Show Up 📍",
        copy: "No bookings. No payments. Just discover, match, and coordinate. Free forever."
    }
];

const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);

    const SLIDE_DURATION = 5000; // 5 seconds per slide

    useEffect(() => {
        // If we are on the last slide, we might want to stop auto-advancing 
        // to avoid calling onGetStarted multiple times if the navigation is delayed.
        // However, standard behavior is to finish the progress bar.
        
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
            
            setProgress(newProgress);

            if (newProgress >= 100) {
                clearInterval(interval);
                handleNext();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [currentSlide]);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
            setProgress(0);
        } else {
            onGetStarted();
        }
    };

    const handleSkip = () => onGetStarted();

    // Defensive check to prevent out-of-bounds access
    const safeSlideIndex = Math.min(Math.max(0, currentSlide), slides.length - 1);
    const activeSlide = slides[safeSlideIndex];

    if (!activeSlide) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans overflow-hidden">
            {/* 
                Main Mobile-Proportioned Container 
                On desktop, it looks like a mobile phone frame. 
                On mobile, it takes the full screen.
                Width adjusted to 430px (Max iPhone size) to match proportions.
            */}
            <div className="relative w-full max-w-[430px] h-[100dvh] sm:h-[844px] bg-black text-white sm:rounded-[48px] overflow-hidden shadow-2xl sm:border-[8px] sm:border-gray-800 transition-all duration-500">
                
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                    <img 
                        key={activeSlide.image}
                        src={activeSlide.image} 
                        alt="Background" 
                        className="w-full h-full object-cover animate-fade-in-up"
                        style={{ animationDuration: '0.8s' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90"></div>
                </div>

                {/* Top Overlay UI: Story-style Progress Bars */}
                <header className="relative z-20 px-6 pt-12">
                    <div className="flex space-x-1.5 h-1">
                        {slides.map((_, index) => (
                            <div key={index} className="flex-1 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-white transition-none"
                                    style={{ 
                                        width: index < safeSlideIndex ? '100%' : index === safeSlideIndex ? `${progress}%` : '0%' 
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button 
                            onClick={handleSkip} 
                            className="text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full border border-white/10 active:scale-95 transition-all"
                        >
                            Skip
                        </button>
                    </div>
                </header>

                {/* Bottom Content Area */}
                <main className="absolute bottom-0 left-0 right-0 z-10 p-8 pb-14 sm:pb-16 flex flex-col justify-end">
                    
                    <div className="space-y-4 mb-8 animate-fade-in-up">
                        <h2 className="text-4xl font-black leading-tight tracking-tight drop-shadow-lg">
                            {activeSlide.headline}
                        </h2>
                        <p className="text-lg font-medium text-white/80 leading-relaxed drop-shadow-md max-w-[300px]">
                            {activeSlide.copy}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleNext}
                            className="w-full bg-transparent text-white border-2 border-white font-bold py-4 px-6 rounded-2xl active:bg-white active:text-black transition-all text-lg shadow-xl flex items-center justify-center hover:bg-white/10"
                        >
                            <span>{safeSlideIndex === slides.length - 1 ? "Get Started" : "Next"}</span>
                        </button>

                        <div className="flex justify-center space-x-2 pt-2">
                             {slides.map((_, index) => (
                                <div 
                                    key={index} 
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === safeSlideIndex ? 'bg-white scale-125' : 'bg-white/30'}`} 
                                />
                             ))}
                        </div>
                    </div>
                </main>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full z-20"></div>
                <div className="hidden sm:block absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/40 backdrop-blur-md rounded-full border border-white/5 z-50"></div>
            </div>
        </div>
    );
};

export default WelcomePage;
