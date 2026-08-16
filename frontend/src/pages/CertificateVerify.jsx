import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FaAward, FaCalendarCheck, FaCheckCircle, FaExternalLinkAlt, FaFingerprint, FaGraduationCap, FaShieldAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

import { DotBackground } from "@/components/customeUI/DotBackground";
import { REACT_APP_BACKEND_URL } from "@/utils/api";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

const getAssetUrl = (asset) => {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  return asset?.filePath || asset?.url || "";
};

export const CertificateVerify = () => {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const courseImage = useMemo(() => getAssetUrl(certificate?.courseThumbnail), [certificate?.courseThumbnail]);

  useEffect(() => {
    let isMounted = true;

    const fetchCertificate = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/business/certificate/verify/${certificateId}`);
        if (!isMounted) return;
        setCertificate(response.data?.certificate || null);
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError.response?.data?.error || "Certificate could not be verified.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCertificate();

    return () => {
      isMounted = false;
    };
  }, [certificateId]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#10151c] pb-24 pt-20 text-white">
      <DotBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(38,141,140,0.22),transparent_34%),radial-gradient(circle_at_80%_25%,rgba(169,109,255,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <Link to="/courses" className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55 backdrop-blur-xl transition hover:border-teal-200/[0.16] hover:text-teal-100">
              <FaGraduationCap />
              Courses
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200/[0.10] bg-teal-300/[0.055] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-100/65 backdrop-blur-xl">
              <FaShieldAlt />
              Public verification
            </span>
          </div>

          {isLoading ? (
            <CertificateSkeleton />
          ) : error ? (
            <div className="overflow-hidden rounded-[2rem] border border-rose-300/[0.16] bg-rose-500/[0.055] p-8 text-center backdrop-blur-2xl">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-rose-200/[0.16] bg-rose-300/[0.08] text-2xl text-rose-100">
                <FaFingerprint />
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white">Certificate not verified</h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/48">{error}</p>
              <Link to="/courses" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-xs font-semibold text-black transition hover:-translate-y-0.5">
                Browse courses
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-white/[0.035] p-3 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
              <div className="relative overflow-hidden rounded-[2.1rem] bg-[#f8fafc] px-6 py-8 text-slate-950 md:px-12 md:py-12">
                <div className="pointer-events-none absolute -left-32 -top-24 size-96 rounded-full bg-cyan-300/20 blur-3xl" />
                <div className="pointer-events-none absolute -right-32 -bottom-24 size-96 rounded-full bg-fuchsia-300/20 blur-3xl" />
                <div className="pointer-events-none absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-[#2aa7c8] via-[#f452a8] to-[#ffd042]" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-2 bg-gradient-to-b from-[#ffd042] via-[#f452a8] to-[#2aa7c8]" />

                <div className="relative flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-700">Gorkcoder verified</p>
                    <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.05em] text-slate-950 md:text-6xl">Certificate of Completion</h1>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 text-right shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">Certificate ID</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{certificate.certificateId}</p>
                  </div>
                </div>

                <div className="relative mt-12 grid gap-8 lg:grid-cols-[1fr_260px]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">This certifies that</p>
                    <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">{certificate.student}</h2>
                    <p className="mt-8 text-sm leading-7 text-slate-500">has successfully completed the course</p>
                    <h3 className="mt-2 max-w-2xl text-3xl font-semibold tracking-[-0.035em] text-teal-700">{certificate.course}</h3>
                    {certificate.courseDescription && <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">{certificate.courseDescription}</p>}
                  </div>

                  <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-100">
                      {courseImage ? <img src={courseImage} alt={certificate.course} className="h-full w-full object-cover" /> : <FaAward className="text-6xl text-amber-500" />}
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                      <FaCheckCircle />
                      Verified valid
                    </div>
                  </div>
                </div>

                <div className="relative mt-10 grid gap-3 md:grid-cols-3">
                  <InfoCard icon={<FaCalendarCheck />} label="Completed" value={formatDate(certificate.completedAt)} />
                  <InfoCard icon={<FaAward />} label="Issued" value={formatDate(certificate.issuedAt)} />
                  <InfoCard icon={<FaFingerprint />} label="Verification" value="Authentic record" />
                </div>

                <div className="relative mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">Signed by</p>
                    <p className="mt-1 font-serif text-2xl italic text-slate-950">Sunil B.K</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {certificate.courseSlug && (
                      <Link to={`/course/${certificate.courseSlug}`} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-xs font-semibold text-white transition hover:-translate-y-0.5">
                        Open course
                        <FaExternalLinkAlt size={10} />
                      </Link>
                    )}
                    <Link to="/account?tab=certificates" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5">
                      My certificates
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

const InfoCard = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
    <span className="flex size-9 items-center justify-center rounded-full bg-teal-50 text-teal-700">{icon}</span>
    <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
  </div>
);

const CertificateSkeleton = () => (
  <div className="rounded-[2.5rem] border border-white/[0.08] bg-white/[0.035] p-3 backdrop-blur-2xl">
    <div className="rounded-[2.1rem] bg-white/[0.04] p-8">
      <div className="h-4 w-40 animate-pulse rounded-full bg-white/10" />
      <div className="mt-6 h-14 w-3/4 animate-pulse rounded-2xl bg-white/10" />
      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <div className="h-5 w-36 animate-pulse rounded-full bg-white/10" />
          <div className="h-12 w-80 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-8 w-2/3 animate-pulse rounded-xl bg-white/10" />
        </div>
        <div className="aspect-square animate-pulse rounded-[2rem] bg-white/10" />
      </div>
    </div>
  </div>
);
