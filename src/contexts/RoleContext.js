import React, { useContext } from 'react'

const RoleContext = React.createContext()

export function useRoleContext() {
    return useContext(RoleContext)
}

function getAllRole(keyword) {
    const search = keyword !== "" ? `(name: "${keyword}")` : ""
    const query = `
        query ${search} {
            roles {
            id,
            name
            }
        }`;
    
    let arr = []
    queryFetch(query).then(data => console.log(data));
    return arr;
}

function queryFetch(query) {
    console.log(process.env.REACT_APP_GRAPH_QL_URI)
    return fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({
            query: query
        })
    }).then(res => res.json())
}

export function RoleProvider({children}) {

    const value = {
        getAllRole
    }

    return (
        <RoleContext.Provider value={value}>
            {children}
        </RoleContext.Provider>
    )
}
