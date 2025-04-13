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