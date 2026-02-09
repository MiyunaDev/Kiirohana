import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { shinobuFetch } from "../../../../utils/fetchShinobu";
import type { ShinobuUser } from "../../../../interfaces/ShinobuSession";
import { useShinobu } from "../../../../hooks/useShinobu";

export default function UserProfilePage() {
    const navigate = useNavigate();
    const { service } = useShinobu()

    const [user, setUser] =
        useState<ShinobuUser | null>(null);

    const [loading, setLoading] = useState(true);

    const [editMode, setEditMode] = useState(false);
    const [draftBio, setDraftBio] = useState("");
    const [draftAvatar, setDraftAvatar] =
        useState<File | null>(null);

    const [avatarPreview, setAvatarPreview] =
        useState<string | null>(null);

    const [saving, setSaving] = useState(false);

    /* ================= FETCH PROFILE ================= */

    const fetchProfile = async () => {
        if (!service) return;

        const token =
            localStorage.getItem(`${service.id}-auth-token`);

        if (!token) {
            navigate(
                `/shinobu/${service.id}/login`,
                { replace: true }
            );
            return;
        }

        const userData =
            await shinobuFetch<ShinobuUser>(
                `/${service.version?.endpoint}/user/me/profile`,
                { baseUrl: service.url, localId: service.id }
            );

        setUser(userData);
        setDraftBio(userData.bio ?? "");
    };

    useEffect(() => {
        if (!service) return;

        const run = async () => {
            try {
                setLoading(true);

                localStorage.setItem(
                    `${service.id}-x-app-key`,
                    service.accessKey!
                );
                localStorage.setItem(
                    `${service.id}-x-app-secret`,
                    service.secretKey!
                );

                await fetchProfile();
            } catch {
                localStorage.removeItem(`${service.id}-auth-token`);
                navigate(
                    `/shinobu/${service.id}/login`,
                    { replace: true }
                );
            } finally {
                setLoading(false);
            }
        };

        run();
    }, [service]);

    /* ================= AVATAR PREVIEW ================= */

    useEffect(() => {
        if (!draftAvatar) {
            setAvatarPreview(null);
            return;
        }

        const url =
            URL.createObjectURL(draftAvatar);
        setAvatarPreview(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [draftAvatar]);

    /* ================= UPDATE PROFILE ================= */

    const handleSave = async () => {
        if (!service || !user) return;

        setSaving(true);

        try {
            const form = new FormData();
            form.append("bio", draftBio);

            if (draftAvatar) {
                form.append("avatar", draftAvatar);
            }

            await shinobuFetch(
                `/${service.version?.endpoint}/user/me/profile`,
                {
                    method: "PUT",
                    baseUrl: service.url,
                    body: form, 
                    localId: service.id
                }
            );

            // ✅ optimistic update (instant UI feedback)
            setUser({
                ...user,
                bio: draftBio,
                avatarUrl: avatarPreview ?? user.avatarUrl,
            });

            setEditMode(false);
            setDraftAvatar(null);

            // 🔁 hard refetch (signed URL safety)
            await fetchProfile();
        } finally {
            setSaving(false);
        }
    };

    /* ================= RENDER ================= */

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-400">
                Loading profile...
            </div>
        );
    }

    const avatarSrc =
        editMode && avatarPreview
            ? avatarPreview
            : user.avatarUrl ||
            `https://api.dicebear.com/8.x/identicon/svg?seed=${user.username}`;

    return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100">
            {/* HEADER */}
            <div className="border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-8 flex items-center gap-6">
                    {/* AVATAR */}
                    <div className="relative group">
                        <img
                            src={avatarSrc}
                            className="w-24 h-24 rounded-full border border-slate-700 object-cover"
                        />

                        {editMode && (
                            <>
                                {/* FILE INPUT — HARUS PALING ATAS */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 z-20 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setDraftAvatar(e.target.files[0]);
                                        }
                                    }}
                                />

                                {/* OVERLAY */}
                                <div className="absolute inset-0 z-10 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition pointer-events-none">
                                    Change
                                </div>
                            </>
                        )}
                    </div>

                    {/* INFO */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">
                            {user.displayName ||
                                user.username}
                        </h1>
                        <p className="text-slate-400">
                            @{user.username}
                        </p>

                        {user.role && (
                            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300">
                                {user.role}
                            </span>
                        )}

                        {!editMode && (
                            <button
                                onClick={() => setEditMode(true)}
                                className="mt-4 block text-sm px-4 py-1 rounded bg-slate-800 hover:bg-slate-700"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* BIO */}
                <section className="lg:col-span-1">
                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Bio
                        </h2>

                        {editMode ? (
                            <textarea
                                value={draftBio}
                                onChange={(e) =>
                                    setDraftBio(e.target.value)
                                }
                                rows={10}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C667F7]"
                                placeholder="Markdown supported"
                            />
                        ) : (
                            <div className="prose prose-invert prose-sm max-w-none">
                                <Markdown
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {user.bio || "_No bio yet_"}
                                </Markdown>
                            </div>
                        )}

                        {editMode && (
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-4 py-2 rounded bg-[#C667F7] text-black text-sm disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>

                                <button
                                    onClick={() => {
                                        setEditMode(false);
                                        setDraftBio(
                                            user.bio ?? ""
                                        );
                                        setDraftAvatar(null);
                                    }}
                                    className="px-4 py-2 rounded bg-slate-800 text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* RIGHT */}
                <section className="lg:col-span-2">
                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-slate-400 text-sm">
                        History / comments / activity
                        bisa ditaruh di sini.
                    </div>
                </section>
            </div>
        </div>
    );
}