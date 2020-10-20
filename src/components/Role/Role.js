import React, { useRef, useState, useEffect } from 'react'
import { Row, Col, Form, Button, Container, Card, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import ListRole from './ListRole'
import { useAuth } from '../../contexts/AuthContext'

export default function Role() {
    const [hasDeleted, setHasDeleted] = useState(false)
    const [error, setError] = useState("")
    const [roles, setRoles] = useState([])
    const keywordRef = useRef()
    const { queryFetch, logout } = useAuth()
    const history = useHistory()

    if(hasDeleted) {
        getRole();
    }
    async function handleSearch(e) {
        e.preventDefault()
        let search = `(name: "${keywordRef.current.value}")`
        getRole(search)
    }

    function handleDeleteRole(e) {
        setError("")
        if(window.confirm("Are You Sure ?")) 
        {            
            const id = e.target.dataset.id
            const query = `
            mutation {
                deleteRole(id: "${id}"){
                    id,
                    name
                }
            }`;

            queryFetch(query,sessionStorage.getItem("access_token")).then(data => {
                if(data.errors) return setError(data.errors[0].message)   
                setHasDeleted(true)     
            })
        }
    }

    function getRole(search = "") {
        const query = `
        query {
            roles ${search}{
              id,
              name
            }
        }`;
        queryFetch(query,sessionStorage.getItem("access_token")).then(async (data) => {
            if(data.errors) {
                console.log(data.errors[0].message)
                if(data.errors[0].message === "Unauthorized") {
                    await logout(sessionStorage.getItem("refresh_token"));
                    // history.push('/login')        
                } else {
                    return setError(data.errors[0].message)
                }                
            } 
            setRoles(data.data.roles)
        })
    }

    useEffect(() => {
        getRole()
    },[])

    return (
        <Container>
            <Row>
                <Col md="12">
                    <h4 className="mt-4 mb-3">List of Roles</h4>
                    <Link to="/role/add" className="mt-4">Add New Role</Link>
                    <Form className="mt-3" onSubmit={handleSearch}>
                        <Form.Row>
                            <Col md="6">
                                <Form.Control type="text" ref={keywordRef} placeholder="Search by Name ..." onChange={handleSearch}></Form.Control>
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
                            <Card className="mt-3">
                                {                                    
                                    roles.map(role => {
                                        return <ListRole key={role.id} role={role} handleDeleteRole={handleDeleteRole} />
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
