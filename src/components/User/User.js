import React, { useState, useEffect, useRef} from 'react'
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.js'
import ListUser from './ListUser.js'

export default function User() {
    const [users, setUsers] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [hasDeleted, setHasDeleted] = useState(false)
    const keywordRef = useRef()
    const statusRef = useRef()
    const history = useHistory()
    const { queryFetch, logout } = useAuth()

    async function handleSearch(e) {
        e.preventDefault()
        let search = `(email: "${keywordRef.current.value}")`
        if(statusRef.current.value !== "") search = `(email: "${keywordRef.current.value}", active: ${statusRef.current.value})`
        getUsers(search)
    }

    async function handleDeleteUser(e) {
        setError("")
        if(window.confirm("Are You Sure?")){
            const id = e.target.dataset.id
            const query = `
                mutation {
                    deleteUser (id: "${id}") {
                        id,                    
                    }
                }`;
            queryFetch(query).then(async (data) => {
                if(data.errors) {
                    if(data.errors[0].message === "Unauthorized") {
                        await logout(sessionStorage.getItem("refresh_token"))
                    } else {
                        setError(data.errors[0].message)
                    }
                }
                setHasDeleted(!hasDeleted)
            })
        }        
    }

    function handleUpdateStatusUser(e) {
        setError("")
        const status = e.target.dataset.status === "true"
        let action = status ? "Block" : "Activate"
        if(window.confirm(`Are You Sure ${action} This User?`)){
            const id = e.target.dataset.id
            const query = `
                mutation {
                    updateUser(id: "${id}", active: ${!status}) {
                        id,
                        email,
                        is_active
                    }
                }`

                queryFetch(query).then(async(data) => {
                if(data.errors) {
                    if(data.errors[0].message === "Unauthorized") {
                        await logout(sessionStorage.getItem("refresh_token"))
                        history.push("/login")
                    } else {
                        setError(data.errors[0].message)
                    }
                }
                setHasDeleted(!hasDeleted)
            })
        }        
    }

    function getUsers(search = "") {
        setError("")
        setLoading(true)
        const query = `
            query {
                users ${search} {
                    id,
                    email, 
                    is_active,
                    role_id                
                }
            }`
        queryFetch(query).then(async (data) => {
            if(data.errors) {
                if(data.errors[0].message === "Unauthorized") {
                    await logout(sessionStorage.getItem("refresh_token"));
                } else {
                    return setError(data.errors[0].message)
                }                
            }
            setUsers(data.data.users)
        })    
        setLoading(false)
    }

    useEffect(() => {
        getUsers()
    }, [hasDeleted])

    return (
        <Container>
            <Row>
                <Col md="12">
                    <h4 className="mt-4 mb-3">List of Users</h4>
                    <Link to="/user/add" className="mt-4">Add New User</Link>
                    <Form className="mt-3" onSubmit={handleSearch}>
                        <Form.Row>
                            <Col md="6">
                                <Form.Control type="text" ref={keywordRef} placeholder="Search by Email ..." onChange={handleSearch}></Form.Control>
                            </Col>
                            <Col md="2">
                                <Form.Control as="select" ref={statusRef} onChange={handleSearch} >
                                    <option value="">All Status</option>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </Form.Control>
                            </Col>
                            <Col md="2">
                                <Button type="submit" variant="success" className="mr-2">Search</Button>
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
                                    users.map(user => {
                                        return <ListUser key={user.id} user={user} handleDeleteUser={handleDeleteUser} handleUpdateStatusUser={handleUpdateStatusUser} />
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
