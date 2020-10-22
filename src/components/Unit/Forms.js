import React, { useState, useRef, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Forms() {    
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [currentUnitNumber, setCurrentUnitNumber] = useState("")
    const [currentSurfaceArea, setCurrentSurfaceArea] = useState()
    const [currentBuildingArea, setCurrentBuildingArea] = useState()
    const unitRef = useRef()
    const surfaceRef = useRef()
    const buildingRef = useRef()
    const { type, id } = useParams()
    const { queryFetch, logout } = useAuth()
    const history = useHistory()
    const user_id = sessionStorage.getItem("user_id")

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)

        let mutation = `addUnit(unit_number: "${unitRef.current.value}", surface_area: ${surfaceRef.current.value},building_area: ${buildingRef.current.value},create_by: "${user_id}",update_by: "${user_id}")`
        
        if(type === "edit") mutation = `updateUnit(id: "${id}", unit_number: "${unitRef.current.value}", surface_area: ${surfaceRef.current.value},building_area: ${buildingRef.current.value},update_by: "${user_id}")`

        const query = `
            mutation {
                ${mutation} {
                    id, 
                    unit_number
                }
            }`
        queryFetch(query).then(async(data) => {
            if(data.errors){
                if(data.errors[0].message === "Unauthorized") {
                    await logout(sessionStorage.getItem("refresh_token"))
                } else {
                    setLoading(false)
                    return setError(data.errors[0].message)
                }
            } else {
                setError("")
                setLoading(false)
                history.push("/unit")
            }
        })
    }

    useEffect(() => {
        if(type === "edit") {
            setError("")
            setLoading(true)

            const query = `
                query {
                    unit (id: "${id}") {
                        id,
                        unit_number,
                        surface_area,
                        building_area
                    }
                }`
            queryFetch(query).then(async(data) => {
                if(data.errors) {
                    if(data.errors[0].message === "Unauthorized") {
                        await logout(sessionStorage.getItem("refresh_token"))
                    } else {
                        setError(data.errors[0].message)
                        setLoading(false)
                    }
                } else {
                    setError("")
                    setLoading(false)
                    setCurrentUnitNumber(data.data.unit.unit_number)
                    setCurrentSurfaceArea(data.data.unit.surface_area)
                    setCurrentBuildingArea(data.data.unit.building_area)
                }
            })
        }
    }, [])

    return (
        <>
            <Container>
                <Row>
                    <Col md="4">
                        <h4 className="mt-4 mb-3">{type === "add" ? "Add New" : "Edit"} Unit</h4>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form className="mt-3" onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Unit Number</Form.Label>
                                <Form.Control type="text" ref={unitRef} required autoFocus defaultValue={currentUnitNumber}></Form.Control>
                            </Form.Group>
                            <Form.Row>
                                <Col md="6">
                                    <Form.Label>Surface Area (m<sup>2</sup>)</Form.Label>
                                    <Form.Control type="number" ref={surfaceRef} required defaultValue={currentSurfaceArea} min="0"></Form.Control>
                                </Col>
                                <Col md="6">
                                    <Form.Label>Building Area (m<sup>2</sup>)</Form.Label>
                                    <Form.Control type="number" ref={buildingRef} required defaultValue={currentBuildingArea} min="0"></Form.Control>
                                </Col>
                            </Form.Row>
                            <div className="mt-3">
                                <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                                <Link to="/unit" className="btn btn-danger">Cancel</Link>
                            </div>
                        </Form>
                        
                    </Col>
                </Row>
            </Container>  
        </>
    )
}
