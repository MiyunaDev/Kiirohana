import { useEffect, useState } from "react"
import { Outlet } from "react-router"
import ChangelogModal from "../components/ChangelogModal"

import { version } from "./../../package.json";
import toast from "react-hot-toast";

const AppLayout = () => {
    const [isOffline, setIsOffline] = useState(false)

    const [showChangelog, setShowChangelog] = useState(false);
    const [changelogContent, setChangelogContent] = useState("");

    useEffect(() => {
        const lastSeenVersion = localStorage.getItem("last_seen_version");

        if (!lastSeenVersion || lastSeenVersion == version) {
            fetch("https://raw.githubusercontent.com/MiyunaDev/Kiirohana/refs/heads/main/public/CHANGELOGS.md")
                .then(res => res.text())
                .then(md => {
                    setChangelogContent(md);
                    setShowChangelog(true);
                    localStorage.setItem("last_seen_version", version);
                }).catch(async err => {
                    if (err) console.error(err)
                })
        }

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
            {showChangelog && (
                <ChangelogModal content={changelogContent} onClose={() => setShowChangelog(false)} />
            )}
            {isOffline ? <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col gap-2"><a className="text-3xl">-_-</a><a>You disconnected</a></div>
            </div> : <Outlet />}
        </div>
    )
}

export default AppLayout