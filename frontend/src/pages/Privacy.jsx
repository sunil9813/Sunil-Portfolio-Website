import {
  FiActivity,
  FiAlertCircle,
  FiArrowUpRight,
  FiCreditCard,
  FiDatabase,
  FiDownload,
  FiEye,
  FiGlobe,
  FiLock,
  FiMail,
  FiMinus,
  FiPhone,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiUserCheck,
} from "react-icons/fi";

const lastUpdated = "August 4, 2026";

const getSectionId = (title) =>
  title
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const privacyHighlights = [
  {
    icon: <FiUserCheck />,
    title: "Account data",
    text: "Name, email, profile details, login status, and account settings are used to provide secure access.",
  },
  {
    icon: <FiShoppingBag />,
    title: "Orders & refunds",
    text: "Order, invoice, payment status, discount, and refund details are saved so your purchases can be verified.",
  },
  {
    icon: <FiActivity />,
    title: "Learning activity",
    text: "Course progress, chapter reads, likes, bookmarks, comments, and views help power your learning experience.",
  },
];

const privacySections = [
  {
    icon: <FiShield />,
    title: "1. Introduction",
    body: [
      "This Privacy Policy explains how Gorkcoder / Sunil B.K collects, uses, stores, and protects information when you use the portfolio website, courses, notes, resources, account dashboard, orders, payments, refunds, comments, likes, bookmarks, and contact features.",
      "The goal is simple: collect only the information needed to run the platform, protect user access, process orders, improve learning features, and respond to support requests.",
    ],
  },
  {
    icon: <FiUserCheck />,
    title: "2. Information you provide",
    body: [
      "When you create an account or update your profile, the platform may collect your name, email address, phone number, avatar, cover image, address, bio, password credentials, verification status, and profile preferences.",
      "When you contact me, submit feedback, ask a question, write a comment, or request support, the platform may store your message, name, email, phone, subject, and related conversation details.",
    ],
  },
  {
    icon: <FiCreditCard />,
    title: "3. Payment and order information",
    body: [
      "When you purchase paid courses, products, or digital resources, the platform may store order items, order amount, discount or coupon details, payment method, payment status, transaction reference, paid date, receipt/invoice details, refund status, and access information.",
      "Payments may be processed by third-party providers such as Stripe and eSewa. Full card numbers, CVV codes, and sensitive payment credentials are handled by the payment provider and are not stored directly by this website.",
    ],
  },
  {
    icon: <FiDownload />,
    title: "4. Courses, notes, and learning data",
    body: [
      "The platform may track course progress, completed chapters, completed subchapters, downloads, secure resource access, views, likes, bookmarks, comments, and reading activity.",
      "This information is used to show progress, protect paid content, calculate totals, recommend relevant content, prevent abuse, and improve the learning experience.",
    ],
  },
  {
    icon: <FiEye />,
    title: "5. Automatically collected information",
    body: [
      "Like most websites, the platform may collect technical information such as IP address, browser type, device type, page visits, timestamps, request logs, error logs, and general usage activity.",
      "This information helps with security, debugging, analytics, fraud prevention, payment verification, download protection, and platform performance.",
    ],
  },
  {
    icon: <FiDatabase />,
    title: "6. How information is used",
    body: [
      "Information is used to create and manage accounts, authenticate users, deliver free and paid content, process orders, generate invoices, review refunds, provide secure downloads, show comments, send account emails, and respond to support requests.",
      "It may also be used to improve the website design, measure course engagement, prevent unauthorized access, troubleshoot issues, and maintain platform safety.",
    ],
  },
  {
    icon: <FiGlobe />,
    title: "7. Third-party services",
    body: [
      "The website may use third-party services for payment processing, cloud storage, image/file hosting, email delivery, analytics, authentication, hosting, and external links.",
      "These services may process information according to their own privacy policies. Please review their policies when you use external payment, login, or linked services.",
    ],
  },
  {
    icon: <FiLock />,
    title: "8. Security and access protection",
    body: [
      "Reasonable security measures are used to protect accounts, paid content, private downloads, orders, refunds, and dashboard features.",
      "No internet-based system can be guaranteed 100% secure, but the platform is designed to reduce unnecessary exposure and protect sensitive workflows such as paid access and secure resource downloads.",
    ],
  },
  {
    icon: <FiRefreshCw />,
    title: "9. Refunds, support, and audit records",
    body: [
      "When you request a refund or support help, the platform may store your reason, category, preferred refund method, contact details, admin notes, status history, and related order data.",
      "Admin actions, download logs, access checks, and support updates may be stored to keep a fair record of platform activity and protect both users and the site owner.",
    ],
  },
  {
    icon: <FiDownload />,
    title: "10. Data retention",
    body: [
      "Information is kept for as long as needed to provide your account, purchases, invoices, refunds, support history, learning progress, legal records, and security protection.",
      "You may request account/data review or deletion from the privacy area in your dashboard where available, or by contacting me directly.",
    ],
  },
  {
    icon: <FiUserCheck />,
    title: "11. Your choices and rights",
    body: [
      "Depending on your location, you may have rights to access, correct, update, export, restrict, or delete certain personal information.",
      "You can update your profile information from your account dashboard. For account deletion, payment history, refund records, or other privacy requests, contact support through the website.",
    ],
  },
  {
    icon: <FiAlertCircle />,
    title: "12. Policy changes",
    body: [
      "This Privacy Policy may be updated when the platform changes, new payment providers are added, privacy features are improved, or legal requirements change.",
      "The latest version will be posted on this page with the updated date. Continued use of the platform means you accept the latest Privacy Policy.",
    ],
  },
];

export const Privacy = () => {
  return (
    <section className="privacy-policy relative overflow-hidden py-8 sm:py-10">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute -left-28 top-28 size-80 rounded-full bg-cyan-500/[0.10] blur-3xl" />
        <span className="absolute -right-28 top-10 size-96 rounded-full bg-violet-500/[0.09] blur-3xl" />
        <span className="absolute bottom-20 left-1/2 size-80 -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-3xl" />
        <span className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:54px_54px]" />
      </div>

      <div className="container relative z-10">
        <PrivacyHero />

        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
          <aside className="hidden min-w-0 lg:block">
            <div className="sticky top-24 rounded-[30px] border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-2xl">
              <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-cyan-100/45">Privacy stack</p>
              <div className="mt-4 space-y-3">
                <PrivacyStackItem icon={<FiUserCheck />} label="Account" text="Profile and login" />
                <PrivacyStackItem icon={<FiCreditCard />} label="Payments" text="Orders and invoices" />
                <PrivacyStackItem icon={<FiDownload />} label="Resources" text="Access and downloads" />
                <PrivacyStackItem icon={<FiRefreshCw />} label="Refunds" text="Requests and review" />
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="relative overflow-hidden rounded-[34px] border border-gray-200/70 bg-gray-50/65 p-4 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/[0.07] dark:bg-[#111827]/[0.36] dark:shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:p-6">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent dark:via-white/24" />
              <div className="pointer-events-none absolute -right-24 top-16 size-72 rounded-full bg-cyan-300/[0.06] blur-3xl" />
              <div className="pointer-events-none absolute -left-20 bottom-32 size-72 rounded-full bg-violet-300/[0.05] blur-3xl" />

              <div className="relative mb-5 overflow-hidden rounded-[28px] border border-gray-200/70 bg-white/58 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.06] dark:bg-white/[0.022] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_16px_45px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-cyan-400/[0.08] blur-3xl" />
                <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-500/[0.06] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:border-cyan-300/[0.10] dark:text-cyan-200/70">
                      <FiShield />
                      Privacy center
                    </span>
                    <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-white/92 sm:text-4xl">
                      Your data is used to run the platform, protect access, and support your learning.
                    </h1>
                    <p className="mt-3 max-w-2xl text-[12px] leading-6 text-white/45">
                      This policy explains what is collected when you login, buy courses, download resources, request refunds, comment, like, bookmark, or contact Gorkcoder.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200/80 bg-white/60 px-4 py-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-white/[0.06] dark:bg-white/[0.025]">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/35">Last updated</p>
                    <p className="mt-1 text-xs font-semibold text-white/78">{lastUpdated}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <MetricCard accent="cyan" label="Data purpose" title="Access + support" text="Information is used for login, purchases, learning progress, downloads, and support." />
                <MetricCard accent="violet" label="Payment safety" title="No full card data" text="Sensitive card details are handled by payment providers like Stripe/eSewa." />
                <MetricCard accent="emerald" label="Your control" title="Review / delete" text="You can update profile data and request account or privacy help." />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {privacyHighlights.map((item, index) => (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden rounded-[24px] border border-gray-200/80 bg-white/55 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)] dark:border-white/[0.06] dark:bg-white/[0.022] dark:hover:border-cyan-300/[0.12]"
                  >
                    <span className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-cyan-400/[0.06] blur-2xl transition-opacity duration-300 group-hover:opacity-100 dark:bg-cyan-300/[0.08]" />
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.08] dark:text-cyan-200/70">
                        {item.icon}
                      </span>
                      <span className="rounded-full border border-white/[0.07] bg-white/[0.035] px-2 py-1 text-[8px] font-semibold text-white/32">0{index + 1}</span>
                    </div>
                    <h3 className="relative z-10 mt-3 text-sm font-semibold text-white/88">{item.title}</h3>
                    <p className="relative z-10 mt-2 text-[11px] leading-5 text-white/42">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="my-7 rounded-[26px] border border-gray-200/70 bg-gradient-to-br from-gray-50/80 to-white/45 p-4 dark:border-white/[0.06] dark:from-white/[0.035] dark:to-white/[0.012]">
                <div className="grid gap-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.065] text-indigo-700 dark:border-indigo-300/[0.08] dark:text-indigo-200/70">
                    <FiDatabase />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white/88">Short version</h3>
                    <p className="mt-1 text-[11px] leading-5 text-white/42">
                      Your data helps the app remember your account, verify purchases, protect paid resources, track progress, manage refunds, and respond to support.
                    </p>
                  </div>
                  <a
                    href="/account?tab=privacy"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 text-[10px] font-semibold text-white/76 transition-all hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-300/[0.06] hover:text-cyan-100"
                  >
                    Privacy tools
                    <FiArrowUpRight />
                  </a>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {privacySections.map((section, index) => (
                  <article
                    id={getSectionId(section.title)}
                    key={section.title}
                    className="group relative scroll-mt-28 overflow-hidden rounded-[28px] border border-white/[0.065] bg-white/[0.018] p-4 transition-all duration-300 hover:border-cyan-300/[0.14] hover:bg-white/[0.032] sm:p-5"
                  >
                    <span className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-cyan-300/[0.045] blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative z-10 grid gap-4 sm:grid-cols-[86px_minmax(0,1fr)]">
                      <div className="flex sm:flex-col sm:items-center">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-white/45 transition-colors group-hover:border-cyan-300/25 group-hover:bg-cyan-500/[0.07] group-hover:text-cyan-100">
                          {section.icon}
                        </span>
                        <span className="ml-3 mt-5 hidden h-full w-px bg-gradient-to-b from-cyan-200/25 via-white/[0.08] to-transparent sm:ml-0 sm:block" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/32">
                            Privacy layer {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="h-px min-w-8 flex-1 bg-gradient-to-r from-cyan-200/20 to-transparent" />
                        </div>
                        <h2 className="mt-3 text-base font-semibold capitalize tracking-[-0.02em] text-white/90">{section.title}</h2>
                        <div className="mt-3 space-y-2.5 text-[12px] leading-6 text-white/46">
                          {section.body.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </main>

          <aside className="min-w-0">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-[24px] border border-gray-200/70 bg-gray-50/65 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.055)] backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.018]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white/86">Privacy index</h3>
                  <span className="rounded-full border border-white/[0.07] bg-white/[0.035] px-2 py-1 text-[8px] font-semibold text-white/32">{privacySections.length}</span>
                </div>

                <div className="max-h-[320px] space-y-1 overflow-y-auto pr-1 [scrollbar-color:rgba(103,232,249,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-cyan-200/25 [&::-webkit-scrollbar-track]:bg-transparent">
                  {privacySections.map((section, index) => (
                    <a
                      key={section.title}
                      href={`#${getSectionId(section.title)}`}
                      className="group flex items-center gap-2 rounded-2xl px-2.5 py-2 text-[10px] font-semibold text-white/42 transition-all hover:bg-cyan-300/[0.055] hover:text-cyan-100/80"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-[8px] font-semibold text-white/32 group-hover:border-cyan-300/25 group-hover:text-cyan-100/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="line-clamp-1">{section.title.replace(/^\d+\.\s*/, "")}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-gray-200/70 bg-gray-50/60 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.018]">
                <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#122334] via-[#15204a] to-[#080b13] p-5">
                  <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-cyan-300/[0.12] blur-3xl" />
                  <div className="relative z-10">
                    <span className="flex size-14 items-center justify-center rounded-2xl border border-white/[0.14] bg-white/[0.08] text-2xl font-semibold text-white/90">P</span>
                    <p className="mt-5 text-[8px] font-semibold uppercase tracking-[0.16em] text-cyan-100/50">Privacy promise</p>
                    <h3 className="mt-1 text-xl font-semibold leading-tight tracking-[-0.03em] text-white">Built for secure learning access</h3>
                    <p className="mt-3 text-[11px] leading-5 text-white/48">Privacy rules for accounts, payments, downloads, refunds, comments, progress, and protected course access.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-gray-200/70 bg-gray-50/60 p-5 backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.018]">
                <h3 className="text-sm font-semibold text-white/86">Contact for privacy</h3>
                <p className="mt-2 text-[11px] leading-5 text-white/40">For privacy questions, account deletion, order records, or data requests, contact me here.</p>

                <div className="mt-4 space-y-2">
                  <ContactCard icon={<FiMail />} label="Email" value="sunilbk962@example.com" href="mailto:sunilbk962@example.com" />
                  <ContactCard icon={<FiPhone />} label="Phone" value="+977 9813253082" href="tel:+9779813253082" />
                  <ContactCard icon={<FiGlobe />} label="Website" value="sunil-portfolio.com" href="https://sunil-portfolio.com" />
                </div>
              </div>

              <div className="rounded-[24px] border border-amber-300/20 bg-amber-500/[0.055] p-5 dark:border-amber-300/[0.08]">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-100/75">
                  <FiAlertCircle />
                  <h3 className="text-sm font-semibold">Important note</h3>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-white/45">
                  This policy is written for your current platform features. Before production launch, review it with a legal professional for your exact business requirements.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

const MetricCard = ({ accent, label, title, text }) => {
  const accentClass =
    {
      cyan: "border-cyan-300/20 bg-cyan-500/[0.055] text-cyan-700 dark:border-cyan-300/[0.08] dark:text-cyan-200/65",
      violet: "border-violet-300/20 bg-violet-500/[0.055] text-violet-700 dark:border-violet-300/[0.08] dark:text-violet-200/65",
      emerald: "border-emerald-300/20 bg-emerald-500/[0.055] text-emerald-700 dark:border-emerald-300/[0.08] dark:text-emerald-200/65",
    }[accent] || "border-cyan-300/20 bg-cyan-500/[0.055] text-cyan-700 dark:border-cyan-300/[0.08] dark:text-cyan-200/65";

  return (
    <div className={`rounded-[22px] border p-4 ${accentClass}`}>
      <p className="text-[8px] font-semibold uppercase tracking-[0.14em]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white/88">{title}</p>
      <p className="mt-1 text-[10px] leading-5 text-white/42">{text}</p>
    </div>
  );
};

const PrivacyHero = () => {
  return (
    <div className="relative mb-8 overflow-hidden rounded-[38px] border border-white/[0.07] bg-[#0f172a]/45 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.30)] backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute -left-24 -top-24 size-72 rounded-full bg-cyan-400/[0.10] blur-3xl" />
        <span className="absolute -right-24 bottom-0 size-80 rounded-full bg-emerald-400/[0.08] blur-3xl" />
        <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent" />
      </div>

      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-cyan-100/75">
            <FiMinus />
            Privacy policy
          </span>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white/94 sm:text-6xl">
            Data protection for your learning account.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/46">
            How Gorkcoder handles account data, payments, course progress, resources, refunds, downloads, comments, and support information.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-3">
          <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.04] p-4">
            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/36">Last updated</p>
            <p className="mt-2 text-xl font-semibold text-white/86">{lastUpdated}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <span className="flex h-12 items-center justify-center rounded-2xl bg-cyan-300/[0.08] text-cyan-100/75">
                <FiShield />
              </span>
              <span className="flex h-12 items-center justify-center rounded-2xl bg-violet-300/[0.08] text-violet-100/75">
                <FiLock />
              </span>
              <span className="flex h-12 items-center justify-center rounded-2xl bg-emerald-300/[0.08] text-emerald-100/75">
                <FiDatabase />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivacyStackItem = ({ icon, label, text }) => {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 transition-all hover:border-cyan-300/[0.12] hover:bg-cyan-300/[0.04]">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-white/42 group-hover:text-cyan-100/75">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold text-white/72">{label}</span>
        <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.1em] text-white/28">{text}</span>
      </span>
    </div>
  );
};

const ContactCard = ({ icon, label, value, href }) => {
  return (
    <a
      href={href}
      className="group flex min-w-0 items-center gap-3 rounded-2xl border border-gray-200/75 bg-white/45 p-3 transition-all duration-300 hover:border-cyan-300/30 hover:bg-white/65 dark:border-white/[0.055] dark:bg-white/[0.018] dark:hover:border-cyan-300/[0.10] dark:hover:bg-white/[0.028]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-500/[0.06] text-cyan-700 dark:border-cyan-300/[0.08] dark:text-cyan-200/65">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[8px] font-semibold uppercase tracking-[0.12em] text-white/30">{label}</span>
        <span className="mt-0.5 block truncate text-[10px] font-semibold text-white/62 group-hover:text-cyan-100/80">{value}</span>
      </span>
    </a>
  );
};
