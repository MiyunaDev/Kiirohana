import { useEffect, useState } from "react"
import { Outlet } from "react-router"


import toast from "react-hot-toast";

const AppLayout = () => {
    const [isOffline, setIsOffline] = useState(false)

    useEffect(() => {
        const handleOffline = () => {
            console.log("Connection disconnected")
            toast("Your connection is lost. Make sure your connection is connected again", {
                icon: "🌍"
            })
            setIsOffline(true)
        }

        const handleOnline = () => {
            console.log("Connection connected")
            toast.success("Your connection is back!!")
            window.location.reload()
            setIsOffline(false)
        }

        document.addEventListener("offline", handleOffline, false)
        document.addEventListener("online", handleOnline, false)
    }, []);

    return (
        <div className="w-screen h-screen bg-[#101010]">
            {isOffline ? <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col gap-2"><a className="text-3xl">-_-</a><a>You disconnected</a></div>
            </div> : <Outlet />}
        </div>
    )
}

export default AppLayout