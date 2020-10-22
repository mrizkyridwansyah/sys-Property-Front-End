import React, { useRef, useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Forms() {
    const [currentContract, setCurrentContract] = useState("")
    const [currentCustomer, setCurrentCustomer] = useState("")
    const [currentAgent, setCurrentAgent] = useState("")
    const [currentUnit, setCurrentUnit] = useState("")
    const [currentDate, setCurrentDate] = useState("")
    const [customers, setCustomers] = useState([])
    const [agents, setAgents] = useState([])
    const [units, setUnits] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const contractRef = useRef()
    const customerRef = useRef()
    const agentRef = useRef()
    const unitRef = useRef()
    const dateRef = useRef()
    const { type, id } = useParams()
    const { queryFetch, logout } = useAuth()
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)

        const user_id = sessionStorage.getItem("user_id")
        let mutation = `addContract(contract_number: "${contractRef.current.value}", agent_id: "${agentRef.current.value}", customer_id: "${customerRef.current.value}", unit_id: "${unitRef.current.value}", contract_date: "${dateRef.current.value}", create_by: "${user_id}", update_by: "${user_id}")`

        if(type === "edit") mutation = `updateContract(id: "${id}", agent_id: "${agentRef.current.value}", customer_id: "${customerRef.current.value}", unit_id: "${unitRef.current.value}", contract_date: "${dateRef.current.value}", update_by: "${user_id}")`

        const query = `
            mutation {
                ${mutation} {
                    id                    
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
            history.push("/contract")
        })
    }

    useEffect(() => {
        setError("")
        setLoading(true)
        let searchUnit = type === "add" ? `(available: true)` : "";
        const query = `
            query {
                customers {
                    id,
                    name,
                    customer_code
                },
                agents {
                    id,
                    name,
                    sales_code
                },
                units ${searchUnit} {
                    id,
                    unit_number
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
            setAgents(data.data.agents)
            setCustomers(data.data.customers)
            setUnits(data.data.units)
        })

        if(type === "edit") {
            const querySingle = `
                query {
                    contract(id: "${id}") {
                        id,
                        contract_number,
                        agent_id,
                        customer_id,
                        unit_id,
                        contract_date
                    }
                }`
            queryFetch(querySingle).then(async(data) => {
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
                setCurrentContract(data.data.contract.contract_number)
                setCurrentCustomer(data.data.contract.customer_id)
                setCurrentAgent(data.data.contract.agent_id)
                setCurrentUnit(data.data.contract.unit_id)
                setCurrentDate(data.data.contract.contract_date)
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
                                <Form.Label>Contract Number</Form.Label>
                                <Form.Control type="text" required autoFocus ref={contractRef} defaultValue={currentContract}></Form.Control>
                            </Form.Group>
                            <Form.Row>
                                <Col md="6">
                                    <Form.Label>Customer</Form.Label>
                                    <Form.Control as="select" ref={customerRef} value={currentCustomer} onChange={ e => setCurrentCustomer(e.target.value)}>
                                        <option value="" hidden>Select Customer</option>
                                        {
                                            customers.map(customer => {
                                                return <option key={customer.id} value={customer.id}>{customer.name} ({customer.customer_code})</option>
                                            })
                                        }
                                    </Form.Control>
                                </Col>
                                <Col md="6">
                                    <Form.Label>Agent</Form.Label>
                                    <Form.Control as="select" required ref={agentRef} value={currentAgent} onChange={e => setCurrentAgent(e.target.value)}>
                                        <option value="" hidden>Select Agent</option>
                                        {
                                            agents.map(agent => {
                                                return <option key={agent.id} value={agent.id}>{agent.name} ({agent.sales_code})</option>
                                            })
                                        }
                                    </Form.Control>
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col md="6">
                                    <Form.Label>Unit</Form.Label>
                                    <Form.Control as="select" ref={unitRef} value={currentUnit} onChange={ e => setCurrentUnit(e.target.value)}>
                                        <option value="" hidden>Select Unit</option>
                                        {
                                            units.map(unit => {
                                                return <option key={unit.id} value={unit.id}>{unit.unit_number}</option>
                                            })
                                        }
                                    </Form.Control>
                                </Col>
                                <Col md="6">
                                    <Form.Label>Contract Date</Form.Label>
                                    <Form.Control type="date" required ref={dateRef} defaultValue={currentDate}></Form.Control>
                                </Col>
                            </Form.Row>
                            <div className="mt-4">
                                <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                                <Link to="/contract" className="btn btn-danger">Cancel</Link>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
