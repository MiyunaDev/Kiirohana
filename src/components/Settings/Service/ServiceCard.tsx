import { useEffect, useState } from "react";
import { ServiceItem } from "../../../interfaces/Service";
import useServiceInfo from "../../../utils/useServiceInfo";
import ServiceLogo from "./ServiceLogo";

const ServiceCard = ({
  service,
  onUpdate,
  onDelete,
}: {
  service: ServiceItem;
  onUpdate: (s?: ServiceItem) => void;
  onDelete?: () => void;
}) => {
  const [draftUrl, setDraftUrl] = useState(service.url);
  const [version, setVersion] = useState(
    service.info?.versions?.[0]?.endpoint ?? ""
  );

  console.log(service.url)

  useEffect(() => {
    setDraftUrl(service.url);
  }, [service.url]);

  const isDirty = draftUrl !== service.url;

  useServiceInfo(service, onUpdate, onDelete);

  return (
    <div className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl p-4">
      <div className="flex items-start gap-4">
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

        <div className="flex-1 flex flex-col gap-2">
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
              onChange={(e) => setDraftUrl(e.target.value)}
            />
          </div>

          {/* Info panel */}
          {service.info && (
            <div className="bg-[#262626] rounded-md p-3 mt-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                  {service.info.name}
                </span>

                {/* Version selector */}
                {service.info.versions?.length > 0 && (
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="bg-[#2a2a2a] text-xs px-2 py-1 rounded
                               outline-none focus:ring-1
                               focus:ring-[#C667F7]"
                  >
                    {service.info.versions.map((v) => (
                      <option
                        key={v.endpoint}
                        value={JSON.stringify(v)}
                      >
                        v{v.version}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <p className="text-xs opacity-70 mt-1">
                {service.info.description}
              </p>
            </div>
          )}

          {/* Error */}
          {service.error && (
            <span className="text-xs text-red-400">
              {service.error}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 items-end">
          {isDirty && (
            <button
              onClick={() =>
                onUpdate({
                  ...service,
                  url: draftUrl,
                  version: JSON.parse(version),
                })
              }
              className="text-xs px-3 py-1 rounded-md
                         bg-[#C667F7] text-black
                         hover:brightness-110
                         transition"
            >
              Save
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="text-xs text-red-400 hover:text-red-300"
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