import React, { useState, useEffect } from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function ListUnit(props) {
    const history = useHistory()
    const [contractActive, setContractActive] = useState(false)
    const {
        unit,
        handleDeleteUnit,
        handleUpdateStatusUnit
    } = props

    async function handleEditUnit(e) {
        const id = e.target.dataset.id
        history.push(`/unit/edit/${id}`)
    }

    useEffect(() => {
        if(unit.contracts.length > 0) {
            unit.contracts.map(contract => {
                if(contract.is_active) setContractActive(true)
            })
        }
    }, [])

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{unit.unit_number}
                    {
                        !contractActive && <Badge variant={!unit.available ? "secondary" : "success"} className="ml-2" style={{float: "right", cursor: "pointer"}} data-status={unit.available} data-id={unit.id} onClick={handleUpdateStatusUnit} >{unit.available ? "Book" : "Unbook"}</Badge>
                    }
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={unit.id} onClick={handleDeleteUnit}>Delete</Badge>
                    <Badge variant="primary" style={{float: "right", cursor: "pointer"}} data-id={unit.id} onClick={handleEditUnit}>Edit</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
