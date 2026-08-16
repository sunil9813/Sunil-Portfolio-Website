import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaCalendarCheck,
  FaCheckCircle,
  FaClipboardCheck,
  FaExternalLinkAlt,
  FaFileSignature,
  FaFingerprint,
  FaGem,
  FaLock,
  FaQrcode,
  FaReceipt,
  FaShieldAlt,
  FaTimesCircle,
  FaUserCheck,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

import { DotBackground } from "@/components/customeUI/DotBackground";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString()}`;

const getAssetUrl = (asset) => {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  return asset?.filePath || asset?.url || asset?.path || "";
};

export const ProjectLicenseVerify = () => {
  const { licenseId } = useParams();
  const [license, setLicense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isActive = license?.status === "active";
  const projectImage = useMemo(() => getAssetUrl(license?.project?.thumbnail), [license?.project?.thumbnail]);

  useEffect(() => {
    let isMounted = true;

    const fetchLicense = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/project/license/verify/${licenseId}`);
        if (!isMounted) return;
        setLicense(response.data?.license || null);
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError.response?.data?.error || "Project license could not be verified.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLicense();

    return () => {
      isMounted = false;
    };
  }, [licenseId]);

  return (
    <section className=" min-h-screen overflow-hidden bg-[#10151c] pb-24 pt-2 text-white">
      <DotBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(38,141,140,0.24),transparent_30%),radial-gradient(circle_at_78%_20%,rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_55%_88%,rgba(244,82,168,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_42%)]" />
      <div className="pointer-events-none absolute left-0 top-0 h-[38rem] w-full bg-[linear-gradient(115deg,rgba(20,184,166,0.10),transparent_38%,rgba(168,85,247,0.10)_76%,transparent)] opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-px w-[72vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-teal-100/18 to-transparent" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/project"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55 backdrop-blur-xl transition hover:border-teal-200/[0.16] hover:text-teal-100"
            >
              <FaBoxOpen />
              Projects
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200/[0.10] bg-teal-300/[0.055] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-100/65 shadow-[0_0_40px_rgba(45,212,191,0.08)] backdrop-blur-xl">
              <FaShieldAlt />
              Public license verification
            </span>
          </div>

          {isLoading ? (
            <LicenseSkeleton />
          ) : error ? (
            <div className="relative overflow-hidden rounded-[2.2rem] border border-rose-300/[0.12] bg-white/[0.035] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.16),transparent_42%)]" />
              <div className="relative z-10">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-rose-200/[0.16] bg-rose-300/[0.08] text-2xl text-rose-100">
                  <FaFingerprint />
                </div>
                <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white">License not verified</h1>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/48">{error}</p>
                <Link to="/project" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-xs font-semibold text-black transition hover:-translate-y-0.5">
                  Browse projects
                </Link>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-[2.7rem] border border-white/[0.075] bg-white/[0.032] p-2 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute -left-32 top-10 size-80 rounded-full bg-teal-300/[0.10] blur-[90px]" />
              <div className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-fuchsia-300/[0.08] blur-[100px]" />
              <div className="pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              <div className="relative overflow-hidden rounded-[2.35rem] bg-[#121820]/88 p-5 ring-1 ring-white/[0.045] md:p-8 lg:p-10">
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-teal-100/24 to-transparent" />
                <div className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full border border-white/[0.035]" />
                <div className="pointer-events-none absolute right-20 top-20 h-20 w-20 rounded-full border border-white/[0.045]" />
                <div className="pointer-events-none absolute -left-14 top-16 hidden h-[82%] w-24 rounded-full bg-gradient-to-b from-teal-300/[0.16] via-white/[0.035] to-fuchsia-300/[0.12] blur-2xl lg:block" />

                <div className="relative grid gap-8 lg:grid-cols-[1fr_340px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] ring-1 backdrop-blur-xl ${isActive ? "bg-emerald-300/[0.08] text-emerald-100/75 ring-emerald-200/[0.12]" : "bg-rose-300/[0.08] text-rose-100/75 ring-rose-200/[0.12]"}`}
                      >
                        {isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                        {isActive ? "Verified active" : "Access paused"}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.035] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45 ring-1 ring-white/[0.045]">
                        <FaFingerprint />
                        {license.licenseId}
                      </span>
                    </div>

                    <h1 className="gardient-text mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.06em] md:text-6xl lg:text-7xl">Project License Verified</h1>
                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/48 md:text-base">A public proof page for buyer ownership, project access, order record, and license terms.</p>
                    <div className="mt-6 flex flex-wrap gap-2.5">
                      <TrustPill icon={<FaClipboardCheck />} title="Ownership proof" />
                      <TrustPill icon={<FaGem />} title="Premium access" />
                      <TrustPill icon={<FaFileSignature />} title="License terms" />
                    </div>

                    <div className="mt-8 overflow-hidden rounded-[2rem] bg-white/[0.035] p-px ring-1 ring-white/[0.04]">
                      <div className="relative overflow-hidden rounded-[1.95rem] bg-[#151d27]/86 p-5">
                        {projectImage && (
                          <div className="absolute inset-0 opacity-[0.08]">
                            <img src={projectImage} alt="" className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#151d27]/72 via-[#151d27]/90 to-[#151d27]" />
                        <div className="pointer-events-none absolute -right-8 top-8 rotate-[-10deg] rounded-full border border-white/[0.05] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/[0.055]">
                          Verified
                        </div>
                        <div className="relative grid gap-5 md:grid-cols-[170px_1fr]">
                          <div className="overflow-hidden rounded-[1.5rem] bg-white/[0.045] p-2 ring-1 ring-white/[0.06]">
                            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.1rem] bg-white/[0.035]">
                              {projectImage ? (
                                <img src={projectImage} alt={license.project?.title || "Project"} className="h-full w-full object-cover" />
                              ) : (
                                <FaShieldAlt className="text-5xl text-teal-100/55" />
                              )}
                            </div>
                          </div>
                          <div className="min-w-0 self-center">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-teal-100/45">Licensed project</p>
                            <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white/90 md:text-3xl">{license.project?.title || "Project"}</h2>
                            <div className="mt-5 flex flex-wrap gap-2">
                              <SmallPill icon={<FaUserCheck />} label={license.user?.name || "Verified buyer"} />
                              {license.user?.email && <SmallPill label={license.user.email} />}
                              <SmallPill icon={<FaReceipt />} label={formatCurrency(license.order?.amount)} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <aside className="space-y-3">
                    <div className="overflow-hidden rounded-[2rem] bg-white/[0.04] p-px ring-1 ring-white/[0.055]">
                      <div className="relative rounded-[1.95rem] bg-[#171e29]/88 p-5 backdrop-blur-xl">
                        <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-teal-300/[0.08] blur-3xl" />
                        <div className="relative flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-100/45">Verification seal</p>
                            <h3 className="mt-2 text-xl font-semibold text-white/88">Gorkcoder License</h3>
                          </div>
                          <div
                            className={`grid size-16 place-items-center rounded-[1.35rem] ring-1 ${isActive ? "bg-emerald-300/[0.08] text-emerald-100/75 ring-emerald-200/[0.12]" : "bg-rose-300/[0.08] text-rose-100/75 ring-rose-200/[0.12]"}`}
                          >
                            {isActive ? <FaShieldAlt size={24} /> : <FaLock size={22} />}
                          </div>
                        </div>
                        <div className="relative mt-5 rounded-[1.4rem] border border-white/[0.045] bg-[linear-gradient(135deg,rgba(45,212,191,0.08),rgba(255,255,255,0.025),rgba(168,85,247,0.08))] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/38">Authenticity</span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-300/[0.08] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-100/68">
                              <FaCheckCircle size={10} />
                              Verified
                            </span>
                          </div>
                          <p className="mt-3 text-xs leading-6 text-white/48">Matched with a real order and project access record.</p>
                        </div>
                        <div className="relative mt-5 rounded-[1.4rem] bg-white/[0.035] p-4 ring-1 ring-white/[0.04]">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">License ID</p>
                          <p className="mt-2 break-all text-sm font-semibold text-white/80">{license.licenseId}</p>
                        </div>
                        <div className="relative mt-3 rounded-[1.4rem] bg-white/[0.035] p-4 ring-1 ring-white/[0.04]">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">Status</p>
                          <p
                            className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-[10px] font-semibold capitalize ${isActive ? "bg-emerald-300/[0.10] text-emerald-100/75" : "bg-rose-300/[0.10] text-rose-100/75"}`}
                          >
                            {license.status || "unknown"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <InfoCard icon={<FaCalendarCheck />} label="Issued" value={formatDate(license.issuedAt || license.createdAt)} />
                      <InfoCard icon={<FaReceipt />} label="Order" value={formatCurrency(license.order?.amount)} />
                      <InfoCard icon={<FaUserCheck />} label="Payment" value={license.order?.status || "paid"} />
                      <InfoCard icon={<FaLock />} label="Usage" value={isActive ? "Active" : "Paused"} />
                    </div>
                  </aside>
                </div>

                <div className="relative mt-8 grid gap-5 lg:grid-cols-[1fr_280px]">
                  {license.usageTerms && (
                    <div className="rounded-[1.8rem] bg-white/[0.032] p-5 ring-1 ring-white/[0.045] backdrop-blur-xl">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-full bg-teal-300/[0.08] text-teal-100/65 ring-1 ring-teal-200/[0.10]">
                          <FaLock size={14} />
                        </span>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-100/45">License terms</p>
                          <h3 className="mt-1 text-lg font-semibold text-white/86">Usage permission</h3>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-white/52">{license.usageTerms}</p>
                    </div>
                  )}

                  <div className="rounded-[1.8rem] bg-white/[0.032] p-5 ring-1 ring-white/[0.045] backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">Scan proof</p>
                        <h3 className="mt-1 text-lg font-semibold text-white/84">Public record</h3>
                      </div>
                      <span className="grid size-12 place-items-center rounded-[1rem] bg-white/[0.045] text-white/60 ring-1 ring-white/[0.05]">
                        <FaQrcode size={20} />
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <MiniQr />
                      <p className="text-xs leading-6 text-white/45">Share this page with clients, support, or collaborators to verify project access.</p>
                    </div>
                  </div>
                </div>

                <div className="relative mt-5 grid gap-3 rounded-[1.8rem] bg-white/[0.025] p-4 ring-1 ring-white/[0.04] backdrop-blur-xl md:grid-cols-3">
                  <TimelineStep number="01" title="Order matched" text="Buyer and payment record checked." />
                  <TimelineStep number="02" title="License active" text="Access permission is currently valid." />
                  <TimelineStep number="03" title="Public proof" text="This page can be used for verification." />
                </div>

                <div className="relative mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.055] pt-6">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/35">Verified by</p>
                    <p className="mt-1 font-serif text-2xl italic text-white/88">Sunil B.K</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {license.project?.slug && (
                      <Link
                        to={`/project-details/${license.project.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-[#071319] transition hover:-translate-y-0.5"
                      >
                        Open project
                        <FaExternalLinkAlt size={10} />
                      </Link>
                    )}
                    <Link
                      to="/account?tab=downloads"
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.075] bg-white/[0.04] px-5 py-3 text-xs font-semibold text-white/58 transition hover:-translate-y-0.5 hover:bg-white/[0.065]"
                    >
                      My downloads
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const SmallPill = ({ icon, label }) => (
  <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/[0.045] px-3 py-2 text-[10px] font-semibold text-white/54 ring-1 ring-white/[0.045]">
    {icon && <span className="text-teal-100/55">{icon}</span>}
    <span className="truncate">{label}</span>
  </span>
);

const TrustPill = ({ icon, title }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.055] bg-white/[0.035] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/48 backdrop-blur-xl">
    <span className="grid size-6 place-items-center rounded-full bg-teal-300/[0.07] text-teal-100/62">{icon}</span>
    {title}
  </span>
);

const InfoCard = ({ icon, label, value }) => (
  <div className="rounded-[1.25rem] bg-white/[0.035] p-4 ring-1 ring-white/[0.045] backdrop-blur-xl">
    <span className="flex size-8 items-center justify-center rounded-full bg-white/[0.045] text-teal-100/62 ring-1 ring-white/[0.04]">{icon}</span>
    <p className="mt-3 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/32">{label}</p>
    <p className="mt-1 text-xs font-semibold capitalize text-white/75">{value}</p>
  </div>
);

const TimelineStep = ({ number, title, text }) => (
  <div className="flex gap-3 rounded-[1.25rem] bg-white/[0.026] p-4 ring-1 ring-white/[0.035]">
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.045] text-[10px] font-semibold text-teal-100/62 ring-1 ring-white/[0.045]">{number}</span>
    <span>
      <span className="block text-xs font-semibold text-white/78">{title}</span>
      <span className="mt-1 block text-[11px] leading-5 text-white/38">{text}</span>
    </span>
  </div>
);

const MiniQr = () => (
  <span className="grid size-14 shrink-0 grid-cols-4 gap-1 rounded-xl bg-white/[0.045] p-2 ring-1 ring-white/[0.05]">
    {Array.from({ length: 16 }).map((_, index) => (
      <span key={index} className={`rounded-[3px] ${[0, 1, 4, 5, 10, 11, 14].includes(index) ? "bg-teal-100/65" : "bg-white/16"}`} />
    ))}
  </span>
);

const LicenseSkeleton = () => (
  <div className="rounded-[2.7rem] border border-white/[0.08] bg-white/[0.035] p-2 backdrop-blur-2xl">
    <div className="rounded-[2.35rem] bg-white/[0.035] p-8">
      <div className="h-8 w-64 animate-pulse rounded-full bg-white/10" />
      <div className="mt-8 h-20 w-3/4 animate-pulse rounded-3xl bg-white/10" />
      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="h-72 animate-pulse rounded-[2rem] bg-white/10" />
        <div className="h-72 animate-pulse rounded-[2rem] bg-white/10" />
      </div>
    </div>
  </div>
);
