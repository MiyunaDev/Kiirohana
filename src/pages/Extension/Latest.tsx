import { useEffect, useState } from "react"
import { useParams } from "react-router"

const Latest = () => {

    const params = useParams()
    const [data, setData] = useState([])
    const [error, setError] = useState(null)

    return (
        <div className="flex flex-col">
            <div>Latest</div>
            {error ?
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div>Something is wrong</div>
                        <div><code>{error}</code></div>
                    </div>
                </div> :
                <div className="grid grid-cols-2 overflow-y-scroll">
                    {data}
                </div>
            }
        </div>
    )
}

export default Latest