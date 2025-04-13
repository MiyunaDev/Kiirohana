import { useEffect } from "react"
import { useNavigate } from "react-router"

const App = () => {
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => { 
            navigate("/app/library") 
        }, 3500)
    }, [navigate])

    return (
        <div className="w-screen h-screen flex justify-center items-center text-white">
            <div className="text-center">
                <p className="text-2xl font-bold p-2">Kiirohana</p>
                <p>By. MiyunaDev made with ♥</p>
            </div>
        </div>
    )
}

export default App