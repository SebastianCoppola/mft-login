import React from 'react'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

export default function SnackBar({open, onClose, message, severity}) {
    
    return (
        <Snackbar open={open} onClose={onClose} autoHideDuration={6000}>
            <Alert elevation={6} variant="filled" severity={severity} onClose={onClose}>
                {message}
            </Alert>
        </Snackbar>
    )
}