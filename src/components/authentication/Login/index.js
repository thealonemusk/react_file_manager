import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, signInWithGoogle } from "../../../redux/actionCreators/authActionCreators";
import { GoogleLogin } from "react-google-login";
import styled from "styled-components"; // Make sure styled-components is installed and imported

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const history = useHistory();
  const { pathname } = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) return toast.dark("Please fill in all fields!");
    const data = {
      email,
      password,
    };
    dispatch(loginUser(data, setError));
  };

  const handleGoogleSignInSuccess = (response) => {
    const { tokenId } = response;
    dispatch(signInWithGoogle(tokenId));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (isLoggedIn) {
      history.goBack();
    }
  }, [error]);

  return (
    <Container>
      <Row>
        <Col md="12">
          <h1 className="display-1 my-5 text-center">Login</h1>
        </Col>
        <Col md="5" className="mx-auto">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicBtn" className="mt-3">
              <Button
                variant="primary"
                type="submit"
                className="form-control"
                block
              >
                Login
              </Button>
            </Form.Group>
            <p className=" text-right d-flex align-items-center justify-content-end gap-2 ml-auto my-4">
              Not a Member?
              <Link to="/signup" className="ml-2 text-decoration-none">
                Register
              </Link>
            </p>
            <GoogleLogin
              clientId="YOUR_GOOGLE_CLIENT_ID"
              buttonText="Sign in with Google"
              onSuccess={handleGoogleSignInSuccess}
              onFailure={(response) => console.log(response)}
              cookiePolicy={'single_host_origin'}
              render={(renderProps) => (
                <StyledGoogleButton onClick={renderProps.onClick} disabled={renderProps.disabled}>
                  <img src="google-icon.svg" alt="Google icon" />
                  Sign in with Google
                </StyledGoogleButton>
              )}
            />
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
const StyledGoogleButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  margin-top: 16px;
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f8f9fa;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;
export default Login;