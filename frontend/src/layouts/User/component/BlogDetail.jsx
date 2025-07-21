import { useParams } from "react-router-dom";
import { SingleBlog } from "../../../../cosmic/blocks/blog/SingleBlog";

function BlogDetail() {
  const { slug } = useParams();
  
  // Query để lấy blog theo slug
  const query = { 
    type: "Movies",
    slug: slug
  };

  return (
    <div className="container mx-auto py-8">
      <SingleBlog 
        query={query}
        className="mx-auto"
      />
    </div>
  );
}

export default BlogDetail;