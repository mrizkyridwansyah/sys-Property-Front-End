import React from 'react'
import { Card, Button, Form} from 'react-bootstrap'
import { Link} from 'react-router-dom'

export default function SignUp() {
    return (
        <>
            <div className="d-flex align-items-center justify-content-center mt-5">
                <Card className="w-100 mt-5" style={{ maxWidth: "400px"}}>
                    <Card.Body>
                        <h2 className="text-center mt-3">Sign Up</h2>
                        <Form>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" />
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" />
                            </Form.Group>
                            <Button className="w-100">Sign Up</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
            <div className="w-100 text-center mt-2">
                Already have an account ? <Link to="/login">Log In</Link>
            </div>            
        </>
    )
}
