import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect, useContext} from 'react';
import { Context } from '../store/appContext'
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return;
    }
    const success = await actions.signUp(email, password);
    if (success) {
      alert('User signed up successfully')
      navigate('/signin');
    } else {
      console.log('Signup failed')
    }
  }

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={(e) => setConfirmPassword(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
        Submit
      </Button>
    </Form>
  );
}

export default SignUp;