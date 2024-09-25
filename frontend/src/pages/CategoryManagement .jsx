import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  // Kategorileri getir
  useEffect(() => {
    fetch('http://localhost/R/api/get_categories.php')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  // Yeni kategori ekle
  const addCategory = (e) => {
    e.preventDefault();
    fetch('http://localhost/R/api/add_category.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCategories([...categories, { id: data.id, name: newCategory }]);
          setNewCategory('');
        } else {
          console.error('Error adding category:', data.error);
        }
      });
  };

  // Kategori sil
  const deleteCategory = (id) => {
    fetch('http://localhost/R/api/delete_category.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCategories(categories.filter(category => category.id !== id));
        } else {
          console.error('Error deleting category:', data.error);
        }
      });
  };

  return (
    <div>
      <h2>Category Management</h2>

      {/* Yeni Kategori Ekleme Formu */}
      <Form onSubmit={addCategory}>
        <Form.Group controlId="newCategory">
          <Form.Label>New Category</Form.Label>
          <Form.Control
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-2">Add Category</Button>
      </Form>

      {/* Kategori Listesi */}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => deleteCategory(category.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CategoryManagement;
