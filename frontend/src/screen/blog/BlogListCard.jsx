import PropTypes from "prop-types";
import { BentoCard } from "./BentoCard";

export const BlogListCard = ({ rowData }) => {
  // Use rowData if provided, otherwise fallback to dummyBlogs
  //const blogs = dummyBlogs;
  const blogs = rowData;

  // Chunk blogs into groups of 19
  const chunkSize = 10;
  const blogChunks = [];
  for (let i = 0; i < blogs?.length; i += chunkSize) {
    blogChunks.push(blogs.slice(i, i + chunkSize));
  }

  return (
    <div className="p-5">
      {blogChunks.map((chunk, index) => (
        <BentoCard key={index} blogs={chunk} />
      ))}
    </div>
  );
};
BlogListCard.propTypes = {
  rowData: PropTypes.any,
};
