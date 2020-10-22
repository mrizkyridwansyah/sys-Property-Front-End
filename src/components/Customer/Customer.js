import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Alert, Form, Button, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ListCustomer from './ListCustomer'

export default function Customer() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)
    const [customers, setCustomers] = useState([])    
    const keywordRef = useRef()
    const { queryFetch, logout } = useAuth()

    async function handleSearch(e) {
        e.preventDefault()       
        let search = `(search: "${keywordRef.current.value}")`
        getCustomer(search)
    }

    async function handleDeleteCustomer(e) {
        e.preventDefault()
        if(window.confirm("Are You Sure?")) {
            const id = e.target.dataset.id
            const query = `
                mutation {
                    deleteCustomer(id: "${id}") {
                        id
                    }
                }`
            queryFetch(query).then(async(data) => {
                if(data.errors) {
                    if(data.errors[0].message === "Unauthorized") {
                        await logout(sessionStorage.getItem("refresh_token"))
                    } else {
                        setError(data.errors[0].message)
                    }
                } else {
                    setHasChanged(!hasChanged)
                }
            })
        }
    }

    function getCustomer(search = "") {
        const query = `
            query {
                customers ${search} {
                    id, 
                    name, 
                    customer_code
                }
            }`
        queryFetch(query).then(async(data) => {
            if(data.errors) {
                if(data.errors[0].message === "Unauthorized") {
                    await logout(sessionStorage.getItem("refresh_token"))
                } else {
                    setError(data.errors[0].message)
                }
            } else {
                setCustomers(data.data.customers)
            }
        })
    }

    useEffect(() => {
        getCustomer()
    }, [hasChanged])

    return (
        <Container>
            <Row>
                <Col md="12">
                    <h4 className="mt-4 mb-3">List of Customers</h4>
                    <Link to="/customer/add">Add New Customer</Link>
                    <Form className="mt-3" onSubmit={handleSearch}>
                        <Form.Row>
                            <Col md="8">
                                <Form.Control type="text" ref={keywordRef} placeholder="Search by Name or Customer Code" onChange={handleSearch}></Form.Control>                            
                            </Col>
                            <Col md="4">
                                <Button variant="success" type="submit">Search</Button>
                            </Col>
                        </Form.Row>
                    </Form>
                    <Row>
                        <Col md="7">
                            {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
                        </Col>
                    </Row>
                    <Row>
                        <Col md="5">                            
                            {
                                loading && 
                                <div className="mt-3">
                                    <Spinner animation="grow" size="sm" className="mr-2" />
                                    <Spinner animation="grow" size="sm" className="mr-2" />
                                    <Spinner animation="grow" size="sm" className="mr-2" />
                                    <Spinner animation="grow" size="sm" className="mr-2" />
                                </div>
                            }
                            <Card className="mt-3">
                                {                                    
                                    customers.map(customer => {
                                        return <ListCustomer key={customer.id} customer={customer} handleDeleteCustomer={handleDeleteCustomer} />
                                    })
                                }                            
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
