import { useEffect } from "react"
import { onReady } from "../utils/onReady"

const AppLayout = () => {
    useEffect(() => {
        onReady()
    }, [])
}

export default AppLayout