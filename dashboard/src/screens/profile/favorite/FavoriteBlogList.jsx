import { getUserFavorite } from "@/redux/slices/common/favoriteSlice";
import { FavoriteCard } from "@/utils/Router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const FavoriteBlogList = () => {
  const dispatch = useDispatch();

  const { favoriteResource } = useSelector((state) => state.favorite);

  useEffect(() => {
    dispatch(getUserFavorite());
  }, [dispatch]);

  // Access the Blog array inside favoriteResource
  const blogPosts = favoriteResource?.Blog || [];

  return (
    <>
      {blogPosts.length > 0 ? (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((item) => (
            <FavoriteCard
              key={item?._id}
              url="/view-blog"
              postId={item?._id}
              slug={item?.slug}
              cover={item?.cover?.filePath}
              coverAlt={item?.cover?.fileName}
              title={item?.title}
              categoryTitle={item?.category?.title}
              metaDescription={item?.metaDescription}
              createdAt={item?.createdAt}
              username={item?.user?.name}
              numOfViews={item?.numOfViews}
              likes={item?.likes?.length || 0}
            />
          ))}
        </div>
      ) : (
        <p className="p-5">No favorite resources found!</p>
      )}
    </>
  );
};
