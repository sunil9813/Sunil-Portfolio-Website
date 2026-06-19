import { AdvancedTrafficChannelAnalysis } from "./AdvancedTrafficChannelAnalysis";
import { Summary } from "./Summary";
import { WelcomeUser } from "./WelcomeUser";

// ----- Main Component (unchanged usage) -----
export const Overview = () => {
  return (
    <>
      <WelcomeUser />
      <div className="my-3"></div>
      <Summary />
      <div className="my-3">
        <AdvancedTrafficChannelAnalysis />
      </div>
    </>
  );
};
