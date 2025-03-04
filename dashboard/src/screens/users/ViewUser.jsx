import { Breadcrumbs, Typography } from "@material-tailwind/react";

export const ViewUser = () => {
  return (
    <>
      <section className="user-list">
        <div className="">
          <Typography variant="h1">User</Typography>
          <Breadcrumbs />
        </div>
      </section>
    </>
  );
};
