import React, { useRef, useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col, Alert} from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Forms() {
    const { type, id } = useParams()
    const [currentAgentName, setCurrentAgentName] = useState("")
    const [currentSalesCode, setCurrentSalesCode] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const nameRef = useRef()
    const codeRef = useRef()
    const history = useHistory()
    const { queryFetch, logout } = useAuth()

    useEffect(() => {
        if(type === "edit") {        
            setError("")
            setLoading(true)
            const query = `
                query {
                    agent(id: "${id}") {
                        id,
                        name,
                        sales_code
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
                    setLoading(false)
                    setCurrentAgentName(data.data.agent.name)
                    setCurrentSalesCode(data.data.agent.sales_code)
                }            
            })
        }
    },[])

    async function handleSubmit(e) {
        e.preventDefault()        
        setError("")
        setLoading(true)
        const user_id = sessionStorage.getItem("user_id")
        let mutation = `addAgent(name: "${nameRef.current.value}", sales_code: "${codeRef.current.value}", create_by: "${user_id}", update_by: "${user_id}")`
        
        if(type === "edit") mutation = `updateAgent(id: "${id}", name: "${nameRef.current.value}", sales_code: "${codeRef.current.value}", update_by: "${user_id}")`

        const query = `
            mutation {
                ${mutation} {
                    id,
                    name,
                    sales_code
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
                setLoading(false)
                history.push("/agent")
            }
        })
    }
    return (
        <>
            <Container>
                <Row>
                    <Col md="4">
                        <h4 className="mt-4 mb-3">{type === "add" ? "Add New" : "Edit"} Agent</h4>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form className="mt-3" onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" ref={nameRef} required autoFocus defaultValue={currentAgentName}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Agent Code</Form.Label>
                                <Form.Control type="text" ref={codeRef} required defaultValue={currentSalesCode}></Form.Control>
                            </Form.Group>
                            <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                            <Link to="/agent" className="btn btn-danger">Cancel</Link>
                        </Form>
                        
                    </Col>
                </Row>
            </Container>  
        </>
    )
}
