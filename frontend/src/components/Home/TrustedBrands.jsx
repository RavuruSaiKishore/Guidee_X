import React from "react";

const TrustedBrands = () => {
  const row1Companies = [
    {
      name: "Google",
      logo: "https://www.vectorlogo.zone/logos/google/google-icon.svg",
    },
    {
      name: "Microsoft",
      logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg",
    },
    {
      name: "Amazon",
      logo: "https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg",
    },
    {
      name: "Flipkart",
      logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/flipkart-icon.svg",
    },
    {
      name: "Swiggy",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg", // Fallback representative clean icon if needed
      // Using reliable domain-based favicon/logo helper as direct backup:
      fallbackImg:
        "https://www.google.com/s2/favicons?domain=swiggy.com&sz=128",
    },
    {
      name: "IIT Bombay",
      fallbackImg:
        "https://www.google.com/s2/favicons?domain=iitb.ac.in&sz=128",
    },
  ];

  const row2Companies = [
    {
      name: "Apple",
      logo: "https://www.vectorlogo.zone/logos/apple/apple-icon.svg",
    },
    {
      name: "Meta",
      logo: "https://www.vectorlogo.zone/logos/meta/meta-icon.svg",
    },
    {
      name: "Netflix",
      logo: "https://www.vectorlogo.zone/logos/netflix/netflix-icon.svg",
    },
    {
      name: "Adobe",
      logo: "https://www.vectorlogo.zone/logos/adobe/adobe-icon.svg",
    },
    {
      name: "Uber",
      logo: "https://www.vectorlogo.zone/logos/uber/uber-icon.svg",
    },
    {
      name: "LinkedIn",
      logo: "https://www.vectorlogo.zone/logos/linkedin/linkedin-icon.svg",
    },
  ];

  const renderCompanyCard = (company, index, rowId) => {
    const primarySource = company.logo || company.fallbackImg;

    return (
      <div
        key={`${rowId}-${index}`}
        className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-slate-200/85 text-slate-800 font-bold text-xs shadow-sm hover:border-blue-300 transition shrink-0 min-w-[160px] justify-center"
      >
        {primarySource ? (
          <img
            src={primarySource}
            alt={company.name}
            className="w-5 h-5 object-contain"
            onError={(e) => {
              // If primary fails and a fallback exists, try it once
              if (
                company.fallbackImg &&
                e.currentTarget.src !== company.fallbackImg
              ) {
                e.currentTarget.src = company.fallbackImg;
              } else {
                // If everything fails, hide the broken image tag and show a fallback letter badge dynamically
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector(".fallback-badge")) {
                  const badge = document.createElement("div");
                  badge.className =
                    "w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-extrabold fallback-badge";
                  badge.innerText = company.name.charAt(0);
                  parent.insertBefore(badge, parent.firstChild);
                }
              }
            }}
          />
        ) : null}
        <span className="tracking-wide">{company.name}</span>
      </div>
    );
  };

  return (
    <section className="bg-white py-16 border-y border-slate-100 font-sans overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Mentors & Alumni working at top global companies & institutions
        </p>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full flex flex-col gap-6 overflow-hidden py-2">
        {/* Gradient Fades for Smooth Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* ROW 1: Moves Left to Right */}
        <div className="flex w-max animate-marquee space-x-6">
          {[...row1Companies, ...row1Companies, ...row1Companies].map(
            (company, index) => renderCompanyCard(company, index, "row1")
          )}
        </div>

        {/* ROW 2: Moves Right to Left */}
        <div className="flex w-max animate-marquee-reverse space-x-6">
          {[...row2Companies, ...row2Companies, ...row2Companies].map(
            (company, index) => renderCompanyCard(company, index, "row2")
          )}
        </div>
      </div>

      {/* Inline Styles for Custom Continuous Marquee Animations */}
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
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-reverse {
          display: flex;
          width: max-content;
          animation: marquee-reverse 30s linear infinite;
        }
        .animate-marquee:hover, .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TrustedBrands;
