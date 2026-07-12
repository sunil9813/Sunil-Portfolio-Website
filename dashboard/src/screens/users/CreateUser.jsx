import { BreadcrumbsComponent, GhostButton, HeadingTwo, Input, PrimaryButton, StickyHeader, TertiaryButton, Wrapper } from "@/routes";
import { useNavigate } from "react-router-dom";

export const CreateUser = () => {
  const navigate = useNavigate();

  return (
    <>
      <StickyHeader>
        <HeadingTwo>New User</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton onClick={() => navigate("/all-University")}>Cancel</GhostButton>
          <TertiaryButton>Create</TertiaryButton>
        </div>
      </StickyHeader>

      <Wrapper>
        <div className="px-5 pt-5">
          <BreadcrumbsComponent currentPage="Create User" space={true} />
        </div>
        <form action="inner-form" className="p-5">
          <div className="flex justify-between items-center w-full gap-5">
            <div className="w-1/2">
              <span className="textColor block text-xs 3xl:text-xs mb-2">Full Name</span>
              <Input type="text" name="name" placeholder="Jhon Doe" />
            </div>
            <div className="w-1/2">
              <span className="textColor block text-xs 3xl:text-xs mb-2">Email</span>
              <Input type="text" name="name" placeholder="example@gmail.com" />
            </div>
          </div>
          <div className="flex justify-between items-center w-full gap-5 mt-3">
            <div className="w-1/2">
              <span className="textColor block text-xs 3xl:text-xs mb-2">Password </span>
              <Input type="text" name="password" placeholder="*******" />
            </div>
            <div className="w-1/2">
              <span className="textColor block text-xs 3xl:text-xs mb-2">Confirmed Password </span>
              <Input type="text" name="password" placeholder="*******" />
            </div>
          </div>
          <div className="w-52">
            <PrimaryButton text="Submit" />
          </div>
        </form>
      </Wrapper>
    </>
  );
};
