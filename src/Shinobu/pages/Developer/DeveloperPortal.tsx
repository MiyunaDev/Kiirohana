import { useEffect, useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaSync, FaPowerOff, FaTimes, FaEdit, FaArrowLeft, FaHome } from "react-icons/fa";
import { shinobuFetch } from "../../utils/fetchShinobu";
import { useShinobu } from "../../hooks/useShinobu";
import { useShiNavigate } from "../../utils/shiNavigate";

interface BotUser {
  _id: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  role: string;
}

interface Application {
  _id: string;
  name: string;
  description?: string;
  clientId: string;
  active: boolean;
  botUser?: BotUser;
}

interface SecretResponse {
  clientId: string;
  clientSecret: string;
}

export default function DeveloperApplicationsPage() {
  const { service } = useShinobu();
  const navigate = useShiNavigate(service?.id);
  const endpoint = service?.version?.endpoint;

  const apiConfig = service
    ? { auth: true, baseUrl: service.url, localId: service.id }
    : null;

  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [_, setError] = useState<string | null>(null);

  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretData, setSecretData] = useState<SecretResponse | null>(null);

  const [showBotModal, setShowBotModal] = useState(false);
  const [editingBotAppId, setEditingBotAppId] = useState<string | null>(null);
  const [botForm, setBotForm] = useState({
    displayName: "",
    bio: "",
    avatarFile: null as File | null,
    avatarPreview: "" as string,
  });

  const [createForm, setCreateForm] = useState({
    name: "",
    description: ""
  });

  /* ================= FETCH APPS ================= */
  const fetchApps = async () => {
    if (!apiConfig || !endpoint) return;
    try {
      setLoading(true);
      const res = await shinobuFetch<Application[]>(`/${endpoint}/applications`, apiConfig);
      if (Array.isArray(res)) setApps(res);
      else if (Array.isArray((res as any)?.data)) setApps((res as any).data);
      else setApps([]);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [endpoint]);

  /* ================= CREATE APPLICATION ================= */
  const createApp = async () => {
    if (!apiConfig || !endpoint || !createForm.name) return;
    try {
      const res = await shinobuFetch<any>(`/${endpoint}/applications`, {
        ...apiConfig,
        method: "POST",
        body: createForm,
      });
      setSecretData({ clientId: res.clientId, clientSecret: res.clientSecret });
      setShowSecretModal(true);
      setCreateForm({ name: "", description: "" });
      fetchApps();
    } catch (err) {
      console.error(err);
      setError("Gagal membuat application");
    }
  };

  /* ================= BOT PROFILE ================= */
  const openBotModal = (app: Application) => {
    if (!app.botUser) return;
    setEditingBotAppId(app._id);
    setBotForm({
      displayName: app.botUser.displayName || "",
      bio: app.botUser.bio || "",
      avatarFile: null,
      avatarPreview: app.botUser.avatar || "",
    });
    setShowBotModal(true);
  };

  const handleBotChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "avatar" && files?.[0]) {
      const file = files[0];
      setBotForm((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    } else setBotForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveBotProfile = async () => {
    if (!apiConfig || !endpoint || !editingBotAppId) return;
    try {
      const formData = new FormData();
      if (botForm.displayName) formData.append("displayName", botForm.displayName);
      if (botForm.bio) formData.append("bio", botForm.bio);
      if (botForm.avatarFile) formData.append("avatar", botForm.avatarFile);

      const res = await shinobuFetch<Application>(`${service!.url}/${endpoint}/applications/${editingBotAppId}/bot/profile`, {
        method: "PATCH",
        auth: true,
        body: formData,
        localId: service.id
      });
      setApps((prev) =>
        prev.map((app) => (app._id === editingBotAppId ? { ...app, botUser: res.botUser } : app))
      );
      setShowBotModal(false);
      setEditingBotAppId(null);
    } catch (err) {
      console.error(err);
      setError("Gagal update profile bot");
    }
  };

  /* ================= REGENERATE SECRET ================= */
  const regenerateSecret = async (id: string) => {
    if (!apiConfig || !endpoint) return;
    try {
      const res = await shinobuFetch<SecretResponse>(`/${endpoint}/applications/${id}/regenerate-secret`, { ...apiConfig, method: "POST" });
      setSecretData(res);
      setShowSecretModal(true);
    } catch (err) {
      console.error(err);
      setError("Gagal regenerate secret");
    }
  };

  /* ================= TOGGLE ACTIVE ================= */
  const toggleStatus = async (id: string, active: boolean) => {
    if (!apiConfig || !endpoint) return;
    try {
      await shinobuFetch(`/${endpoint}/applications/${id}/status`, {
        ...apiConfig,
        method: "PATCH",
        body: { active: !active },
      });
      setApps((prev) =>
        prev.map((app) => (app._id === id ? { ...app, active: !active } : app))
      );
    } catch (err) {
      console.error(err);
      setError("Gagal mengubah status");
    }
  };

  /* ================= UI ================= */
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading applications...</div>;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 p-6">
      {/* Floating Navigation */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 px-3 py-2 rounded-full bg-black/70 backdrop-blur hover:bg-[#C667F7] transition shadow-lg">
          <FaArrowLeft /> <span className="text-sm">Back</span>
        </button>
        <button onClick={() => navigate("/app/home")} className="flex items-center gap-1 px-3 py-2 rounded-full bg-black/70 backdrop-blur hover:bg-[#C667F7] transition shadow-lg">
          <FaHome /> <span className="text-sm">Home</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Developer Applications</h1>

      {/* CREATE APPLICATION */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-[#C667F7] mb-4">Create Application</h2>
        <div className="flex gap-3">
          <input type="text" placeholder="Name" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} className="flex-1 p-2 bg-gray-800 rounded" />
          <button onClick={createApp} className="px-4 py-2 border border-[#C667F7] text-[#C667F7] hover:bg-[#C667F7] hover:text-white transition rounded"><FaPlus /></button>
        </div>
      </div>

      {/* LIST APPLICATIONS */}
      <div className="grid md:grid-cols-2 gap-6">
        {apps.length === 0 && <div className="opacity-60">Belum ada application.</div>}
        {apps.map((app) => (
          <div key={app._id} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{app.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${app.active ? "bg-green-500/20" : "bg-red-500/20"}`}>{app.active ? "Active" : "Inactive"}</span>
            </div>
            <p className="text-sm opacity-60 mt-1">{app.description}</p>
            <div className="mt-3 text-xs">Client ID: {app.clientId}</div>

            {app.botUser && (
              <div className="flex items-center gap-2 mt-3 text-sm opacity-80">
                <img src={botForm.avatarPreview || app.botUser.avatar || `https://api.dicebear.com/8.x/identicon/svg?seed=${app.botUser?.username}`} alt={app.botUser.username} className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between items-center text-lg">
                    <span>{app.botUser.displayName || app.botUser.username}</span>
                    <span className="text-xs opacity-50">{app.botUser.role}</span>
                  </div>
                  {app.botUser.bio && <div className="text-xs opacity-50">{app.botUser.bio}</div>}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={() => regenerateSecret(app._id)} className="text-yellow-400 text-sm"><FaSync /></button>
              <button onClick={() => toggleStatus(app._id, app.active)} className="text-gray-400 text-sm"><FaPowerOff /></button>
              {app.botUser && <button onClick={() => openBotModal(app)} className="text-blue-400 text-sm"><FaEdit /></button>}
            </div>
          </div>
        ))}
      </div>

      {/* BOT PROFILE MODAL */}
      <AnimatePresence>
        {showBotModal && editingBotAppId && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-900 p-6 rounded-xl border border-[#C667F7] w-full max-w-md" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <h2 className="text-[#C667F7] mb-3">Edit Bot Profile</h2>
              {botForm.avatarPreview && <img src={botForm.avatarPreview} alt="preview" className="w-16 h-16 rounded-full mb-2" />}
              <input type="text" name="displayName" placeholder="Display Name" value={botForm.displayName} onChange={handleBotChange} className="w-full p-2 mb-2 rounded bg-gray-800 text-white" />
              <textarea name="bio" placeholder="Bio" value={botForm.bio} onChange={handleBotChange} className="w-full p-2 mb-2 rounded bg-gray-800 text-white" />
              <input type="file" name="avatar" accept="image/*" onChange={handleBotChange} className="mb-4" />
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowBotModal(false)} className="text-gray-400">Cancel</button>
                <button onClick={saveBotProfile} className="text-[#C667F7]">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECRET MODAL */}
      <AnimatePresence>
        {showSecretModal && secretData && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-900 p-6 rounded-xl border border-[#C667F7]" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <h2 className="text-[#C667F7] mb-3">Save Your Secret</h2>
              <p className="text-sm">Client ID: {secretData.clientId}</p>
              <p className="text-red-400 text-sm">Secret: {secretData.clientSecret}</p>
              <button onClick={() => setShowSecretModal(false)} className="mt-4 text-sm"><FaTimes /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}