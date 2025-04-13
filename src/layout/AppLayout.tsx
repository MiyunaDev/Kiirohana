import { useEffect, useState } from "react"
import { onReady } from "../utils/onReady"
import { Outlet } from "react-router"
import ChangelogModal from "../components/ChangelogModal"

import { version } from "./../../package.json";


const AppLayout = () => {

    const [showChangelog, setShowChangelog] = useState(false);
    const [changelogContent, setChangelogContent] = useState("");

    useEffect(() => {
        const lastSeenVersion = localStorage.getItem("last_seen_version");

        if (!lastSeenVersion || lastSeenVersion !== version) {
            fetch("/CHANGELOGS.md")
                .then(res => res.text())
                .then(md => {
                    console.log(md)
                    setChangelogContent(md);
                    setShowChangelog(true);
                    localStorage.setItem("last_seen_version", version);
                });
        }
    }, []);

    useEffect(() => {
        onReady()
    }, [])

    return (
        <div className="w-screen h-screen bg-[#202020]">
            {showChangelog && (
                <ChangelogModal content={changelogContent} onClose={() => setShowChangelog(false)} />
            )}
            <Outlet />
        </div>
    )
}

export default AppLayout