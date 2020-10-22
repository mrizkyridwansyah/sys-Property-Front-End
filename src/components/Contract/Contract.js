import React, { useRef, useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ListContract from './ListContract'

export default function Contract() {
    const [contracts, setContracts] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)
    const keywordRef = useRef()
    const statusRef = useRef()
    const fromRef = useRef()
    const toRef = useRef()
    const { queryFetch, logout } = useAuth()

    async function handleSearch(e) {
        e.preventDefault()        
        let search = `(search: "${keywordRef.current.value}"`
        if(statusRef.current.value !== "") search += `, active: ${statusRef.current.value}`
        if(fromRef.current.value !== "" && toRef.current.value !== "")  search += `, dateFrom: "${fromRef.current.value}", dateTo: "${toRef.current.value}"`
        search += ")"

        getContract(search)
    }

    async function handleDeleteContract(e) {
        e.preventDefault()
        if(window.confirm("Are You Sure Delete This Contract ?")) {
            setError("")
            setLoading(true)

            const id = e.target.dataset.id
            const query = `
                mutation {
                    deleteContract(id: "${id}") {
                        id
                    }
                }`   
            queryFetch(query).then(async(data) => {
                if(data.errors) {
                    if(data.errors[0].message === "Unauthorized"){
                        await logout(sessionStorage.getItem("refresh_token"))                    
                    } else {
                        setLoading(false)
                        return setError(data.errors[0].message)
                    }
                }
                setError("")
                setLoading(false)
                setHasChanged(!hasChanged)                    
            })
        }
    }

    async function handleCancelContract(e) {
        e.preventDefault()
        if(window.confirm("Are You Sure Cancel This Contract ?")) {
            setError("")
            setLoading(true)

            const id = e.target.dataset.id
            const user_id = sessionStorage.getItem("user_id")
            const query = `
                mutation {
                    cancelContract(id: "${id}", update_by: "${user_id}") {
                        id,
                        contract_number,
                        is_active
                    }
                }`   
            queryFetch(query).then(async(data) => {
                console.log(data)
                if(data.errors) {
                    if(data.errors[0].message === "Unauthorized"){
                        await logout(sessionStorage.getItem("refresh_token"))                    
                    } else {
                        setLoading(false)
                        return setError(data.errors[0].message)
                    }
                }
                setError("")
                setLoading(false)
                setHasChanged(!hasChanged)                    
            })
        }
    }

    function getContract(search = "") {
        setError("")
        setLoading(true)
        const query = `
            query{
                contracts ${search} {
                    id,
                    contract_number,
                    is_active,
                    contract_date
                }
            }`
        queryFetch(query).then(async(data) => {
            if(data.errors) {
                if(data.errors[0].message === "Unauthorized"){
                    await logout(sessionStorage.getItem("refresh_token"))                    
                } else {
                    setLoading(false)
                    return setError(data.errors[0].message)
                }
            }
            setError("")
            setLoading(false)
            setContracts(data.data.contracts)
        })
    }

    useEffect(() => {
        getContract()
    }, [hasChanged])
    return (
        <Container>
            <Row>
                <Col md="8">
                <h4 className="mt-4 mb-3">List of Contracts</h4>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Link to="/contract/add">Add New Contract</Link>
                    <Form className="mt-3" onSubmit={handleSearch}>
                        <Form.Row>
                            <Col md="8">
                                <Form.Control type="text" ref={keywordRef} placeholder="Search by Contract Number" onChange={handleSearch}></Form.Control>
                            </Col>
                            <Col md="4">
                                <Form.Control as="select" ref={statusRef} onChange={handleSearch}>
                                    <option value="">All Status</option>
                                    <option value="true">Active</option>
                                    <option value="false">In Active</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mt-3">
                            <Col md="6">
                                <Form.Label>Contract Date From</Form.Label>
                                <Form.Control type="date" ref={fromRef} onChange={handleSearch}></Form.Control>
                            </Col>
                            <Col md="6">
                                <Form.Label>Contract Date Until</Form.Label>
                                <Form.Control type="date" ref={toRef} onChange={handleSearch}></Form.Control>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mt-3">
                            <Col md="4">
                                <Button variant="success" type="submit" disabled={loading}>Search</Button>
                            </Col>
                        </Form.Row>
                    </Form>
                    <Row>
                        <Col md="12">
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
                                    contracts.map(contract => {
                                        return <ListContract key={contract.id} contract={contract} handleDeleteContract={handleDeleteContract} handleCancelContract={handleCancelContract} />
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
