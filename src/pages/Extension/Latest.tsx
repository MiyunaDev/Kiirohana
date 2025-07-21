import { useEffect, useState } from "react"
import ExtensionsManager from "../../extensions/manager"
import { useParams } from "react-router"

const Latest = () => {

    const params = useParams()
    const [data, setData] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const extension = ExtensionsManager
        const ext: any = extension.getExtension(params.extensionId as string)
        console.log("Extension nya", params.extensionId as string)
        ext.getLatest().then((datas: any) => {
            setData(datas)
            console.log(datas)
        }).catch((error: any) => {
            setError(error?.message)
        })
    }, [])

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