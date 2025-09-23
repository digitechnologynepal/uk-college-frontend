export default function WhyPartnerWithUs() {
  const gains = [
    {
      title: "Accredited Partnership",
      description:
        "Recognition as an accredited partner of established UK awarding bodies.",
    },
    {
      title: "Blended Learning through Virtual Campus",
      description:
        "Access to a digital platform enabling institutions to deliver programmes in both online and face-to-face modes.",
    },
    {
      title: "Academic Support",
      description:
        "Provision of link tutors and academic resources to ensure quality delivery of courses.",
    },
    {
      title: "Global Network & Mobility",
      description:
        "Opportunities for faculty and students to participate in international academic tours across 50+ partner countries.",
    },
    {
      title: "University Progression Pathways",
      description:
        "Students can transfer credits to universities in the UK, Europe, Australia, New Zealand, and the USA.",
    },
    {
      title: "Scholarships",
      description:
        "Special scholarships for meritorious students to enhance accessibility and affordability.",
    },
    {
      title: "Ongoing Training & Development",
      description:
        "Regular academic training sessions and workshops for faculty and administrative staff.",
    },
    {
      title: "Technology Support",
      description:
        "Access to a comprehensive college management software for student enrollment, monitoring, and assessments.",
    },
  ];

  return (
    <>
      <div className="flex gap-5 lg:gap-24 lg:flex-row flex-col max-w-7xl mx-auto">
        <aside className="lg:sticky h-fit lg:top-32 ">
          <div className="space-y-2 md:space-y-3 lg:space-y-5 text-left">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-[#204081] leading-tight">
              Why Partner With Us
            </h1>
            <p className="text-[#262a2b]">
              As a Partner Center of UK Colleges, your institution will gain:
            </p>
          </div>
        </aside>
        <div className="space-y-3 md:space-y-5">
          {gains.map((item, idx) => (
            <div
              key={idx}
              className="p-3 md:p-5 rounded-lg border border-gray-300 shadow-sm bg-white hover:shadow-md hover:scale-[1.02] transition-all ease-in-out duration-300"
            >
              <p className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-[#262a2b]">
                {item.title}
              </p>
              <p className="text-[#262a2b] text-sm md:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
