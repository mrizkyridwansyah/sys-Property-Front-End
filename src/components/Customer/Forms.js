import React, { useState, useRef, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Forms() {
    const [currentCustomerName, setCurrentCustomerName] = useState("")
    const [currentCustomerCode, setCurrentCustomerCode] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const nameRef = useRef()
    const codeRef = useRef()
    const { type, id } = useParams()
    const { queryFetch, logout } = useAuth()
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)

        const user_id = sessionStorage.getItem("user_id")
        let mutation = `addCustomer(name: "${nameRef.current.value}", customer_code: "${codeRef.current.value}", create_by: "${user_id}", update_by: "${user_id}")`

        if(type === "edit") mutation = `updateCustomer(id: "${id}", name: "${nameRef.current.value}", customer_code: "${codeRef.current.value}", update_by: "${user_id}")`

        const query = `
            mutation {
                ${mutation} {
                    id,
                    name,
                    customer_code
                }
            }`
        queryFetch(query).then(async(data) => {
            if(data.errors){
                if(data.errors[0].message === "Unauthorized") {
                    await logout(sessionStorage.getItem("refresh_token"))
                } else {                    
                    return setError(data.errors[0].message)
                }
            } else {
                setError("")
                setLoading(false)
                history.push("/customer")
            }            
        })
    }

    useEffect(() => {
        if(type === "edit") {
            const query = `
                query {
                    customer(id: "${id}") {
                        id,
                        name,
                        customer_code
                    }
                }`                
            queryFetch(query).then(async(data) => {
                console.log(data)
                if(data.errors){
                    if(data.errors[0].message === "Unauthorized") {
                        await logout(sessionStorage.getItem("refresh_token"))
                    } else {                    
                        return setError(data.errors[0].message)
                    }
                } else {
                    setError("")
                    setLoading(false)
                    setCurrentCustomerName(data.data.customer.name)
                    setCurrentCustomerCode(data.data.customer.customer_code)
                }            
            })
        }
    }, [])

    return (
        <>
            <Container>
                <Row>
                    <Col md="4">
                        <h4 className="mt-4 mb-3">{type === "add" ? "Add New" : "Edit"} Customer</h4>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form className="mt-3" onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" ref={nameRef} required autoFocus defaultValue={currentCustomerName}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Customer Code</Form.Label>
                                <Form.Control type="text" ref={codeRef} required defaultValue={currentCustomerCode}></Form.Control>
                            </Form.Group>
                            <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                            <Link to="/customer" className="btn btn-danger">Cancel</Link>
                        </Form>
                        
                    </Col>
                </Row>
            </Container>              
        </>
    )
}
