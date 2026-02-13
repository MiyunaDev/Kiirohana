import { useNavigate, type NavigateOptions, type To } from "react-router"

export const useShiNavigate = (serviceId?: string) => {
    const navigate = useNavigate()

    return (to: To, options?: NavigateOptions) => {
        if (!serviceId) return

        const path =
            typeof to === "string"
                ? to.startsWith("/") ? to.slice(1) : to
                : to

        navigate(`/shinobu/${serviceId}/${path}`, options)
    }
}
