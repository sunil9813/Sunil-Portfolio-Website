import { BreadcrumbsComponent, InputFiled, InputPassword, PrimaryButton, Wrapper } from "@/utils/Router";

export const CreateUser = () => {
  return (
    <>
      <BreadcrumbsComponent text="Create User" />
      <Wrapper className="p-5">
        <form action="inner-form">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <InputFiled fieldName="Username" type="text" name="name" placeholder="Jhon Doe" />
            </div>
            <div>
              <InputFiled fieldName="Email" type="email" name="email" placeholder="example@gmail.com" />
            </div>
            <div>
              <InputPassword fieldName="Password" name="password" placeholder="*******" />
            </div>
            <div>
              <InputFiled fieldName="Email" type="email" name="email" placeholder="example@gmail.com" />
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
