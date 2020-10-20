import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
        
        try{
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            history.push('/')
        } catch(err) {
            setError(err.message)
            setLoading(false)            
        }
        setLoading(false)
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-center mt-5">
                <Card className="w-100 mt-5" style={{ maxWidth: "400px"}}>
                    <Card.Body>
                        <h2 className="text-center mt-3">Log In</h2>
                        { error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required />
                            </Form.Group>
                            <Button type="submit" className="w-100" disabled={loading}>Log In</Button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                            <Link to="/forgot-password">Forgot Password ?</Link>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}
