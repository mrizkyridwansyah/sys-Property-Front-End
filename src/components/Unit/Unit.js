import React, { useRef, useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ListUnit from './ListUnit'

export default function Unit() {
    const [hasChanged, setHasChanged] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [units, setUnits] = useState([])
    const { queryFetch, logout } = useAuth()
    const keywordRef = useRef()
    const statusRef = useRef()
    
    async function handleSearch(e) {
        e.preventDefault()
        let search = `(search: "${keywordRef.current.value}")`
        if(statusRef.current.value !== "") search = `(search: "${keywordRef.current.value}", available: ${statusRef.current.value})`
        getUnits(search)
    }

    async function handleDeleteUnit(e) {
        e.preventDefault()
        if(window.confirm("Are You Sure ?")) {
            setError("")
            setLoading(true)    
            const id = e.target.dataset.id
            const query = `
                mutation {
                    deleteUnit(id: "${id}") {
                        id
                    }
                }`
            queryFetch(query).then(async(data) => {
                if(data.errors) {
                    if(data.errors[0].message === "Unauthorized") {
                        await logout(sessionStorage.getItem("refresh_token"))
                    } else {
                        setLoading(false)
                        setError(data.errors[0].message)
                    }
                } else{
                    setError("")
                    setLoading(false)
                    setHasChanged(!hasChanged)      
                }
            })
        }
    }

    async function handleUpdateStatusUnit(e) {
        e.preventDefault()
        if(window.confirm("Are You Sure Update Unit Status?")) {
            setError("")
            setLoading(true)    
            const id = e.target.dataset.id
            const user_id = sessionStorage.getItem("user_id")
            let status = e.target.dataset.status === "true"
            const query = `
                mutation {
                    updateUnit(id: "${id}", available: ${!status}, update_by: "${user_id}") {
                        id,
                        unit_number,
                        available
                    }
                }`
            queryFetch(query).then(async(data) => {
                if(data.errors) {
                    if(data.errors[0].message === "Unauthorized") {
                        await logout(sessionStorage.getItem("refresh_token"))
                    } else {
                        setLoading(false)
                        setError(data.errors[0].message)
                    }
                } else{
                    setError("")
                    setLoading(false)
                    setHasChanged(!hasChanged)      
                }
            })
        }
    }

    function getUnits(search = "") {
        setError("")
        setLoading(true)
        const query = `
            query {
                units ${search} {
                    id,
                    unit_number,
                    available,
                    surface_area,
                    building_area,
                    contracts {
                        id,
                        contract_number,
                        is_active
                    }
                }
            }`
        queryFetch(query).then(async(data) => {
            console.log(data)
            if(data.errors) {
                if(data.errors[0].message === "Unauthorized") {
                    await logout(sessionStorage.getItem("refresh_token"))
                } else {
                    setError(data.errors[0].message)
                }
            } else {
                setError("")
                setLoading(false)
                setUnits(data.data.units)
            }
        })
    }

    useEffect(() => {
        getUnits()
    }, [hasChanged])

    return (
        <Container>
            <Row>
                <Col md="12">
                    <h4 className="mt-4 mb-3">List of Units</h4>
                    <Link to="/unit/add" className="mt-4">Add New Unit</Link>
                    <Form className="mt-3" onSubmit={{handleSearch}}>
                        <Form.Row>
                            <Col md="6">
                                <Form.Control type="text" placeholder="Search by Unit Number or Area" onChange={handleSearch}  ref={keywordRef}></Form.Control>
                            </Col>
                            <Col md="2">
                                <Form.Control as="select" ref={statusRef} onChange={handleSearch}>
                                    <option value="">All Status</option>
                                    <option value="true">Available</option>
                                    <option value="false">Not Available</option>
                                </Form.Control>
                            </Col>
                            <Col md="2">
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
                                    units.map(unit => {
                                        return <ListUnit key={unit.id} unit={unit} handleDeleteUnit={handleDeleteUnit} handleUpdateStatusUnit={handleUpdateStatusUnit} />
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
