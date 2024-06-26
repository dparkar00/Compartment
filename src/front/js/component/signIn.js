import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import Private from '../pages/private';

function SignIn() {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || !email) {
      alert('Missing field')
      return;
    }
    const success = await actions.logIn(email, password);
    if (success) {
      console.log('User signed up successfully')
      navigate('/private')
    } else {
      console.log('Signin failed')
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

      <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
        Submit
      </Button>
    </Form>
  );
}

export default SignIn;