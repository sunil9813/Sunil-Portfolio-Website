import { GlowingButton } from "@/components/customeUI/Button";

export const Home = () => {
  return (
    <div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic veritatis corporis maxime, qui molestias ipsa inventore necessitatibus vel cumque rerum porro esse laudantium eveniet animi nostrum
        tenetur, asperiores sapiente non beatae molestiae? Cumque excepturi porro et suscipit nisi aperiam repellat itaque eum quis, voluptas, nostrum a commodi voluptatibus in ipsum soluta quos
        facere dolorem odio mollitia blanditiis. Consequatur, quisquam! Voluptate, velit repellendus itaque natus deserunt voluptatem nam iure nemo cupiditate inventore maxime amet doloribus optio
        alias molestias. Sunt, maxime labore. Laudantium omnis fugit molestias natus dolorum labore voluptas iure ad enim soluta rerum reprehenderit in dicta nulla quas vel praesentium doloremque odit
        vitae doloribus, consequuntur cum beatae similique? Sequi, explicabo, nulla cupiditate ea quo reiciendis similique quae soluta beatae quibusdam sint? Qui quod dolorum dolorem nobis ipsum
        deserunt optio, voluptate recusandae quibusdam, at impedit magni iure eaque ratione natus adipisci velit odio voluptatem labore omnis accusamus pariatur eum nesciunt. Obcaecati exercitationem
        tempora accusamus fuga illum excepturi quam quaerat. Hic ullam corporis nisi provident alias similique ab velit adipisci nobis officia dolorum doloremque, quae vero saepe obcaecati voluptas,
        laborum repudiandae fuga cum ad ipsum perferendis neque suscipit dolorem? Distinctio a facere perspiciatis. Amet veniam perferendis eaque incidunt iste laboriosam quod ducimus.
      </p>
      <p className="label-shine">rum repudiandae fuga cum ad ipsum perferendis neque</p>
      <div class="relative z-50 flex h-9 w-full items-center justify-center gap-x-2.5 overflow-hidden px-4 py-2.5 leading-none transition-colors duration-200 dark:bg-[#0B0C0F] dark:hover:bg-gray-new-8 bg-[#0B0C0F] hover:bg-gray-new-8">
        <span class="absolute left-1/2 -z-20 h-[106px] w-[29px] origin-center -translate-y-1/2 rotate-[226deg] rounded-[100%] mix-blend-plus-lighter blur-lg dark:opacity-100 sm:left-[30%] top-1/2 translate-x-[-280px] bg-[linear-gradient(-19deg,#FFF_51%,rgba(255,255,255,0)_30.57%)] sm:translate-x-0"></span>
        <span class="absolute left-1/2 top-1/2 -z-10 h-[188px] w-[60px] origin-center -translate-y-[43%] translate-x-[-290px] rotate-[226deg] rounded-[100%] bg-[linear-gradient(-45deg,_#6DC5D8_40.06%,_#6A77E8_48.11%)] mix-blend-plus-lighter blur-2xl dark:opacity-100 sm:left-[30%] sm:translate-x-0"></span>
        <span class="absolute inset-x-0 bottom-0 z-10 block h-px w-full mix-blend-overlay dark:bg-white bg-white" aria-hidden="true"></span>
      </div>
      <GlowingButton className="px-8">Get Start</GlowingButton>

      {/* rectangle img for bg */}
      <img src="https://framerusercontent.com/images/eVPQSYBoVqwchmpN78sjyYtovY.svg" alt="" />
    </div>
  );
};
