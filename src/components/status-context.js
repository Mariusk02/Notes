import React from 'react'

const StatusContext = React.createContext({
    status : 0,
    autosave : () => {}
})

export default StatusContext;