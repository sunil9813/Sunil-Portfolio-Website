import { TertiaryButton } from "@/components/customeUI/Button";
import { HeadingThree } from "@/components/customeUI/Title";

import { GoArrowDown } from "react-icons/go";
import { FaLinkedinIn } from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";

import { teamData, imageData, floatingTeamMembers } from "@/assets/dummyData";

export const Team = () => {
  return (
    <section className="team">
      {/* ============================================ */}
      {/* EXISTING BACKGROUND CIRCLES                  */}
      {/* ============================================ */}

      <TeamsHeader />

      {/* ============================================ */}
      {/* EXISTING FLOATING TEAM MEMBERS               */}
      {/* ============================================ */}

      <TeamsMember />

      {/* ============================================ */}
      {/* EXISTING BACKGROUND                          */}
      {/* ============================================ */}

      <div className="TeamsHeader_headerBg"></div>

      {/* ============================================ */}
      {/* MAIN CONTENT                                 */}
      {/* ============================================ */}

      <div className="container relative z-50">
        {/* ========================================== */}
        {/* HEADER                                     */}
        {/* ========================================== */}
        <div className="heading mx-auto mt-28 flex max-w-[900px] flex-col items-center text-center">
          {/* Small label */}
          <div
            className="
      mb-7
      inline-flex
      items-center
      gap-2
      rounded-full
      border border-orange-400/10
      bg-[#282028]/80
      px-5
      py-1.5
      backdrop-blur-md
    "
          >
            <span
              className="
        h-1.5
        w-1.5
        rounded-full
        bg-orange-400
        shadow-[0_0_8px_rgba(251,146,60,0.5)]
      "
            />

            <span
              className="
        text-[11px]
        font-medium
        uppercase
        tracking-[0.16em]
        text-orange-400
      "
            >
              Our Team
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="
      max-w-[900px]
      text-[42px]
      font-semibold
      leading-[1.05]
      tracking-[-0.045em]
      text-white

      sm:text-[48px]
      md:text-[54px]
      lg:text-[60px]
    "
          >
            <span
              className="
        relative
        inline-flex
        items-center
        overflow-hidden
        rounded-[16px]
        border border-cyan-300/[0.14]
        bg-[#12313f]/65
        px-5
        py-2
        text-[#a8def3]
        backdrop-blur-xl
      "
            >
              {/* subtle top shine */}
              <span
                className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-px
          w-[70%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-cyan-200/30
          to-transparent
        "
              />

              <span className="relative z-10">Your team,</span>
            </span>

            <span className="mt-3 block">reimagined for what’s next.</span>
          </h1>

          {/* Description */}
          <p
            className="
      mt-7
      max-w-[620px]
      text-[14px]
      leading-7
      text-white/40
      sm:text-[15px]
    "
          >
            A team of developers, designers and engineers working together to turn ambitious ideas into polished digital products, scalable systems and meaningful experiences.
          </p>

          {/* Actions */}
          <div
            className="
      mt-8
      flex
      flex-wrap
      items-center
      justify-center
      gap-4
    "
          >
            <TertiaryButton>Meet the Team</TertiaryButton>

            <button
              type="button"
              className="
        group
        flex
        items-center
        gap-2
        px-3
        py-2
        text-[13px]
        font-medium
        text-white/45
        transition-colors
        duration-300
        hover:text-white
      "
            >
              Learn more
              <GoArrowDown
                className="
          text-[14px]
          transition-transform
          duration-300
          group-hover:translate-y-1
        "
              />
            </button>
          </div>
        </div>
        {/* ========================================== */}
        {/* TEAM GRID                                  */}
        {/* ========================================== */}

        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-3
            py-24
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {teamData.map((member, index) => {
            const matchingImage = imageData.find((image) => image.id === member.id);

            if (!matchingImage) return null;

            /*
             * Keeping your existing mask system.
             * Using member id instead of Math.random()
             * so every member keeps the same shape
             * after React re-renders.
             */
            const maskNumber = ((member.id - 1) % 7) + 1;
            const maskUrl = `/image/team/v${maskNumber}.svg`;

            return <TeamCard key={member.id} member={member} index={index} matchingImage={matchingImage} maskUrl={maskUrl} />;
          })}
        </div>
      </div>
    </section>
  );
};

/* ========================================================== */
/* TEAM CARD                                                  */
/* ========================================================== */

const TeamCard = ({ member, index, matchingImage, maskUrl }) => {
  return (
    <article
      className="
        group
        relative
        isolate
        overflow-hidden
        rounded-[24px]

        border
        border-white/[0.055]

        bg-white/[0.018]

        transition-all
        duration-500
        ease-out

        hover:-translate-y-1
        hover:border-white/[0.11]
        hover:bg-white/[0.025]
      "
    >
      {/* ===================================================== */}
      {/* VERY SUBTLE TOP GLOW                                  */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-90px]
          h-[180px]
          w-[70%]
          -translate-x-1/2
          rounded-full
          bg-cyan-300/[0.035]
          blur-[70px]
          opacity-0
          transition-opacity
          duration-700
          group-hover:opacity-100
        "
      />

      {/* ===================================================== */}
      {/* IMAGE AREA                                            */}
      {/* ===================================================== */}

      <div
        className="
          relative
          m-[6px]
          overflow-hidden
          rounded-[19px]
          bg-[#0b0d11]/80
        "
      >
        {/* background image */}

        <img
          src={matchingImage.image}
          alt=""
          aria-hidden="true"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover

            opacity-[0.26]
            saturate-[0.8]

            transition-all
            duration-700

            group-hover:scale-[1.04]
            group-hover:opacity-[0.34]
          "
        />

        {/* background overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-b
            from-white/[0.015]
            via-transparent
            to-[#080a0d]/80
          "
        />

        {/* side vignette */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-r
            from-black/10
            via-transparent
            to-black/10
          "
        />

        {/* =================================================== */}
        {/* PROFILE                                             */}
        {/* =================================================== */}

        <div
          className="
            relative
            z-10
            flex
            h-[280px]
            items-center
            justify-center
            overflow-hidden
          "
        >
          <img
            src={member.profile}
            alt={member.name}
            loading="lazy"
            className="
              profile-image
              h-[96%]
              w-[96%]
              object-cover

              transition-transform
              duration-700
              ease-out

              group-hover:scale-[1.035]
            "
            style={{
              maskImage: `url(${maskUrl})`,
              WebkitMaskImage: `url(${maskUrl})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          />

          {/* image bottom fade */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              z-20
              h-[100px]
              bg-gradient-to-t
              from-[#090b0e]
              via-[#090b0e]/50
              to-transparent
            "
          />

          {/* ================================================= */}
          {/* TOP META                                          */}
          {/* ================================================= */}

          <div
            className="
              absolute
              left-3.5
              right-3.5
              top-3.5
              z-30
              flex
              items-center
              justify-between
            "
          >
            {/* number */}

            <span
              className="
                flex
                h-8
                min-w-8
                items-center
                justify-center

                rounded-full

                border
                border-white/[0.075]

                bg-black/20

                px-2

                text-[8px]
                font-semibold
                tracking-[0.16em]
                text-white/35

                backdrop-blur-xl
              "
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* LinkedIn */}

            <a
              href={member.link}
              target="_blank"
              rel="noreferrer"
              aria-label={`${member.name} LinkedIn`}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center

                rounded-full

                border
                border-white/[0.075]

                bg-black/20

                text-white/35

                backdrop-blur-xl

                transition-all
                duration-300

                hover:border-white/30
                hover:bg-white
                hover:text-black
              "
            >
              <FaLinkedinIn size={12} />
            </a>
          </div>

          {/* ================================================= */}
          {/* BOTTOM META                                       */}
          {/* ================================================= */}

          <div
            className="
              absolute
              bottom-3.5
              left-3.5
              right-3.5
              z-30

              flex
              items-center
              justify-between
              gap-2
            "
          >
            {/* team label */}

            <div
              className="
                flex
                items-center
                gap-2

                rounded-full

                border
                border-white/[0.06]

                bg-black/20

                px-2.5
                py-1.5

                backdrop-blur-xl
              "
            >
              <span
                className="
                  h-[4px]
                  w-[4px]
                  rounded-full
                  bg-orange-400
                "
              />

              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.17em]
                  text-white/32
                "
              >
                Team member
              </span>
            </div>

            {/* experience */}

            <div
              className="
                flex
                items-center
                gap-1.5

                rounded-full

                border
                border-white/[0.06]

                bg-black/20

                px-2.5
                py-1.5

                backdrop-blur-xl
              "
            >
              <span
                className="
                  h-[5px]
                  w-[5px]
                  rounded-full
                  bg-emerald-400
                  shadow-[0_0_7px_rgba(52,211,153,0.45)]
                "
              />

              <span
                className="
                  text-[8px]
                  font-medium
                  text-white/38
                "
              >
                {member.experience}
              </span>
            </div>
          </div>
        </div>

        {/* subtle inner edge */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-40
            rounded-[19px]
            ring-1
            ring-inset
            ring-white/[0.035]
          "
        />
      </div>

      {/* ===================================================== */}
      {/* CONTENT                                               */}
      {/* ===================================================== */}

      <div
        className="
          px-4
          pb-4
          pt-3
        "
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-3
          "
        >
          {/* member info */}

          <div className="min-w-0 flex-1">
            <h3
              className="
                truncate

                text-[15px]
                font-semibold
                leading-tight
                tracking-[-0.025em]

                text-white/90
              "
            >
              {member.name}
            </h3>

            <p
              className="
                mt-1
                truncate

                text-[10px]
                font-medium

                text-white/32
              "
            >
              {member.designation}
            </p>
          </div>

          {/* profile action */}

          <a
            href={member.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${member.name}`}
            className="
              group/link

              flex
              h-8
              w-8
              shrink-0

              items-center
              justify-center

              rounded-full

              border
              border-white/[0.06]

              bg-white/[0.025]

              text-white/25

              transition-all
              duration-300

              group-hover:border-white/[0.10]
              group-hover:text-white/55

              hover:!border-cyan-300/20
              hover:!bg-cyan-300/[0.06]
              hover:!text-cyan-200
            "
          >
            <HiArrowUpRight
              size={14}
              className="
                transition-transform
                duration-300

                group-hover/link:-translate-y-[1px]
                group-hover/link:translate-x-[1px]
              "
            />
          </a>
        </div>
      </div>

      {/* ===================================================== */}
      {/* TOP HOVER LINE                                        */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          left-1/2
          top-0

          h-px
          w-[45%]

          -translate-x-1/2

          bg-gradient-to-r
          from-transparent
          via-cyan-200/40
          to-transparent

          opacity-0

          transition-opacity
          duration-500

          group-hover:opacity-100
        "
      />
    </article>
  );
};
/* ========================================================== */
/* TEAMS HEADER                                               */
/* ========================================================== */

const TeamsHeader = () => {
  return (
    <div className="TeamsHeader_circles">
      {/* ============================================ */}
      {/* CIRCLE 01                                    */}
      {/* ============================================ */}

      <svg xmlns="http://www.w3.org/2000/svg" width="764" height="764" fill="none">
        <g filter="url(#circle-1_svg__a)" opacity="0.3">
          <circle cx="382" cy="382" r="379.5" stroke="url(#circle-1_svg__b)" strokeDasharray="4 6" strokeLinecap="round" transform="rotate(-90 382 382)" />
        </g>

        <defs>
          <linearGradient id="circle-1_svg__b" x1="2" x2="762" y1="2" y2="762" gradientUnits="userSpaceOnUse">
            <stop offset="0.146" stopColor="#fff" stopOpacity="0" />

            <stop offset="0.302" stopColor="#fff" stopOpacity="0.396" />

            <stop offset="0.427" stopColor="#fff" />

            <stop offset="0.568" stopColor="#fff" stopOpacity="0" />

            <stop offset="0.682" stopColor="#fff" stopOpacity="0.66" />

            <stop offset="0.807" stopColor="#fff" stopOpacity="0.29" />

            <stop offset="0.899" stopColor="#fff" stopOpacity="0.37" />
          </linearGradient>

          <filter id="circle-1_svg__a" width="764" height="764" x="0" y="0" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />

            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />

            <feGaussianBlur result="effect1_foregroundBlur_709_11734" stdDeviation="1" />
          </filter>
        </defs>
      </svg>

      {/* ============================================ */}
      {/* CIRCLE 02                                    */}
      {/* ============================================ */}

      <svg xmlns="http://www.w3.org/2000/svg" width="924" height="924" fill="none">
        <g filter="url(#circle-2_svg__a)" opacity="0.3">
          <circle cx="462" cy="462" r="459.5" stroke="url(#circle-2_svg__b)" strokeDasharray="4 6" strokeLinecap="round" />
        </g>

        <defs>
          <linearGradient id="circle-2_svg__b" x1="922" x2="2" y1="2" y2="922" gradientUnits="userSpaceOnUse">
            <stop offset="0.146" stopColor="#fff" stopOpacity="0" />

            <stop offset="0.302" stopColor="#fff" stopOpacity="0.396" />

            <stop offset="0.427" stopColor="#fff" />

            <stop offset="0.568" stopColor="#fff" stopOpacity="0" />

            <stop offset="0.682" stopColor="#fff" stopOpacity="0.66" />

            <stop offset="0.807" stopColor="#fff" stopOpacity="0.29" />

            <stop offset="0.899" stopColor="#fff" stopOpacity="0.37" />
          </linearGradient>

          <filter id="circle-2_svg__a" width="924" height="924" x="0" y="0" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />

            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />

            <feGaussianBlur result="effect1_foregroundBlur_709_11733" stdDeviation="1" />
          </filter>
        </defs>
      </svg>

      {/* ============================================ */}
      {/* CIRCLE 03                                    */}
      {/* ============================================ */}

      <svg xmlns="http://www.w3.org/2000/svg" width="604" height="604" fill="none">
        <g filter="url(#circle-3_svg__a)" opacity="0.3">
          <circle cx="302" cy="302" r="299.5" stroke="url(#circle-3_svg__b)" strokeDasharray="4 6" strokeLinecap="round" />
        </g>

        <defs>
          <linearGradient id="circle-3_svg__b" x1="2" x2="602" y1="2" y2="602" gradientUnits="userSpaceOnUse">
            <stop offset="0.146" stopColor="#fff" stopOpacity="0" />

            <stop offset="0.302" stopColor="#fff" stopOpacity="0.396" />

            <stop offset="0.427" stopColor="#fff" />

            <stop offset="0.568" stopColor="#fff" stopOpacity="0" />

            <stop offset="0.682" stopColor="#fff" stopOpacity="0.66" />

            <stop offset="0.807" stopColor="#fff" stopOpacity="0.29" />

            <stop offset="0.899" stopColor="#fff" stopOpacity="0.37" />
          </linearGradient>

          <filter id="circle-3_svg__a" width="604" height="604" x="0" y="0" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />

            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />

            <feGaussianBlur result="effect1_foregroundBlur_709_11732" stdDeviation="1" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

/* ========================================================== */
/* FLOATING TEAM MEMBERS                                      */
/* ========================================================== */

const TeamsMember = () => {
  return (
    <div className="TeamsHeader_circleAnchors">
      {floatingTeamMembers.map((member, index) => (
        <div
          key={`member-${index}`}
          className={`
            TeamsHeader_circleIconWrapper
            ${member.rotateDirection === "left" ? "TeamsHeader_rotateLeft" : "TeamsHeader_rotateRight"}
          `}
          style={{
            width: `${member.circleSize}px`,
            "--rotation": `${member.rotation}deg`,
          }}
        >
          <div className="TeamsHeader_circleIcon">
            <img
              alt={`Team member ${index + 1}`}
              loading="lazy"
              width={member.width}
              height={member.height}
              decoding="async"
              src={member.img}
              className="rounded-full object-cover"
              style={{
                width: `${member.width}px`,
                height: `${member.height}px`,
                minWidth: `${member.width}px`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
