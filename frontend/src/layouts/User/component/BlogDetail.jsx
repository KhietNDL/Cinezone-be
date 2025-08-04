import { useParams } from "react-router-dom";
import { SingleBlog } from "../../../../cosmic/blocks/blog/SingleBlog";

function BlogDetail() {
  const { slug } = useParams();

  
  const query = {
    slug: slug,
  };

  return (
    <div className="min-h-screen">
      <SingleBlog query={query} className="mx-auto" />
    </div>
  );
}

export default BlogDetail;
