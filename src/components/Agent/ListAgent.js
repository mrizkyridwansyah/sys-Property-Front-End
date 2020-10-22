import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function ListAgent(props) {
    const history = useHistory()

    async function handleEditAgent(e) {
        const id = e.target.dataset.id
        history.push(`/agent/edit/${id}`)
    }
    
    const {
        agent,
        handleDeleteAgent
    } = props

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{agent.name}
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={agent.id} onClick={handleDeleteAgent}>Delete</Badge>
                    <Badge variant="primary" style={{float: "right", cursor: "pointer"}} data-id={agent.id} onClick={handleEditAgent}>Edit</Badge>
                    <small style={{float: "right"}} className="mr-3">({agent.sales_code})</small>                 
                </ListGroup.Item>
            </ListGroup>            
        </>
    )
}
