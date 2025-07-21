import { useEffect, useState } from "react"
import ExtensionsManager from "../../extensions/manager"
import { Link } from "react-router"

const ExtensionList = () => {
    const [extensions, setExtensions] = useState<Array<any>>([])
    useEffect(() => {
        const extensions: Array<any> = ExtensionsManager.getExtensions()
        console.log(extensions)
        setExtensions(extensions)
    }, [])

    return (
        <div className="flex flex-col">
            <div className="text-lg">Extensions</div>
            <div className="flex flex-col overflow-y-scroll">
                {extensions.map((ext) => {
                    return (
                        <Link to={`/app/browse/${ext.id}/latest`} className="flex flex-row items-center gap-6">
                            <img src={ext.icon} className="w-20 aspect-square object-contain" />
                            <div className="flex flex-col">
                                <div>{ext.name}</div>
                                <div>v{ext.version}</div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default ExtensionList