import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Yönlendirme için
import { Button, Form } from 'react-bootstrap';  // Bootstrap bileşenleri

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Yönlendirme için useNavigate hook'u

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/R/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Bir hata oluştu.");
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);  // JWT token'ı kaydet
      setError('');
      navigate('/admin');  // Başarılı girişten sonra /admin sayfasına yönlendir
    } catch (error) {
      setError("Bir hata oluştu: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center" style={{ color: "#6C4035" }}>Login</h2>
          <Form onSubmit={handleLogin} className="bg-light p-4 border rounded shadow">
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"  // Autocomplete önerisine uygun
              />
            </Form.Group>

            <Button type="submit" className="w-100" style={{ backgroundColor: "#6C4035", borderColor: "#6C4035" }}>
              Login
            </Button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
