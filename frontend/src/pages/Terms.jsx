import { HeadingThree } from "@/components/customeUI/Title";
import React from "react";
import { FiGlobe, FiMail, FiMinus, FiPhone } from "react-icons/fi";
import { TbArrowRightToArc } from "react-icons/tb";

export const Terms = () => {
  return (
    <div>
      <section className="term">
        <div className="container">
          <HeadingForTerm title="Terms & Condition" caption="Rules and guidelines for using this website" />
          <div className="content">
            <div className="title text-xl flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Terms and Conditions</h4>
            </div>
            <div className="para text-m py-3 ml-8">
              <p className="mb-3">Last updated: June 16, 2023</p>
              <p>Welcome to my personal portfolio website. By accessing or using this website, you agree to comply with and be bound by the following terms and conditions.</p>
            </div>
            <div className="title text-xl flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Interpretation and Definitions</h4>
            </div>
            <div className="para text-m py-3 ml-8">
              <HeadingThree>Interpretation</HeadingThree>
              <p className="mb-3">
                The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether
                they appear in singular or in plural.
              </p>
              <HeadingThree>Definitions</HeadingThree>
              <p>For the purposes of these Terms and Conditions:</p>

              <ul className=" list-decimal ml-8 flex flex-col gap-3 py-3">
                <li>
                  <strong>Portfolio Website</strong> (referred to as "the Website," "My Website," or "this Site") refers to Sunil's MERN Stack Developer Portfolio, accessible at [YourWebsiteURL.com].
                </li>
                <li>
                  <strong>I/Me/My</strong> (referred to as "the Developer," "I," or "My") refers to Sunil, the owner and operator of this portfolio website.
                </li>
                <li>
                  <strong>You/User</strong> means any individual, company, or legal entity accessing or using this Website.
                </li>
                <li>
                  <strong>Device</strong> means any tool (e.g., computer, smartphone, tablet) used to access the Website.
                </li>
                <li>
                  <strong>Content</strong> includes all text, code, images, projects, blog posts, and materials displayed on this Website.
                </li>
                <li>
                  <strong>Third-Party Services</strong> refers to external platforms (e.g., GitHub, LinkedIn, Netlify) linked to or integrated with this Website.
                </li>
              </ul>
            </div>
            <div className="title text-xl mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Acknowledgment</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-3">These Terms govern your use of Sunil's MERN Stack Developer Portfolio website and form an agreement between you and Sunil.</p>
              <p className="mb-3">By accessing or using this portfolio website, you automatically agree to these Terms and Conditions, which apply to all visitors.</p>
              <p className="mb-3">If you disagree with any part of these Terms, please refrain from using this website.</p>
              <p className="mb-3">This portfolio website is open to users of all ages. There are no age restrictions for accessing this site.</p>
              <p className="mb-3">
                Your use of this website is also governed by Sunil's{" "}
                <a href="#privacy-policy" className="text-blue-500">
                  Privacy Policy
                </a>
                , which explains how any collected information may be used.
              </p>
            </div>
            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Links to Other Websites</h4>
            </div>
            <div className="para text-m ml-8">
              <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.</p>
              <p className="py-3">
                The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and
                agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance
                on any such content, goods or services available on or through any such web sites or services.
              </p>
              <p>We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.</p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Termination</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-3">
                We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and
                Conditions.
              </p>
              <p>Upon termination, Your right to use the Service will cease immediately.</p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Limitation of Liability</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-3">
                As the developer of this portfolio website, I shall not be held liable for any damages or losses you might incur while using this site. Since this is a non-commercial portfolio, no
                financial remedies apply.
              </p>
              <p className="mb-3">
                To the fullest extent permitted by law, I expressly disclaim liability for any indirect, incidental, special, or consequential damages resulting from your use of this portfolio
                website, including but not limited to loss of data, privacy issues, or system failures.
              </p>
              <p className="mb-3">
                This portfolio displays my work samples and professional information. You agree not to hold me responsible for any decisions made based on the content of this website.
              </p>
              <p className="mb-3">
                Some jurisdictions don't allow limitations on liability, so these restrictions may not apply to you. Where permitted, my liability is limited to the maximum extent allowed by law.
              </p>
            </div>
            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>"AS IS" and "AS AVAILABLE" Disclaimer</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-3">
                This portfolio website is provided "AS IS" and "AS AVAILABLE," without warranties of any kind. As a personal showcase of my work, I make no guarantees about the completeness, accuracy,
                or reliability of the content.
              </p>
              <p className="mb-3">I expressly disclaim all warranties, including but not limited to:</p>
              <ul className="list-disc ml-8 mb-3">
                <li>Warranties of merchantability or fitness for any particular purpose</li>
                <li>Guarantees that the site will be error-free or uninterrupted</li>
                <li>Assurances about compatibility with all devices or browsers</li>
                <li>Claims that the site is free from viruses or harmful components</li>
              </ul>
              <p className="mb-3">The projects and information shown represent my work at specific points in time and may not reflect current capabilities or availability.</p>
              <p className="mb-3">
                Some jurisdictions don't allow disclaimer of implied warranties, so these limitations may not apply to you. Where permitted, they apply to the fullest extent allowed by law.
              </p>
            </div>
            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Governing Law</h4>
            </div>
            <div className="para text-m ml-8">
              <p>
                These Terms and your use of this portfolio shall be governed by the laws of [Your Country/State], excluding its conflict of law provisions. Your use may also be subject to other local
                laws.
              </p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Dispute Resolution</h4>
            </div>
            <div className="para text-m ml-8">
              <p>If you have any concerns about this portfolio, please first contact me directly at [your@email.com] to resolve the matter informally.</p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>EU Users</h4>
            </div>
            <div className="para text-m ml-8">
              <p>If you're an EU resident, you may benefit from mandatory consumer protection provisions of your country of residence.</p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>US Compliance</h4>
            </div>
            <div className="para text-m ml-8">
              <p>You confirm you're not in a US-embargoed country or on any US government restricted parties list.</p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Termination</h4>
            </div>
            <div className="para text-m ml-8">
              <p>I reserve the right to terminate or restrict access to this portfolio at any time without notice.</p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Severability</h4>
            </div>
            <div className="para text-m ml-8">
              <p>
                If any part of these Terms is found invalid or unenforceable, that portion will be interpreted to best achieve its intended purpose, while the remaining terms stay fully effective.
              </p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Waiver</h4>
            </div>
            <div className="para text-m ml-8">
              <p>If I don't enforce any part of these Terms, it doesn't mean I give up that right. Any waiver of a breach doesn't mean future breaches will be waived.</p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Language</h4>
            </div>
            <div className="para text-m ml-8">
              <p>If these Terms are translated, the English version remains the official and controlling version for any disputes.</p>
            </div>

            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Changes to Terms</h4>
            </div>
            <div className="para text-m ml-8">
              <p>I may update these Terms occasionally. For significant changes, I'll provide reasonable notice. Your continued use means you accept the updated terms.</p>
            </div>
            <div className="title text-xl mt-5 mb-3 flex items-center gap-2 uppercase font-semibold text-orange-200">
              <TbArrowRightToArc size={18} />
              <h4>Contact Me</h4>
            </div>
            <div className="para text-m ml-8">
              <p className="mb-2">For questions about these Terms, please contact:</p>

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
    </div>
  );
};

export const HeadingForTerm = ({ title, caption }) => {
  return (
    <>
      <div className="flex justify-between pb-20">
        <div className="heading flex flex-col justify-end">
          <h3 className="mt-3 font-semibold text-3xl heading-gardient term-title">{title}</h3>
          <p className="text-m flex items-center gap-1">
            <FiMinus />
            <span> {caption}</span>
          </p>
        </div>
        <div>
          <img src="../image/home/background.svg" alt="background" />
        </div>
        <div className=" absolute top-0 left-0 w-full h-[50vh]">
          <img src="../image/home/breadcrumb-bg.png" alt="background" className="w-full h-full" />
        </div>
      </div>
    </>
  );
};
