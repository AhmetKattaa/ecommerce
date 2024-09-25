import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import '../css/BlogDetail.css'; 

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stripHtmlTags = (text) => {
    return text ? text.replace(/(<([^>]+)>)/gi, "") : "";
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost/R/api/get_blog.php?slug=${slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch blog');
        }
    
        const data = await response.json();
        if (!data.blog) {
          throw new Error('Blog not found');
        }
        setBlog(data.blog);
        setRelatedBlogs(data.relatedBlogs || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]); 

  if (loading) {
    return <Container className="my-4">Loading...</Container>;
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="blog-detail-container my-4">
      <div className="blog-header">
        <h1 className="blog-title">{stripHtmlTags(blog.title)}</h1> 
        <p className="blog-author-date">
          By <span className="blog-author">{stripHtmlTags(blog.author)}</span> |
          {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      {blog.image && (
        <img
          src={blog.image.startsWith('http') ? blog.image : `http://localhost/R/${blog.image}`}
          alt={stripHtmlTags(blog.title)}
          className="blog-image"
        />
      )}
      <div className="blog-content">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      {relatedBlogs.length > 0 && (
        <div className="related-blogs">
          <h3>You should also read</h3>
          <div className="related-blog-list">
            {relatedBlogs.map((relatedBlog) => (
              <div key={relatedBlog.id} className="related-blog-item">
                <a href={`/blogs/${relatedBlog.slug}`}>
                  <img
                    src={relatedBlog.image.startsWith('http') ? relatedBlog.image : `http://localhost/R/${relatedBlog.image}`}
                    alt={stripHtmlTags(relatedBlog.title)}
                    className="related-blog-image"
                  />
                  <p>{stripHtmlTags(relatedBlog.title)}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};

export default BlogDetail;
