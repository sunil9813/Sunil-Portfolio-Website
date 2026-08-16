import {
  FiAlertCircle,
  FiArrowUpRight,
  FiBookOpen,
  FiCheckCircle,
  FiCreditCard,
  FiFileText,
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

const quickTerms = [
  {
    icon: <FiUserCheck />,
    title: "Account access",
    text: "Free resources may require login. Paid courses and premium resources require both login and successful purchase.",
  },
  {
    icon: <FiCreditCard />,
    title: "Payments",
    text: "Payments may be processed through Stripe, eSewa, or other supported checkout providers shown at checkout.",
  },
  {
    icon: <FiRefreshCw />,
    title: "Refunds",
    text: "Refund requests can be submitted from your account dashboard and are reviewed based on order status, access history, and platform policy.",
  },
];

const termSections = [
  {
    icon: <FiShield />,
    title: "1. Agreement to these terms",
    body: [
      "These Terms & Conditions apply when you access or use the Gorkcoder / Sunil B.K portfolio website, dashboard, courses, notes, downloadable resources, comments, bookmarks, orders, invoices, payment flows, and related services.",
      "By using this website, creating an account, purchasing a course, downloading a resource, submitting a comment, or contacting me through the website, you agree to follow these terms.",
      "If you do not agree with these terms, please stop using the website and do not purchase or download any resource.",
    ],
  },
  {
    icon: <FiBookOpen />,
    title: "2. Portfolio, courses, notes, and resources",
    body: [
      "The website includes portfolio projects, blog posts, courses, notes, chapters, subheadings, PDFs, files, images, videos, and other learning or project resources.",
      "Free content is provided for learning and preview purposes. Premium or paid content is available only to users who have completed the required purchase or received approved access.",
      "I may update, improve, remove, rename, reorganize, or replace content at any time to keep the platform clean, useful, and accurate.",
    ],
  },
  {
    icon: <FiUserCheck />,
    title: "3. User accounts and responsibilities",
    body: [
      "You are responsible for keeping your account login details safe and for all activity that happens under your account.",
      "You agree not to share paid course access, private download links, receipts, invoices, dashboard access, or protected files with others.",
      "You must not use the website to upload harmful content, spam comments, abuse likes/bookmarks/views, attempt unauthorized access, or interfere with the platform.",
    ],
  },
  {
    icon: <FiShoppingBag />,
    title: "4. Orders, paid access, and digital delivery",
    body: [
      "When you purchase a paid course or digital resource, access is granted after the payment is successfully confirmed by the payment provider and recorded by the platform.",
      "Digital products may include course chapters, subchapters, downloadable resources, PDFs, source files, project materials, invoices, receipts, and secure links.",
      "Because digital access can be delivered instantly, please review the title, description, price, and access type before placing an order.",
    ],
  },
  {
    icon: <FiCreditCard />,
    title: "5. Payments through Stripe, eSewa, or other providers",
    body: [
      "Checkout may use third-party payment providers such as Stripe and eSewa. These providers may collect and process payment details according to their own terms and privacy policies.",
      "I do not store full card numbers, CVV codes, or sensitive payment credentials on this website.",
      "Payment status, order amount, discounts, coupons, transaction references, receipts, paid date, and invoice details may be stored so the platform can verify access, provide support, and manage refunds.",
    ],
  },
  {
    icon: <FiRefreshCw />,
    title: "6. Refunds and cancellation",
    body: [
      "Refund requests can be submitted from the user dashboard for eligible orders. Each request is reviewed manually.",
      "A refund may be declined if the order has already been heavily accessed, downloaded, abused, shared, or if the request does not meet the refund requirements shown in the dashboard.",
      "If a refund is approved, access to the refunded paid course or resource may be removed. Refund timing depends on the payment provider and banking network.",
    ],
  },
  {
    icon: <FiLock />,
    title: "7. Intellectual property and content usage",
    body: [
      "All original website design, course content, notes, written explanations, project materials, UI layouts, code samples, images, invoices, and platform content belong to Sunil B.K / Gorkcoder unless stated otherwise.",
      "You may use learning materials for personal study and practice. You may not resell, redistribute, upload, publish, clone, or claim the content as your own.",
      "Portfolio projects and examples are shared to demonstrate development skills and learning resources. External logos, libraries, tools, and payment providers remain the property of their owners.",
    ],
  },
  {
    icon: <FiAlertCircle />,
    title: "8. Comments, reviews, likes, bookmarks, and community use",
    body: [
      "You may interact with content through comments, reviews, likes, bookmarks, views, and other engagement features where available.",
      "You agree not to post abusive, misleading, hateful, illegal, copied, promotional, or harmful content.",
      "I may edit, hide, reject, remove, or report content that harms the platform, users, or the quality of the community experience.",
    ],
  },
  {
    icon: <FiShield />,
    title: "9. Security, availability, and acceptable use",
    body: [
      "You must not attempt to bypass login, paid access, protected routes, payment verification, download limits, or admin-only areas.",
      "The website may occasionally be unavailable because of maintenance, hosting issues, payment provider downtime, database migration, or technical upgrades.",
      "I will try to keep the platform stable, but I cannot guarantee uninterrupted access at all times.",
    ],
  },
  {
    icon: <FiCheckCircle />,
    title: "10. Disclaimer and limitation of liability",
    body: [
      "The website and its content are provided for portfolio, educational, and digital resource purposes. Content is provided “as is” and “as available.”",
      "Although I try to keep information accurate and useful, I do not guarantee that every explanation, file, project, note, or course will be error-free or suitable for every use case.",
      "To the fullest extent permitted by law, Sunil B.K / Gorkcoder will not be responsible for indirect losses, lost data, lost profit, missed opportunities, or damages caused by your use of the website.",
    ],
  },
  {
    icon: <FiGlobe />,
    title: "11. Third-party links and services",
    body: [
      "The website may link to third-party platforms such as GitHub, social media, payment providers, design references, hosting platforms, documentation websites, or external resources.",
      "I am not responsible for the content, security, privacy practices, payment flow, login issues, or availability of third-party websites.",
      "Please review the policies of any third-party service before sharing information or completing payment there.",
    ],
  },
  {
    icon: <FiAlertCircle />,
    title: "12. Changes to these terms",
    body: [
      "I may update these Terms & Conditions when the platform changes, new payment methods are added, refund rules are improved, or new features are released.",
      "The updated terms will be posted on this page with a new last-updated date. Continued use of the website means you accept the latest version.",
    ],
  },
];

export const Terms = () => {
  return (
    <section className="term relative overflow-hidden pt-3 pb-8 sm:pb-10">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute -left-28 top-28 size-80 rounded-full bg-cyan-500/[0.10] blur-3xl" />
        <span className="absolute -right-28 top-10 size-96 rounded-full bg-violet-500/[0.09] blur-3xl" />
        <span className="absolute bottom-20 left-1/2 size-80 -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-3xl" />
        <span className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:54px_54px]" />
      </div>

      <div className="container relative z-10">
        <HeadingForTerm title="Terms & Conditions" caption="Rules for using Gorkcoder courses, notes, payments, refunds, and portfolio resources" />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0">
            <div className="rounded-[34px] border border-gray-200/70 bg-gray-50/65 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.055)] backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.018]">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent dark:via-white/24" />
              <div className="pointer-events-none absolute -right-24 top-16 size-72 rounded-full bg-cyan-300/[0.06] blur-3xl" />
              <div className="pointer-events-none absolute -left-20 bottom-32 size-72 rounded-full bg-violet-300/[0.05] blur-3xl" />

              <div className="relative mb-5 overflow-hidden rounded-[28px] border border-gray-200/70 bg-white/58 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.06] dark:bg-white/[0.022] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_16px_45px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-cyan-400/[0.08] blur-3xl" />
                <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
                <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-500/[0.06] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:border-cyan-300/[0.10] dark:text-cyan-200/70">
                      <FiShield />
                      Legal workspace
                    </span>
                    <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-white/92 sm:text-4xl">
                      Clear rules for learning, buying, downloading, and using Gorkcoder.
                    </h1>
                    <p className="mt-3 max-w-2xl text-[12px] leading-6 text-white/45">
                      Built around your real product flow: accounts, course access, notes/resources, secure payments, invoices, refunds, comments, likes, bookmarks, and protected downloads.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200/80 bg-white/60 px-4 py-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-white/[0.06] dark:bg-white/[0.025]">
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/35">Last updated</p>
                    <p className="mt-1 text-xs font-bold text-white/78">{lastUpdated}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-cyan-300/20 bg-cyan-500/[0.055] p-4 dark:border-cyan-300/[0.08]">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-200/65">Access model</p>
                  <p className="mt-2 text-lg font-semibold text-white/88">Free + Paid</p>
                  <p className="mt-1 text-[10px] leading-5 text-white/42">Login unlocks free protected content. Paid content unlocks after purchase.</p>
                </div>
                <div className="rounded-[22px] border border-violet-300/20 bg-violet-500/[0.055] p-4 dark:border-violet-300/[0.08]">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-200/65">Payments</p>
                  <p className="mt-2 text-lg font-semibold text-white/88">Stripe / eSewa</p>
                  <p className="mt-1 text-[10px] leading-5 text-white/42">Orders, invoices, payment status, and discounts are handled through checkout.</p>
                </div>
                <div className="rounded-[22px] border border-emerald-300/20 bg-emerald-500/[0.055] p-4 dark:border-emerald-300/[0.08]">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-200/65">Support</p>
                  <p className="mt-2 text-lg font-semibold text-white/88">Refund review</p>
                  <p className="mt-1 text-[10px] leading-5 text-white/42">Refund requests are reviewed from your account dashboard.</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {quickTerms.map((item, index) => (
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
                    <FiFileText />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white/88">Short version</h3>
                    <p className="mt-1 text-[11px] leading-5 text-white/42">
                      Use the platform honestly, respect paid access, do not redistribute resources, and contact support from your dashboard if an order or refund needs review.
                    </p>
                  </div>
                  <a
                    href="/contact"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 text-[10px] font-semibold text-white/76 transition-all hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-300/[0.06] hover:text-cyan-100"
                  >
                    Contact
                    <FiArrowUpRight />
                  </a>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {termSections.map((section, index) => (
                  <article
                    id={getSectionId(section.title)}
                    key={section.title}
                    className="group scroll-mt-28 rounded-[26px] border border-gray-200/75 bg-white/48 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/68 hover:shadow-[0_18px_42px_rgba(15,23,42,0.07)] dark:border-white/[0.06] dark:bg-white/[0.018] dark:hover:border-cyan-300/[0.12] dark:hover:bg-white/[0.03] sm:p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-white/42 transition-colors group-hover:border-cyan-300/25 group-hover:bg-cyan-500/[0.06] group-hover:text-cyan-100">
                        {section.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/30">
                            Section {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h2 className="mt-2 text-base font-semibold capitalize tracking-[-0.02em] text-white/88">{section.title}</h2>
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
            <div className="space-y-4">
              <div className="rounded-[24px] border border-gray-200/70 bg-gray-50/65 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.055)] backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.018]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white/86">On this page</h3>
                  <span className="rounded-full border border-white/[0.07] bg-white/[0.035] px-2 py-1 text-[8px] font-semibold text-white/32">{termSections.length}</span>
                </div>

                <div className="space-y-1 overflow-y-auto pr-1 [scrollbar-color:rgba(103,232,249,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-cyan-200/25 [&::-webkit-scrollbar-track]:bg-transparent">
                  {termSections.map((section, index) => (
                    <a
                      key={section.title}
                      href={`#${getSectionId(section.title)}`}
                      className="group flex items-center gap-2 rounded-2xl px-2.5 py-2 text-[10px] font-bold text-white/42 transition-all hover:bg-cyan-300/[0.055] hover:text-cyan-100/80"
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
                    <span className="flex size-14 items-center justify-center rounded-2xl border border-white/[0.14] bg-white/[0.08] text-2xl font-semibold text-white/90">G</span>
                    <p className="mt-5 text-[8px] font-semibold uppercase tracking-[0.16em] text-cyan-100/50">Gorkcoder platform</p>
                    <h3 className="mt-1 text-xl font-semibold leading-tight tracking-[-0.03em] text-white">Sunil B.K Portfolio & Learning Hub</h3>
                    <p className="mt-3 text-[11px] leading-5 text-white/48">Portfolio projects, notes, courses, resources, invoices, refunds, comments, and secure account access in one place.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-gray-200/70 bg-gray-50/60 p-5 backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.018]">
                <h3 className="text-sm font-semibold text-white/86">Contact for terms</h3>
                <p className="mt-2 text-[11px] leading-5 text-white/40">For questions about access, orders, refunds, or these terms, contact me here.</p>

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
                  This page is written for your website experience and platform rules. For formal legal requirements, review it with a legal professional before production launch.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
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
        <span className="mt-0.5 block truncate text-[10px] font-bold text-white/62 group-hover:text-cyan-100/80">{value}</span>
      </span>
    </a>
  );
};

export const HeadingForTerm = ({ title, caption }) => {
  return (
    <div className="relative mb-8 overflow-hidden rounded-[34px] border border-gray-200/70 bg-gray-50/60 p-6 backdrop-blur-2xl dark:border-white/[0.065] dark:bg-white/[0.022] dark:shadow-[0_24px_80px_rgba(0,0,0,0.30)] sm:p-8">
      <div className="pointer-events-none absolute inset-0">
        <img src="/image/home/breadcrumb-bg.png" alt="" className="h-full w-full object-cover opacity-[0.07] dark:opacity-[0.10]" />
        <span className="absolute -right-20 -top-24 size-72 rounded-full bg-cyan-400/[0.10] blur-3xl" />
        <span className="absolute -bottom-24 left-16 size-72 rounded-full bg-violet-400/[0.09] blur-3xl" />
        <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent dark:via-white/22" />
      </div>

      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/[0.07] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:border-cyan-300/[0.09] dark:text-cyan-200/72">
            <FiMinus />
            Policy center
          </span>
          <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.05em] text-white/92 sm:text-5xl">{title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">{caption}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-[26px] border border-gray-200/80 bg-white/55 p-2 shadow-[0_12px_30px_rgba(15,23,42,0.06)] dark:border-white/[0.06] dark:bg-white/[0.025]">
          <div className="flex size-16 items-center justify-center rounded-[20px] bg-cyan-500/[0.08] text-2xl text-cyan-700 dark:text-cyan-200/70">
            <FiShield />
          </div>
          <div className="flex size-16 items-center justify-center rounded-[20px] bg-violet-500/[0.08] text-2xl text-violet-700 dark:text-violet-200/70">
            <FiBookOpen />
          </div>
        </div>
      </div>
    </div>
  );
};
