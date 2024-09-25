import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Table, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
//بش مهمندس محمد + اي? = حب للابد
const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({ id: null, title: '', content: '', author: '', image: null });
  const [imageSourceType, setImageSourceType] = useState('file');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost/R/api/get_blog.php')
      .then(response => response.json())
      .then(data => setBlogs(data.blogs))
      .catch(error => setError('Error fetching blogs: ' + error.message));
  }, []);

  const stripHtmlTags = (text) => {
    return text ? text.replace(/(<([^>]+)>)/gi, "") : "";
  };

  const editBlog = (blog) => {
    setEditing(true);
    setCurrentBlog({ id: blog.id, title: blog.title, content: blog.content, author: blog.author, image: blog.image });
  };

  const updateBlog = (id, updatedBlog) => {
    const formData = new FormData();
    formData.append('id', updatedBlog.id);
    formData.append('title', updatedBlog.title);
    formData.append('content', updatedBlog.content);
    formData.append('author', updatedBlog.author);

    if (imageSourceType === 'file' && updatedBlog.image instanceof File) {
      formData.append('image', updatedBlog.image);
    } else if (imageSourceType === 'url') {
      formData.append('image_url', updatedBlog.image);
    } else {
      formData.append('existing_image', updatedBlog.image);
    }

    fetch('http://localhost/R/api/update_blog.php', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(() => {
      setEditing(false);
      setBlogs(blogs.map(blog => (blog.id === id ? updatedBlog : blog)));
      setError(null);
    })
    .catch(error => setError('Error updating blog: ' + error.message));
  };

  const addBlog = (newBlog) => {
    const formData = new FormData();
    formData.append('title', newBlog.title);
    formData.append('content', newBlog.content);
    formData.append('author', newBlog.author);
  
    // URL ile resim ekleme
    if (imageSourceType === 'url') {
      formData.append('image_url', newBlog.image);
    }
  
    fetch('http://localhost/R/api/add_blog.php', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then((data) => {
      if (data.success) {
        const blog = data.blog;
        setBlogs([...blogs, blog]); // Blogu tabloya ekliyoruz
        setIsAdding(false);
        setError(null);
      } else {
        setError(data.error || 'Error adding blog');
      }
    })
    .catch(error => setError('Error adding blog: ' + error.message));
  };
  

  const deleteBlog = (id) => {
    fetch('http://localhost/R/api/delete_blog.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(() => {
      setBlogs(blogs.filter(blog => blog.id !== id));
      setError(null);
    })
    .catch(error => setError('Error deleting blog: ' + error.message));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editing) {
      updateBlog(currentBlog.id, currentBlog);
    } else if (isAdding) {
      addBlog(currentBlog);
    }
    setCurrentBlog({ id: null, title: '', content: '', author: '', image: null });
  };

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']                                         
    ]
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'color', 'background'
  ];

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">Blog Management</h2>

      <Modal show={editing || isAdding} onHide={() => { setEditing(false); setIsAdding(false); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit Blog' : 'Add Blog'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group controlId="blogTitle">
              <Form.Label>Title:</Form.Label>
              <ReactQuill
                value={currentBlog.title}
                onChange={(value) => setCurrentBlog({ ...currentBlog, title: value })}
                modules={modules} 
                formats={formats} 
                theme="snow"
              />
            </Form.Group>
            <Form.Group controlId="blogContent" className="mt-3">
              <Form.Label>Content:</Form.Label>
              <ReactQuill
                value={currentBlog.content}
                onChange={(value) => setCurrentBlog({ ...currentBlog, content: value })}
                modules={modules} 
                formats={formats} 
                theme="snow"
              />
            </Form.Group>
            <Form.Group controlId="blogAuthor" className="mt-3">
              <Form.Label>Author:</Form.Label>
              <Form.Control
                type="text"
                value={currentBlog.author}
                onChange={(e) => setCurrentBlog({ ...currentBlog, author: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="imageSourceType" className="mt-3">
              <Form.Label>Image Source:</Form.Label>
              <Form.Control
                as="select"
                value={imageSourceType}
                onChange={(e) => setImageSourceType(e.target.value)}
              >
                <option value="file">Upload File</option>
                <option value="url">Enter URL</option>
              </Form.Control>
            </Form.Group>
            {imageSourceType === 'file' ? (
              <Form.Group controlId="blogImage" className="mt-3">
                <Form.Label>Image File:</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setCurrentBlog({ ...currentBlog, image: e.target.files[0] })}
                />
              </Form.Group>
            ) : (
              <Form.Group controlId="blogImageUrl" className="mt-3">
                <Form.Label>Image URL:</Form.Label>
                <Form.Control
                  type="text"
                  value={currentBlog.image || ''}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, image: e.target.value })}
                />
              </Form.Group>
            )}
            <Button variant="primary" type="submit" className="mt-3">
              {editing ? 'Update Blog' : 'Add Blog'}
            </Button>
            <Button variant="secondary" onClick={() => { setEditing(false); setIsAdding(false); }} className="mt-3 ms-2">Cancel</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Row className="mb-4">
        <Col className="text-end">
          <Button onClick={() => { setIsAdding(true); setCurrentBlog({ id: null, title: '', content: '', author: '', image: null }); }} variant="success">Add Blog</Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Author</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{stripHtmlTags(blog.title || '')}</td> 
              <td>{stripHtmlTags(blog.content ? blog.content.substring(0, 50) : '')}...</td> 
              <td>{blog.author}</td>
              <td>
                {blog.image && (
                  blog.image.startsWith('http') ? (
                    <img src={blog.image} alt={blog.title} width="50" />
                  ) : (
                    <img src={`http://localhost/R/${blog.image}`} alt={blog.title} width="50" />
                  )
                )}
              </td>
              <td>
                <Button variant="warning" size="sm" onClick={() => editBlog(blog)} className="me-2">Edit</Button>
                <Button variant="danger" size="sm" onClick={() => deleteBlog(blog.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default BlogManagement;
