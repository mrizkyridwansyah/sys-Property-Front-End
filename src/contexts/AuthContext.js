import React, { useContext } from 'react'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

function login(email, password) {
    return queryFetchNonAuth(`mutation {
        login(email: "${email}", password: "${password}") {
            user_id,
            role_id,
            access_token,
            refresh_token
        }
    }`).then(data => {
        console.log(data)
        if(data.errors) throw new Error(data.errors[0].message)        
        sessionStorage.setItem('user_id', data.data.login.user_id)
        sessionStorage.setItem('role_id', data.data.login.role_id)
        sessionStorage.setItem('access_token', data.data.login.access_token)
        sessionStorage.setItem('refresh_token', data.data.login.refresh_token)
    })
}

function logout(token) {
    return queryFetchNonAuth(`mutation {
        logout(token: "${token}") {
            access_token,
            refresh_token
        }
    }`).then(data => {
        // if(data.errors) throw new Error(data.errors[0].message)        
        sessionStorage.removeItem('user_id')
        sessionStorage.removeItem('role_id')
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
    })
}

function setNewToken(token) {
    return queryFetchNonAuth(`mutation {
        setNewToken(token: "${token}") {
            access_token,
            refresh_token
        }
    }`).then(data => {
        if(data.errors) throw new Error(data.errors[0].message)        
        sessionStorage.setItem('access_token', data.data.setNewToken.access_token)
        sessionStorage.setItem('refresh_token', data.data.setNewToken.refresh_token)
    })
}

function queryFetchNonAuth(query) {
    return fetch(process.env.REACT_APP_GRAPH_QL_URI, {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({
            query: query
        })
    }).then(res => res.json())
}

function queryFetch(query) {
    return fetch(process.env.REACT_APP_GRAPH_QL_URI, {
        method: "POST",
        headers: { 
            "Content-Type" : "application/json", 
            "Authorization" : `BEARER ${sessionStorage.getItem("access_token")}`},
        body: JSON.stringify({
            query: query
        })
    })
    .then(res => res.json())
}

export function AuthProvider ({children}) {
    const value = {
        login,
        logout,
        setNewToken,
        queryFetch
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
