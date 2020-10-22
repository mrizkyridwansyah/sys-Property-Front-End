import React, { useRef, useState } from 'react'
import { Form, Button, Container, Row, Col, Alert} from 'react-bootstrap'
import { useParams, Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Forms() {
    const [currentRole, setCurrentRole] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { type, id } = useParams()
    const nameRef = useRef()
    const { queryFetch } = useAuth()
    const history = useHistory()

    if(type === "edit") {
        const query = `
        query {
            role(id: "${id}"){
                id,
                name
            }
        }`;
        queryFetch(query).then(data => setCurrentRole(data.data.role.name))
    }

    async function handleSubmit(e){
        e.preventDefault()

        let mutation = `addRole (name: "${nameRef.current.value}")`
        if(type !== "add") {
            mutation = `updateRole (id: "${id}", name: "${nameRef.current.value}")`
        } 
        const query = `
            mutation {
                ${mutation} {
                    id, 
                    name
                }
            }`;
        
        try {
            setError("")
            setLoading(true)
            await queryFetch(query).then(data => {
                if(data.errors) throw new Error(data.errors[0].message)
            })
            history.push("/role")
        } catch (err) {
            setLoading(false)
            setError(err.message)
        }
    }

    return (
        <>
            <Container>
                <Row>
                    <Col md="4">
                        <h4 className="mt-4 mb-3">{ type === "add" ? "Add New" : "Edit"} Role</h4>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" ref={nameRef} defaultValue={currentRole} autoFocus={true} required></Form.Control>
                            </Form.Group>
                            <Button disabled={loading} type="submit" className="mr-2">Submit</Button>
                            <Link to="/role" className="btn btn-danger">Cancel</Link>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
