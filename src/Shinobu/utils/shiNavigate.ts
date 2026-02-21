import { useNavigate, type NavigateOptions, type To } from "react-router";

export const useShiNavigate = (serviceId?: string) => {
  const navigate = useNavigate();

  return (to: To | number, options?: NavigateOptions) => {
    if (!serviceId) return;

    if (typeof to === "number") {
      navigate(to);
      return;
    }

    if (typeof to === "string") {
      const cleanPath = to.startsWith("/") ? to.slice(1) : to;
      navigate(`/shinobu/${serviceId}/${cleanPath}`, options);
      return;
    }

    navigate(
      {
        ...to,
        pathname: to.pathname?.startsWith("/")
          ? `/shinobu/${serviceId}${to.pathname}`
          : `/shinobu/${serviceId}/${to.pathname ?? ""}`,
      },
      options
    );
  };
};