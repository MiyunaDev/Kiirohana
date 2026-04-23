import Lottie from "lottie-react";
import { useEffect } from "react";
import fetchLottie from "../../../utils/fetchLottie";

const ServiceLogo = ({
  baseUrl,
  logo,
  onLoad,
  logoData,
}: {
  baseUrl: string;
  logo: string;
  logoData?: any;
  onLoad?: (data: any) => void;
}) => {
  const fullUrl = `${baseUrl.replace(/\/$/, "")}${logo}`;
  const isLottie = logo.endsWith(".json");

  useEffect(() => {
    if (!isLottie || logoData) return;

    fetchLottie(fullUrl)
      .then(onLoad)
      .catch(console.error);
  }, [fullUrl, isLottie]);

  if (isLottie) {
    if (!logoData) return <div className="w-16 h-16">Loading…</div>;

    return (
      <Lottie
        animationData={logoData}
        loop
        className="w-16 h-16"
      />
    );
  }

  return (
    <img
      src={fullUrl}
      alt="service logo"
      className="w-16 h-16 object-contain"
    />
  );
};

export default ServiceLogo