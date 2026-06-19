import { Countries } from "./Countries";
import { Device } from "./Device";
import { GenderAnalytics } from "./Gender";
import { OverviewUser } from "./TotalUser";
import { UserInsights, UserInsightsSummary } from "./UserInsights";

export const Overview = () => {
  return (
    <>
      <UserInsights />
      <section className="flex justify-between gap-3">
        <div className="w-[70%]">
          <OverviewUser />
          <GenderAnalytics />
        </div>
        <div className="w-[30%]">
          <Device />
          <Countries />
        </div>
      </section>
      <UserInsightsSummary />
    </>
  );
};
