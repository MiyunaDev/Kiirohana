import { useEffect, useMemo, useState } from "react";
import { ServiceItem } from "../../../interfaces/Service";
import ServiceLogo from "./ServiceLogo";
import { shinobuFetch } from "../../../utils/fetchShinobu";

type Props = {
  service: ServiceItem;
  onUpdate: (s?: ServiceItem) => void;
  onDelete?: () => void;
};

const ServiceCard = ({ service, onUpdate, onDelete }: Props) => {
  const isShinobu = service.kind === "shinobu";

  /* ================= STATE ================= */

  const [draftUrl, setDraftUrl] = useState(service.url);

  const [draftVersion, setDraftVersion] =
    useState<ServiceItem["version"]>(
      service.version ?? service.info?.versions?.[0]
    );

  const [draftAccessKey, setDraftAccessKey] = useState(
    isShinobu ? service.accessKey ?? "" : ""
  );
  const [draftSecretKey, setDraftSecretKey] = useState(
    isShinobu ? service.secretKey ?? "" : ""
  );

  const [loadingInfo, setLoadingInfo] = useState(false);

  /* ================= SYNC FROM PARENT ================= */

  useEffect(() => {
    setDraftUrl(service.url);
    setDraftVersion(service.version);

    if (isShinobu) {
      setDraftAccessKey(service.accessKey ?? "");
      setDraftSecretKey(service.secretKey ?? "");
    }
  }, [
    service.url,
    service.version,
    service.accessKey,
    service.secretKey,
    isShinobu,
  ]);

  /* ================= FETCH SHINOBU INFO ================= */

  useEffect(() => {
    if (!isShinobu) return;
    if (!draftUrl) return;
    if (!draftAccessKey || !draftSecretKey) return;

    let aborted = false;

    const fetchInfo = async () => {
      setLoadingInfo(true);

      try {
        // temporary inject app credential for fetch
        localStorage.setItem(`${service.id}-x-app-key`, draftAccessKey);
        localStorage.setItem(`${service.id}-x-app-secret`, draftSecretKey);

        const info = await shinobuFetch<ServiceItem["info"]>(
          "/info",
          { auth: false, baseUrl: service.url, localId: service.id }
        );

        if (aborted) return;

        onUpdate({
          ...service,
          info,
          version: service.version ?? info?.versions?.[0],
          error: undefined,
        });
      } catch (err) {
        if (aborted) return;

        onUpdate({
          ...service,
          info: undefined,
          error:
            err instanceof Error
              ? err.message
              : "Gagal mengambil info service",
        });
      } finally {
        setLoadingInfo(false);
      }
    };

    fetchInfo();

    return () => {
      aborted = true;
    };
  }, [
    isShinobu,
    draftUrl,
    draftAccessKey,
    draftSecretKey,
  ]);

  /* ================= DIRTY CHECK ================= */

  const isDirty = useMemo(() => {
    if (draftUrl !== service.url) return true;

    if (
      draftVersion?.endpoint !==
      service.version?.endpoint
    )
      return true;

    if (isShinobu) {
      if (
        draftAccessKey !== service.accessKey ||
        draftSecretKey !== service.secretKey
      )
        return true;
    }

    return false;
  }, [
    draftUrl,
    draftVersion,
    draftAccessKey,
    draftSecretKey,
    service,
    isShinobu,
  ]);

  const handleSave = () => {
    onUpdate({
      ...service,
      url: draftUrl.trim(),
      version: draftVersion,
      ...(isShinobu
        ? {
            accessKey: draftAccessKey.trim(),
            secretKey: draftSecretKey.trim(),
          }
        : {}),
    });
  };

  /* ================= RENDER ================= */

  return (
    <div className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl p-4">
      <div className="flex items-start gap-4">
        {/* LOGO */}
        {service.info?.logo && (
          <ServiceLogo
            baseUrl={draftUrl}
            logo={service.info.logo}
            logoData={service.logoData}
            onLoad={(data) =>
              onUpdate({ ...service, logoData: data })
            }
          />
        )}

        <div className="flex-1 flex flex-col gap-3">
          {/* URL */}
          <div className="flex flex-col gap-1">
            <label className="text-xs opacity-60">
              Service URL
            </label>
            <input
              className="bg-[#2a2a2a] p-2 rounded-md outline-none
                         focus:ring-2 focus:ring-[#C667F7]"
              placeholder="https://example.com"
              value={draftUrl}
              onChange={(e) =>
                setDraftUrl(e.target.value)
              }
            />
          </div>

          {/* SHINOBU CREDENTIALS */}
          {isShinobu && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                className="bg-[#2a2a2a] p-2 rounded-md"
                placeholder="Access Key"
                value={draftAccessKey}
                onChange={(e) =>
                  setDraftAccessKey(e.target.value)
                }
              />
              <input
                type="password"
                className="bg-[#2a2a2a] p-2 rounded-md"
                placeholder="Secret Key"
                value={draftSecretKey}
                onChange={(e) =>
                  setDraftSecretKey(e.target.value)
                }
              />
            </div>
          )}

          {/* INFO PANEL */}
          {service.info && (
            <div className="bg-[#262626] rounded-md p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">
                  {service.info.name}
                </span>

                <select
                  value={draftVersion?.endpoint ?? ""}
                  onChange={(e) =>
                    setDraftVersion(
                      service.info?.versions.find(
                        (v) =>
                          v.endpoint ===
                          e.target.value
                      )
                    )
                  }
                  className="bg-[#2a2a2a] text-xs px-2 py-1 rounded"
                >
                  {service.info.versions.map(
                    (v) => (
                      <option
                        key={v.endpoint}
                        value={v.endpoint}
                      >
                        v{v.version}
                      </option>
                    )
                  )}
                </select>
              </div>

              <p className="text-xs opacity-70 mt-1">
                {service.info.description}
              </p>
            </div>
          )}

          {loadingInfo && (
            <span className="text-xs opacity-50">
              Mengambil info service...
            </span>
          )}

          {service.error && (
            <span className="text-xs text-red-400">
              {service.error}
            </span>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-2 items-end">
          {isDirty && (
            <button
              onClick={handleSave}
              className="text-xs px-3 py-1 rounded-md
                         bg-[#C667F7] text-black"
            >
              Save
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="text-xs text-red-400"
            >
              Hapus
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;