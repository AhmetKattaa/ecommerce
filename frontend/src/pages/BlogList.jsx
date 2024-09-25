import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost/R/api/get_blog.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch blog posts');
        }
    
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  const handleReadMore = (slug) => {
    navigate(`/blogs/${slug}`);
  };

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
    <Container className="my-4">
      <h1 className="text-center mb-4">Blog Posts</h1>
      <Row>
        {blogs.map(blog => (
          <Col md={4} key={blog.id} className="mb-4">
            <Card onClick={() => handleReadMore(blog.slug)} style={{ cursor: 'pointer' }}>
              {blog.image && (
                <Card.Img
                  variant="top"
                  src={blog.image.startsWith('http') ? blog.image : `http://localhost/R/uploads/${blog.image}`}
                  alt={blog.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <Card.Body>
                <Card.Title>{blog.title.replace(/(<([^>]+)>)/gi, "")}</Card.Title>
                <Card.Text>
                  <small className="text-muted">By {blog.author}</small>
                </Card.Text>
                <Card.Text>
                  <div dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 100) }} />
                  {blog.content.length > 100 && (
                    <Button 
                      variant="link" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleReadMore(blog.slug);
                      }}>
                      Read more
                    </Button>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BlogList;
