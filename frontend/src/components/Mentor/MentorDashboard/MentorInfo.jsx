import {
  Briefcase,
  GraduationCap,
  Languages,
  CalendarDays,
  IndianRupee,
  UserCircle2,
  ShieldCheck,
  Building2,
  Globe,
  BadgeCheck,
  Award,
} from "lucide-react";

export default function MentorInfo({ mentor }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ================= Header ================= */}
      <div className="flex flex-col gap-4 border-b bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
            Mentor Information
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Professional profile overview
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 sm:h-12 sm:w-12">
          <UserCircle2 className="h-5 w-5 text-orange-600 sm:h-6 sm:w-6" />
        </div>
      </div>

      <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        {/* ================= Professional Information ================= */}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-2 border-b bg-gray-50 px-4 py-3 sm:px-5">
            <Briefcase className="h-5 w-5 shrink-0 text-orange-500" />

            <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
              Professional Information
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 sm:p-5 lg:grid-cols-4">
            <Field
              icon={<Building2 size={16} />}
              label="Company"
              value={mentor?.company}
            />

            <Field
              icon={<Briefcase size={16} />}
              label="Profession"
              value={mentor?.profession}
            />

            <Field
              icon={<Award size={16} />}
              label="Experience"
              value={`${mentor?.experience || 0} Years`}
            />

            <Field
              icon={<Globe size={16} />}
              label="Industry"
              value={mentor?.industry}
            />
          </div>
        </section>

        {/* ================= Expertise ================= */}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-2 border-b bg-gray-50 px-4 py-3 sm:px-5">
            <BadgeCheck className="h-5 w-5 shrink-0 text-orange-500" />

            <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
              Expertise
            </h3>
          </div>

          <div className="space-y-5 p-4 sm:p-5">
            <Field label="Category" value={mentor?.category} />

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Primary Skills
              </p>

              <div className="flex flex-wrap gap-2">
                {mentor?.primarySkill?.length > 0 ? (
                  mentor.primarySkill.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="max-w-full break-words rounded-full bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-700 sm:text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No skills added</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= Education ================= */}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-2 border-b bg-gray-50 px-4 py-3 sm:px-5">
            <GraduationCap className="h-5 w-5 shrink-0 text-orange-500" />

            <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
              Education
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 sm:p-5 lg:grid-cols-4">
            <Field
              icon={<GraduationCap size={16} />}
              label="Degree"
              value={mentor?.education?.degree}
            />

            <Field
              icon={<Building2 size={16} />}
              label="College"
              value={mentor?.education?.college}
            />

            <Field
              icon={<Award size={16} />}
              label="Graduation"
              value={mentor?.education?.graduationYear}
            />

            <Field
              icon={<Award size={16} />}
              label="CGPA"
              value={mentor?.education?.cgpa}
            />
          </div>
        </section>

        {/* ================= Languages ================= */}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-2 border-b bg-gray-50 px-4 py-3 sm:px-5">
            <Languages className="h-5 w-5 shrink-0 text-orange-500" />

            <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
              Languages
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 p-4 sm:p-5">
            {mentor?.languages?.length > 0 ? (
              mentor.languages.map((language, index) => (
                <span
                  key={`${language}-${index}`}
                  className="max-w-full break-words rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 sm:text-sm"
                >
                  {language}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No languages added</span>
            )}
          </div>
        </section>

        {/* ================= Availability & Pricing ================= */}

        <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Availability */}

          <div className="overflow-hidden rounded-xl border border-green-200 bg-green-50">
            <div className="flex items-center gap-2 border-b border-green-200 px-4 py-3 sm:px-5">
              <CalendarDays className="h-5 w-5 shrink-0 text-green-600" />

              <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
                Availability
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 p-4 min-[400px]:grid-cols-2 sm:p-5">
              <Field
                label="Days"
                value={
                  Array.isArray(mentor?.availability?.availableDays)
                    ? mentor.availability.availableDays.join(", ")
                    : mentor?.availability?.availableDays
                }
              />

              <Field
                label="Preferred Time"
                value={mentor?.availability?.preferredTime}
              />

              <Field
                label="Start Time"
                value={mentor?.availability?.startTime}
              />

              <Field label="End Time" value={mentor?.availability?.endTime} />

              <Field
                label="Duration"
                value={
                  mentor?.availability?.sessionDuration
                    ? `${mentor.availability.sessionDuration} mins`
                    : "-"
                }
              />

              <Field label="Timezone" value={mentor?.availability?.timezone} />
            </div>
          </div>

          {/* Pricing */}

          <div className="overflow-hidden rounded-xl border border-orange-200 bg-orange-50">
            <div className="flex items-center gap-2 border-b border-orange-200 px-4 py-3 sm:px-5">
              <IndianRupee className="h-5 w-5 shrink-0 text-orange-600" />

              <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
                Pricing
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 p-4 min-[400px]:grid-cols-2 sm:p-5">
              <Field
                label="Session Type"
                value={mentor?.pricing?.sessionType}
              />

              <Field
                label="Fee"
                value={
                  mentor?.pricing?.sessionPrice
                    ? `₹${mentor.pricing.sessionPrice}`
                    : "-"
                }
              />

              <Field label="Currency" value={mentor?.pricing?.currency} />

              <Field
                label="Free Trial"
                value={
                  mentor?.pricing?.freeTrial ? "Available" : "Not Available"
                }
              />
            </div>
          </div>
        </section>

        {/* ================= About ================= */}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b bg-gray-50 px-4 py-3 sm:px-5">
            <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
              About
            </h3>
          </div>

          <div className="p-4 sm:p-5">
            <p className="break-words text-sm leading-6 text-gray-600 sm:leading-7">
              {mentor?.about || "No description provided."}
            </p>
          </div>
        </section>

        {/* ================= Verification ================= */}

        <section className="overflow-hidden rounded-xl border border-amber-200 bg-amber-50">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0 rounded-lg bg-amber-100 p-2">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
                  Verification Status
                </h3>

                <p className="text-xs text-gray-500 sm:text-sm">
                  Mentor account verification
                </p>
              </div>
            </div>

            <span
              className={`self-start rounded-full px-3 py-1.5 text-xs font-semibold sm:self-auto sm:px-4 sm:py-2 sm:text-sm ${
                mentor?.isVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {mentor?.isVerified ? "Verified" : "Not Verified"}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ==========================================================
   Reusable Field Component
========================================================== */

function Field({ icon, label, value }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center gap-2 text-gray-500">
        {icon && <span className="shrink-0 text-orange-500">{icon}</span>}

        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="break-words text-sm font-semibold text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}
