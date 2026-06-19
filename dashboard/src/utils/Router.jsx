export { ProjectOverview } from "@/screens/dashboard/project/ProjectOverview";

export { BlogOverview } from "@/screens/dashboard/blog/BlogOverview";

export { CategoryOverview } from "@/screens/dashboard/category/CategoryOverview";

export { IncreaseWrapper, DecreaseWrapper } from "@/components/dashboard/IncAndDes";

export { IconCircle } from "@/components/dashboard/IconCircle";

export { Overview } from "@/screens/dashboard/user/Overview";
export { WelcomeUser } from "@/screens/dashboard/home/WelcomeUser";
/* --------- End Dashbaord ------------ */

export { TypeDropdown } from "@/components/common/dropdown/CustomeDropDown";
export { StickyHeaderComponent } from "@/components/header/StickyHeaderComponent";
export { UniversityDropDown, FacultyDropDown } from "@/screens/universityStructure/StructureAcademicDropDown";
export { AssetConfigure } from "@/pages/setting/AssetConfigure";

export { CreateProject } from "@/screens/project/CreateProject";
export { ProjectDetails } from "@/screens/project/ProjectDetails";
export { ProjectList } from "@/screens/project/ProjectList";
export { UpdateProject } from "@/screens/project/UpdateProject";
export { UserCreateProjectList } from "@/screens/project/UserCreateProjectList";

export { DropdownWrapper } from "@/components/common/DropdownWrapper";
export { RichTextRenderer } from "@/textEditor/render/RichTextRenderer";
export { ErrorPage } from "@/pages/ErrorPage";
export { Comments } from "@/components/comment/Comments";
export { FavoriteCard } from "@/components/cards/FavoriteCard";
export { Favorite } from "@/screens/profile/favorite/Favorite";
export { FavoriteButton } from "@/components/FavoriteButton";
export { LikeButton } from "@/components/LikeButton";
export { FilterPage } from "@/pages/FilterPage";

/* -----------  Common Design ----------- */
export { PrimaryButton, TertiaryButton, GhostButton } from "@/components/customeUI/Button";
export { HeadingOne, HeadingTwo, HeadingThree, InputLabel, InputTitle } from "@/components/customeUI/Title";
export { Wrapper, StickyHeader } from "@/components/customeUI/Wrapper";
export { BreadcrumbsComponent } from "@/components/cards/Breadcrumbs";
export { GlitterCards } from "@/components/cards/GlowCard";
export { InputCard } from "@/components/cards/GlowCard";
export { SearchBox } from "@/components/common/SearchBox";
export { ImageModel } from "@/components/ImageModel";
export { Input, InputForResume } from "@/components/customeUI/Input";

/* -----------  Common Design ----------- */

/* -----------  Hooks ----------- */
export { UseMouseMoveEffect } from "@/hook/UseMouseMoveEffect";
/* -----------  Hooks ----------- */

/* -----------  Common Components ----------- */
export { Logo } from "@/components/common/Logo";
export { InputPassword, InputFiled } from "@/components/common/InputPassword";
export { Loader } from "@/components/common/Loader";
export { Table } from "@/components/table/Table";
/* -----------  Common Components ----------- */

/* ---- ##########  Pages ########## -----------*/
export { Home } from "../pages/home/Home";
export { Layout, LayoutWithOutHeader } from "../components/common/Layout";

/* -----------  Auth ----------- */
export { ResetPassword } from "@/screens/auth/ResetPassword";
export { LoginWithOTP } from "@/screens/auth/LoginWithOTP";
export { ForgotPassword } from "@/screens/auth/ForgotPassword";
export { Signup } from "@/screens/auth/Signup";
export { Login } from "../screens/auth/Login";

/* -----------  User ----------- */
export { UserList } from "@/screens/users/UserList";
export { UpdateUserRole } from "@/screens/users/UpdateUserRole";
export { ViewUser } from "@/screens/users/ViewUser";
export { CreateUser } from "@/screens/users/CreateUser";

/* -----------  Category ----------- */
export { AddCategory } from "@/screens/category/AddCategory";
export { CategoryList } from "@/screens/category/CategoryList";
export { UpdateCategory } from "@/screens/category/UpdateCategory";
export { ViewCategory } from "@/screens/category/ViewCategory";

/* -----------  Blog ----------- */
export { BlogDetails } from "@/screens/blog/BlogDetails";
export { BlogList } from "@/screens/blog/BlogList";
export { CreateBlog } from "@/screens/blog/CreateBlog";
export { UpdateBlog } from "@/screens/blog/UpdateBlog";

/* -----------  University ----------- */
export { CreateUniversity } from "@/screens/universityStructure/university/CreateUniversity";
export { OverviewUniversity } from "@/screens/universityStructure/university/OverviewUniversity";
export { UniversityDetails } from "@/screens/universityStructure/university/UniversityDetails";
export { UpdateUniversity } from "@/screens/universityStructure/university/UpdateUniversity";

/* -----------  faculties ----------- */
export { CreateFaculty } from "@/screens/universityStructure/faculties/CreateFaculty";
export { FacultyOverview } from "@/screens/universityStructure/faculties/FacultyOverview";
export { ViewFaculty } from "@/screens/universityStructure/faculties/ViewFaculty";

/* -----------  programs ----------- */
export { CreateProgram } from "@/screens/universityStructure/programs/CreateProgram";
export { OverviewProgram } from "@/screens/universityStructure/programs/OverviewProgram";
export { UpdateProgram } from "@/screens/universityStructure/programs/UpdateProgram";
export { ViewProgram } from "@/screens/universityStructure/programs/ViewProgram";

/* -----------  Courses ----------- */
export { CreateCourse } from "@/screens/universityStructure/courses/CreateCourse";
export { CourseDetails } from "@/screens/universityStructure/courses/CourseDetails";
export { CourseList } from "@/screens/universityStructure/courses/CourseList";
export { UpdateCourse } from "@/screens/universityStructure/courses/UpdateCourse";
export { CoursesWiseAllChapter } from "@/screens/universityStructure/courses/allchapter/CoursesWiseAllChapter";

/* -----------  Chapter ----------- */
export { ChapterDetails } from "@/screens/universityStructure/chapter/ChapterDetails";
export { ChapterOverview } from "@/screens/universityStructure/chapter/ChapterOverview";
export { CreateChapterr } from "@/screens/universityStructure/chapter/CreateChapterr";
export { UpdateChapter } from "@/screens/universityStructure/chapter/UpdateChapter";

/* ---- ##########  Pages ########## -----------*/

/* ---- ########## Portfolio Pages ########## -----------*/
/* -----------  About / Intro ----------- */
export { CreateAbout } from "@/screens/portfolio/about/CreateAbout";
export { AboutList } from "@/screens/portfolio/about/AboutList";
export { UpdateAbout } from "@/screens/portfolio/about/UpdateAbout";
export { ViewAbout } from "@/screens/portfolio/about/ViewAbout";

/* -----------  Resume ----------- */
export { ResumeDeatils } from "@/screens/portfolio/resume/ResumeDeatils";
export { CreateResume } from "@/screens/portfolio/resume/CreateResume";
export { UpdateResume } from "@/screens/portfolio/resume/UpdateResume";
export { ViewAllResume } from "@/screens/portfolio/resume/ViewAllResume";

/* -----------  Service ----------- */
export { AllPortfolioService } from "@/screens/portfolio/portService/AllPortfolioService";
export { PortfolioServiceCreate } from "@/screens/portfolio/portService/PortfolioServiceCreate";
export { PortfolioServiceDetails } from "@/screens/portfolio/portService/PortfolioServiceDetails";
export { PortfolioServiceUpdate } from "@/screens/portfolio/portService/PortfolioServiceUpdate";

/* -----------  Testimonial ----------- */
export { AllTestimonial } from "@/screens/portfolio/testimonial/AllTestimonial";
export { CreateTestimonial } from "@/screens/portfolio/testimonial/CreateTestimonial";

/* ---- ########## End Portfolio Pages ########## -----------*/
