import { useEffect } from "react"
import { onReady } from "../utils/onReady"
import { Outlet } from "react-router"

const AppLayout = () => {
    useEffect(() => {
        onReady()
    }, [])

    return (
        <div className="w-screen h-screen bg-[#202020]">
            <Outlet />
        </div>
    )
}

export default AppLayout