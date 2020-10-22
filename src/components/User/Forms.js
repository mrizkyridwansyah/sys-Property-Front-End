import React, { useRef, useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { Link , useHistory, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Forms() {
    const [currentEmail, setCurrentEmail] = useState("")
    const [currentRole, setCurrentRole] = useState("")
    const [roles, setRoles] = useState([])   
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false) 
    const emailRef = useRef()
    const passwordRef = useRef()
    const roleRef = useRef()
    const { queryFetch, logout } = useAuth()
    const { type, id } = useParams()
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
        if(roleRef.current.value === "") return setError("Choose Role")
        let mutation = ""
        if(type === "add") {
            mutation = `addUser(email: "${emailRef.current.value}", password: "${passwordRef.current.value}", role_id: "${roleRef.current.value}")`
        } else {
            let changePassword = passwordRef.current.value ? `, password: "${passwordRef.current.value}"` : ""
            mutation = `updateUser(id: "${id}",email: "${emailRef.current.value}", role_id: "${roleRef.current.value}" ${changePassword})`
        }
        const query = `
            mutation {
                ${mutation} {
                    id,
                    email,                    
                }
            }`
        queryFetch(query).then(async (data) => {
            if(data.errors) {
                if(data.errors[0].message === "Unauthorized") {
                    await logout(sessionStorage.getItem("refresh_token"));
                } else {
                    return setError(data.errors[0].message)
                }                
            } else{
                history.push("/user")
            }
        })            
    }

    useEffect(() => {
        setError("")
        setLoading(true)
        const query = `
            query {
                roles {
                    id,
                    name
                }
            }`
        queryFetch(query).then(async(data) => {
            if(data.errors) {
                if(data.errors[0].message === "Unauthorized") {
                    await logout(sessionStorage.getItem("refresh_token"));
                } else {
                    setLoading(false)
                    return setError(data.errors[0].message)
                }                
            }
            setError("")
            setLoading(false)
            setRoles(data.data.roles)
        })
        
        if(type === "edit") {
            const query = `
                query {
                    user(id: "${id}") {
                        id,
                        email,
                        role_id                
                    }
                }`
            queryFetch(query).then(async(data) => {
                if(data.errors) {
                    if(data.errors[0].message === "Unauthorized") {
                        await logout(sessionStorage.getItem("refresh_token"));
                    } else {
                        setLoading(false)
                        return setError(data.errors[0].message)
                    }                
                }
                setError("")
                setLoading(false)
                setCurrentEmail(data.data.user.email)                     
                setCurrentRole(data.data.user.role_id)                     
            })
        }
        
    }, [])

    return (
        <>
            <Container>
                <Row>
                    <Col md="6">
                        <h4 className="mt-4 mb-3">{type === "add" ? "Add New" : "Edit"} User</h4>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" required autoFocus ref={emailRef} defaultValue={currentEmail}></Form.Control>
                            </Form.Group>
                            <Form.Row>
                                <Col md="6">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" required={type==="add"} ref={passwordRef}></Form.Control>
                                </Col>
                                <Col md="6">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control as="select" ref={roleRef} value={currentRole} onChange={ e => setCurrentRole(e.target.value)}>
                                        <option value="" hidden>Select Role</option>
                                        {
                                            roles.map(role => {
                                                return <option key={role.id} value={role.id}>{role.name}</option>
                                            })
                                        }
                                    </Form.Control>
                                </Col>
                            </Form.Row>
                            <div className="mt-4">
                                <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                                <Link to="/user" className="btn btn-danger">Cancel</Link>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
