import { Star } from "lucide-react";

const Testimonials = () => {
  const reviewsRow1 = [
    {
      name: "Rahul Sharma",
      role: "Software Engineer at Amazon",
      comment:
        "The 1-on-1 mock interviews on GuideX completely changed how I approach system design rounds. Highly recommended!",
      rating: 5,
      avatar: "RS",
    },
    {
      name: "Ananya Verma",
      role: "Product Manager at Microsoft",
      comment:
        "My mentor gave me actionable advice on resume structuring and product case studies that landed me multiple offers.",
      rating: 5,
      avatar: "AV",
    },
    {
      name: "Karan Patel",
      role: "Data Scientist at Google",
      comment:
        "Incredible platform! Having direct access to leaders working in top tech companies made all the difference.",
      rating: 5,
      avatar: "KP",
    },
    {
      name: "Neha Singh",
      role: "Frontend Engineer at Flipkart",
      comment:
        "The code reviews and architecture suggestions from my mentor saved me months of trial and error.",
      rating: 5,
      avatar: "NS",
    },
  ];

  const reviewsRow2 = [
    {
      name: "Vikram Malhotra",
      role: "Data Engineer at Swiggy",
      comment:
        "Scaling up my data pipelines knowledge became so much easier with direct guidance from industry veterans.",
      rating: 5,
      avatar: "VM",
    },
    {
      name: "Priya Iyer",
      role: "UI/UX Designer at Adobe",
      comment:
        "Portfolio reviews here are unmatched. Every feedback session gave me clear visual and tactical improvements.",
      rating: 5,
      avatar: "PI",
    },
    {
      name: "Amit Deshmukh",
      role: "Backend Lead at Microsoft",
      comment:
        "A phenomenal ecosystem for anyone serious about breaking into top-tier tech firms.",
      rating: 5,
      avatar: "AD",
    },
    {
      name: "Sneha Roy",
      role: "AI Researcher at Meta",
      comment:
        "The guidance on complex machine learning deployment pipelines was extremely professional and practical.",
      rating: 5,
      avatar: "SR",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 font-sans overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-full">
            SUCCESS STORIES
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Trusted by{" "}
            <span className="text-blue-600">Thousands of Students</span>
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            See how our learners transformed their careers with expert
            mentorship.
          </p>
        </div>
      </div>

      {/* Infinite Marquee Sliders */}
      <div className="relative w-full flex flex-col gap-6 overflow-hidden py-2">
        {/* Gradient Fades for Smooth Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* ROW 1: Moves Left to Right */}
        <div className="flex w-max animate-marquee space-x-6 px-3">
          {[...reviewsRow1, ...reviewsRow1, ...reviewsRow1].map(
            (review, index) => (
              <div
                key={`row1-${index}`}
                className="w-[340px] shrink-0 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-blue-300 transition"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={15} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {review.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{review.role}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* ROW 2: Moves Right to Left */}
        <div className="flex w-max animate-marquee-reverse space-x-6 px-3">
          {[...reviewsRow2, ...reviewsRow2, ...reviewsRow2].map(
            (review, index) => (
              <div
                key={`row2-${index}`}
                className="w-[340px] shrink-0 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-blue-300 transition"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={15} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {review.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{review.role}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Marquee Keyframe Animations */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-reverse {
          display: flex;
          width: max-content;
          animation: marquee-reverse 35s linear infinite;
        }
        .animate-marquee:hover, .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
