'use client';

import { Star } from "lucide-react";

export default function Reviews() {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at Google",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      content:
        "PrepView was a game-changer for my interview prep. The AI feedback was incredibly accurate and helped me identify weak spots I didn't know I had.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Frontend Developer at Amazon",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      content:
        "The real-time coding environment is fantastic. It feels just like a real interview, but with instant feedback. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Data Scientist at Netflix",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      content:
        "I used PrepView to practice for my data science interviews. The variety of questions and the depth of the AI analysis were impressive.",
      rating: 5,
    },
    {
      name: "David Wilson",
      role: "Full Stack Developer at Meta",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      content:
        "The system design questions were particularly helpful. It's hard to find good resources for that, but PrepView nailed it.",
      rating: 5,
    },
    {
      name: "Jessica Brown",
      role: "DevOps Engineer at Microsoft",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      content:
        "Great platform for practicing behavioral questions too. The AI gave me great tips on how to structure my answers using the STAR method.",
      rating: 5,
    },
  ];

  return (
    <section id="reviews" className="py-20 bg-[#0B0F19] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center relative z-10">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Developers</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of engineers who have landed their dream jobs with PrepView.
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0B0F19] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0B0F19] to-transparent z-10"></div>

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[...reviews, ...reviews, ...reviews, ...reviews].map((review, index) => (
            <div
              key={index}
              className="w-[400px] mx-4 bg-[#131B2C] border border-white/5 p-6 rounded-2xl hover:border-primary-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 leading-relaxed text-sm">
                  &quot;{review.content}&quot;
                </p>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full border-2 border-primary-500/20"
                />
                <div>
                  <h4 className="text-white font-bold">{review.name}</h4>
                  <p className="text-primary-400 text-sm">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
