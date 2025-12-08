import React, { useState, useEffect } from 'react';

interface WelcomePageProps {
    onGetStarted: () => void;
}

const slides = [
    {
        illustration: 'https://picsum.photos/seed/welcome-hike/400/400',
        headline: "Let's Doundaa! 🔥",
        copy: "Find activities near you. Match with adventurers. Show up together."
    },
    {
        illustration: 'https://picsum.photos/seed/welcome-feed/400/400',
        headline: "Discover What's Happening",
        copy: "From hiking Mount Kigali to brunch clubs, find your next adventure."
    },
    {
        illustration: 'https://picsum.photos/seed/welcome-crew/400/400',
        headline: "Find Your Crew 👥",
        copy: "See who else wants to doundaa. Connect with your adventure squad."
    },
    {
        illustration: 'https://picsum.photos/seed/welcome-pins/400/400',
        headline: "Just Show Up 📍",
        copy: "No bookings. No payments. Just discover, match, and coordinate. Free forever."
    }
];

const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onGetStarted();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-teal-500 text-white p-6 text-center">
            <header className="flex justify-end">
                <button onClick={onGetStarted} className="text-sm font-semibold">Skip Tour</button>
            </header>

            <main className="flex-1 flex flex-col justify-center">
                <div className="w-64 h-64 mx-auto bg-white/20 rounded-lg mb-12 flex items-center justify-center">
                     <img src={slides[currentSlide].illustration} alt="Welcome illustration" className="w-full h-full object-cover rounded-lg"/>
                </div>
                <h2 className="text-2xl font-bold">{slides[currentSlide].headline}</h2>
                <p className="mt-4 max-w-xs mx-auto">{slides[currentSlide].copy}</p>
            </main>

            <footer className="space-y-4 pb-4">
                <div className="flex justify-center space-x-2">
                    {slides.map((_, index) => (
                        <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}></button>
                    ))}
                </div>
                <button
                    onClick={handleNext}
                    className="w-full bg-white text-teal-600 font-bold py-4 px-6 rounded-xl hover:bg-gray-100 transition-colors text-lg shadow-lg"
                >
                    {currentSlide === slides.length - 1 ? "Get Started →" : "Next →"}
                </button>
            </footer>
        </div>
    );
};

export default WelcomePage;