export default function PartnershipProcess() {
  const process = [
    {
      title: "Application & Approval",
      description: "Submit your institution’s profile for review.",
    },
    {
      title: "Accreditation & Agreement",
      description:
        "Pay accreditation fee and receive UK accreditation certificate.",
    },
    {
      title: "Staff Training & Onboarding",
      description: "Faculty training and access to academic resources.",
    },
    {
      title: "Program Delivery",
      description: "Start enrolling students and delivering courses.",
    },
    {
      title: "Examination & Certification",
      description:
        "Assessments conducted under UK standards, with successful students awarded accredited diplomas.",
    },
  ];
  return (
    <>
      <div className="flex gap-5 lg:gap-24 lg:flex-row flex-col max-w-7xl mx-auto">
        <aside className="lg:sticky h-fit lg:top-32 ">
          <div className="space-y-2 md:space-y-3 lg:space-y-5 text-left">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-[#204081] leading-tight">
              Partnership Process
            </h1>
            <p className="text-[#262a2b]">
              As a Partner Center of UK Colleges, your institution will gain:
            </p>
          </div>
        </aside>

        <div className="space-y-3 md:space-y-5">
          {process.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-6 md:gap-8 p-3 md:p-5 rounded-lg border border-gray-300 shadow-sm bg-white hover:shadow-md hover:scale-[1.02] transition-all ease-in-out duration-300 items-center"
            >
              <span
                className="text-4xl lg:text-5xl font-bold text-transparent 
             [-webkit-text-stroke:2px_#204081] pointer-events-none"
              >
                {(idx + 1).toString().padStart(2, "0")}
              </span>
              <div>
                <p className="font-semibold text-[#262a2b] text-base md:text-lg mb-1 md:mb-2">
                  {item.title}
                </p>
                <p className="text-[#262a2b] text-sm md:text-base">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
