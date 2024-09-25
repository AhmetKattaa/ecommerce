import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Table, Modal, Form } from 'react-bootstrap';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    price: '',
    stock: '',
    description: '',
    category_id: '', 
    image: null,
    variants: [],
    flavors: [],
    quantities: [],
    nutrition: [],  
    promotion: {},  
  });
  const [imageSourceType, setImageSourceType] = useState('file');

  // Kategorileri ve ürünleri yeniden yükleme fonksiyonu
  const fetchCategoriesAndProducts = () => {
    fetch('http://localhost/R/api/get_categories.php')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.log('Error fetching categories:', error));

    fetch('http://localhost/R/api/get_products.php')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.log('Error fetching products:', error));
  };

  // Sayfa yüklendiğinde kategorileri ve ürünleri getir
  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  // Form submit handler for adding/updating products
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const price = parseFloat(currentProduct.price);
    const stock = parseInt(currentProduct.stock, 10);

    // Validation for required fields
    if (!currentProduct.name || isNaN(price) || isNaN(stock) || !currentProduct.description || !currentProduct.category_id) {
      console.error('Missing required fields');
      return;
    }

    const formData = new FormData();
    formData.append('id', currentProduct.id);  // ID'yi ekleyelim
    formData.append('name', currentProduct.name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('description', currentProduct.description);
    formData.append('category_id', currentProduct.category_id);

    // JSON formatında alanları ekle
    formData.append('flavors', JSON.stringify(currentProduct.flavors || []));
    formData.append('variants', JSON.stringify(currentProduct.variants || []));
    formData.append('quantities', JSON.stringify(currentProduct.quantities || []));
    formData.append('nutrition', JSON.stringify(currentProduct.nutrition || []));
    formData.append('promotion', JSON.stringify(currentProduct.promotion || {}));

    if (imageSourceType === 'file' && currentProduct.image) {
      formData.append('image', currentProduct.image);
    } else if (imageSourceType === 'url') {
      formData.append('image_url', currentProduct.image);
    }

    if (editing) {
      updateProduct(currentProduct.id, formData);
    } else {
      addProduct(formData);
    }
  };

  // Function for updating an existing product
  const updateProduct = (id, formData) => {
    fetch(`http://localhost/R/api/update_product.php`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw new Error(`Failed to update product: ${error.error}`);
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          setEditing(false);
          setProducts(products.map(product => (product.id === id ? { ...product, ...currentProduct, image: data.image } : product)));
        } else {
          console.error('Error updating product:', data.error);
        }
      })
      .catch(error => console.log('Error updating product:', error));
  };

  // Function for adding a new product
  const addProduct = (formData) => {
    fetch('http://localhost/R/api/add_product.php', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsAdding(false);
          setProducts([...products, data.product]);
        } else {
          console.error('Error adding product:', data.error);
        }
      })
      .catch(error => console.log('Error adding product:', error));
  };

  // Function for deleting a product
  const deleteProduct = (id) => {
    fetch('http://localhost/R/api/delete_product.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(() => setProducts(products.filter(product => product.id !== id)))
      .catch(error => console.log('Error deleting product:', error));
  };

  // Kategori silme işlemi
  const deleteCategory = (id) => {
    fetch('http://localhost/R/api/delete_category.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(response => response.json())
      .then(() => {
        fetchCategoriesAndProducts(); // Kategori silindikten sonra kategorileri ve ürünleri yeniden getir
      })
      .catch(error => console.log('Error deleting category:', error));
  };

  // Function for handling edit action
  const editProduct = (product) => {
    setEditing(true);
    setIsAdding(false);
    setCurrentProduct({
      ...product,
      variants: Array.isArray(product.variants) ? product.variants : [],
      flavors: Array.isArray(product.flavors) ? product.flavors : [],
      quantities: Array.isArray(product.quantities) ? product.quantities : [],
      nutrition: Array.isArray(product.nutrition) ? product.nutrition : [],
      promotion: product.promotion || {},
    });
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">Product Management</h2>

      {/* Add Product Button */}
      <Row className="mb-4">
        <Col className="text-end">
          <Button onClick={() => { 
            setIsAdding(true); 
            setEditing(false);
            setCurrentProduct({ 
              id: null, name: '', price: '', stock: '', description: '', 
              category_id: '', image: null, variants: [], flavors: [], quantities: [], nutrition: [], promotion: {} 
            });
          }} variant="success">Add Product</Button>
        </Col>
      </Row>

      <Modal show={editing || isAdding} onHide={() => { setEditing(false); setIsAdding(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="productName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct.name}
                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="productCategory" className="mt-3">
              <Form.Label>Category:</Form.Label>
              <Form.Control
                as="select"
                value={currentProduct.category_id}
                onChange={(e) => setCurrentProduct({ ...currentProduct, category_id: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="productPrice" className="mt-3">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                value={currentProduct.price}
                onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="productStock" className="mt-3">
              <Form.Label>Stock:</Form.Label>
              <Form.Control
                type="number"
                value={currentProduct.stock}
                onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="productDescription" className="mt-3">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentProduct.description}
                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
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
              <Form.Group controlId="productImage" className="mt-3">
                <Form.Label>Image File:</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.files[0] })}
                />
              </Form.Group>
            ) : (
              <Form.Group controlId="productImageUrl" className="mt-3">
                <Form.Label>Image URL:</Form.Label>
                <Form.Control
                  type="text"
                  value={currentProduct.image}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })}
                />
              </Form.Group>
            )}

            <Button variant="primary" type="submit" className="mt-3">
              {editing ? 'Update Product' : 'Add Product'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Product List */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Description</th>
            <th>Category</th>  
            <th>Promotion</th>  {/* Promosyonu göstermek için yeni sütun */}
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.description}</td>
              <td>
                {categories.length > 0 
                  ? categories.find(c => parseInt(c.id) === parseInt(product.category_id))?.name || "Unknown Category"
                  : "Loading..."}
              </td>
              <td>
                {product.promotion_active === "1"
                  ? `${product.promotion_description} (${product.promotion_discount_percentage}% off)`
                  : "No Promotion"}
              </td>
              <td>
                {product.image && <img src={product.image.startsWith('http') ? product.image : `http://localhost/R/uploads/${product.image}`} alt={product.name} width="50" />}
              </td>
              <td>
                <Button variant="warning" size="sm" onClick={() => editProduct(product)} className="me-2">Edit</Button>
                <Button variant="danger" size="sm" onClick={() => deleteProduct(product.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProductManagement;
