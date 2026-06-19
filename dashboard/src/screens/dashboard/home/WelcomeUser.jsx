import { selectUser } from "@/redux/slices/authSlice";
import { HeadingTwo, Wrapper } from "@/utils/Router";
import { useSelector } from "react-redux";

export const WelcomeUser = () => {
  const user = useSelector(selectUser);

  const username = user?.name;
  return (
    <>
      {/* <Wrapper className="!bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient p-5 relative h-36 flex justify-between"> */}
      <Wrapper className="!bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 p-5 relative h-36 flex justify-between">
        <div className="w-1/3">
          <div className="img absolute -top-[29px] -left-1 z-50">
            <img src="https://react.spruko.com/vue/spruha/preview/images/pngs/29.png" alt="" className="w-full h-44 object-cover rounded-[40px]" />
          </div>
        </div>
        <div className="w-2/3 flex flex-col justify-end p-5">
          <HeadingTwo>{username}</HeadingTwo>
          <p className="text-xs mt-3 text-gray-300">You have two projects to finish, you had completed 57% from your montly level, Keep going to your level</p>
        </div>
      </Wrapper>
    </>
  );
};
