import { useEffect } from "react"
import { useNavigate } from "react-router"
import { MdCircle } from "react-icons/md"
import { version } from "../package.json"

const App = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // setTimeout(() => { 
        //     navigate("/onboarding/welcome", { replace: true }) 
        // }, 3500)
    }, [navigate])

    return (
        <div className="w-screen h-screen grid grid-rows-2 justify-center items-end">
            <div className="flex flex-col text-center items-center">
                <img className="w-20 aspect-square rounded-full" src="/icon.png" />
                <p className="text-2xl font-bold p-2">Kiirohana</p>
            </div>
            <div className="flex flex-col gap-1 p-14 text-center">
                <div className="flex flex-row justify-center items-center gap-2 opacity-65">
                    <MdCircle className="animate-pulse" /> Loading...
                </div>
                <p className="font-medium">By. <a className="font-bold">MiyunaDev <a className="text-blue-500">OSS</a></a> made with <a className="text-red-500">♥</a></p>
                <p className="opacity-75">v{version}</p>
            </div>
        </div>
    )
}

export default App