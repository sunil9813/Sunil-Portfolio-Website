import React from "react";
import { FiGlobe, FiMail, FiPhone } from "react-icons/fi";
import { TbArrowRightToArc } from "react-icons/tb";
import { HeadingForTerm } from "./Terms";

export const Privacy = () => {
  return (
    <>
      <section className="privacy-policy">
        <div className="container">
          <HeadingForTerm title="Privacy Policy" caption="How we handle your personal information" />
          <div className="content">
            <div className="title text-xl flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Privacy Policy</h4>
            </div>
            <div className="para text-m py-3 ml-8">
              <p className="mb-3">Last updated: June 16, 2023</p>
              <p>This Privacy Policy describes how Sunil's portfolio website collects, uses, and discloses your information when you use our site.</p>
            </div>

            <div className="title text-xl flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Information Collection</h4>
            </div>
            <div className="para text-m py-3 ml-8">
              <p className="mb-3">We may collect the following types of information:</p>
              <ul className="list-disc ml-8 flex flex-col gap-3 py-3">
                <li>
                  <strong>Personal Data:</strong> When you contact us via forms, we may collect your name, email address, and message content.
                </li>
                <li>
                  <strong>Usage Data:</strong> We automatically collect information about how you interact with our site, including IP address, browser type, and pages visited.
                </li>
                <li>
                  <strong>Cookies:</strong> We use cookies to enhance your experience and analyze site usage. You can disable cookies in your browser settings.
                </li>
              </ul>
            </div>

            <div className="title text-xl mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Use of Information</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-3">We use the collected information for the following purposes:</p>
              <ul className="list-disc ml-8 mb-3">
                <li>To provide and maintain our portfolio website</li>
                <li>To respond to your inquiries and messages</li>
                <li>To analyze and improve our website's performance</li>
                <li>To prevent technical issues and security risks</li>
              </ul>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Data Sharing</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-3">We do not sell your personal information. We may share data with:</p>
              <ul className="list-disc ml-8 mb-3">
                <li>Service providers who assist with website operations</li>
                <li>Analytics providers to understand website usage</li>
                <li>When required by law or to protect our rights</li>
              </ul>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Data Security</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-3">We implement appropriate security measures to protect your data. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Your Rights</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-3">Depending on your location, you may have rights to:</p>
              <ul className="list-disc ml-8 mb-3">
                <li>Access, update or delete your personal information</li>
                <li>Object to or restrict certain data processing</li>
                <li>Receive your data in a portable format</li>
                <li>Withdraw consent where applicable</li>
              </ul>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Third-Party Links</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-3">
                Our portfolio may contain links to other websites. We are not responsible for the privacy practices of these third-party sites. We encourage you to review their privacy policies.
              </p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Children's Privacy</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-3">Our portfolio is not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Changes to This Policy</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-3">We may update our Privacy Policy occasionally. We will notify you of any changes by posting the new policy on this page.</p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Contact Me</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-2">For questions about this Privacy Policy, please contact:</p>

              <ul className="list-disc ml-8">
                <li>
                  <div className="flex items-center gap-2 mb-2">
                    <FiMail size={16} />
                    <span>
                      Email:
                      <a href="mailto:sunilbk962@example.com" className="text-blue-400">
                        sunilbk962@example.com
                      </a>
                    </span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center gap-2 mb-2">
                    <FiGlobe size={16} />
                    <span>
                      Website:
                      <a href="https://sunil-portfolio.com" className="text-blue-400">
                        sunil-portfolio.com
                      </a>
                    </span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center gap-2">
                    <FiPhone size={16} />
                    <span>
                      Phone:
                      <a href="tel:+977 9813253082" className="text-blue-400">
                        +977 9813253082
                      </a>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
