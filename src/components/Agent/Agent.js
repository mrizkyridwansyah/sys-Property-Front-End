import React, { useState, useRef, useEffect} from 'react'
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext.js'
import { Link, useHistory } from 'react-router-dom'
import ListAgent from './ListAgent.js'

export default function Agent() {
    const [agents, setAgents] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)
    const keywordRef = useRef()
    const { queryFetch, logout } = useAuth()

    async function handleSearch(e) {
        e.preventDefault()
        let search = `(search: "${keywordRef.current.value}")`
        getAgents(search)
    }

    async function handleDeleteAgent(e) {
        e.preventDefault()
        if(window.confirm("Are You Sure?")){
            const id = e.target.dataset.id
            const query = `
                mutation {
                    deleteAgent(id: "${id}"){
                        id                    
                    }
                }`
            queryFetch(query).then(async(data) => {
                if(data.errors) {
                    if(data.errors[0].message === "Unauthorized"){
                        await logout(sessionStorage.getItem("refresh_token"))                    
                    } else {
                        return setError(data.errors[0].message)
                    }
                }
                setHasChanged(!hasChanged)    
            })
        }
    }

    async function getAgents(search = "") {
        setError("")
        setLoading(true)
        const query = `
            query {
                agents ${search} {
                    id,
                    name, 
                    sales_code
                }
            }`
        queryFetch(query).then(async (data) => {
            if(data.errors) {
                if(data.errors[0].message === "Unauthorized"){
                    await logout(sessionStorage.getItem("refresh_token"))                    
                } else {
                    return setError(data.errors[0].message)
                }
            }
            setAgents(data.data.agents)
        })
        setLoading(false)
    }

    useEffect(() => {
        getAgents()
    },[hasChanged])

    return (
        <Container>
            <Row>
                <Col md="6">
                    <h4 className="mt-4 mb-3">List of Agents</h4>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Link to="/agent/add">Add New Agent</Link>
                    <Form className="mt-3" onSubmit={handleSearch}>
                        <Form.Row>
                            <Col md="10">
                                <Form.Control type="text" ref={keywordRef} placeholder="Search by Name or Sales Code" onChange={handleSearch} disabled={loading}></Form.Control>
                            </Col>
                            <Col md="2">
                                <Button variant="success" type="submit" disabled={loading}>Search</Button>
                            </Col>
                        </Form.Row>
                    </Form>
                    <Row>
                        <Col md="8">
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
                                    agents.map(agent => {
                                        return <ListAgent key={agent.id} agent={agent} handleDeleteAgent={handleDeleteAgent} />
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
