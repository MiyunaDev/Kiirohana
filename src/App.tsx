import { useEffect } from "react"
import { useNavigate } from "react-router"

const App = () => {
    const navigate = useNavigate()

    // fixing bagian setTimeout aja cuma pake variable local, 
    // biar ga ada memory leak warning di console
    useEffect(() => {
            const timer = setTimeout(() => {
         navigate("/app/library", { replace: true });
     }, 3500);

  return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="w-screen h-screen flex justify-center items-center text-white">
            <div className="text-center">
                <p className="text-3xl font-bold p-2">Kiirohana</p>
                <p>By. MiyunaDev made with ♥</p>
            </div>
        </div>
    )
}

export default App