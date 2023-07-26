import { useEffect, useState } from "react";
export const useDynamicPngImport = (pngName: string) => {
  const [PngComponent, setPngComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  useEffect(() => {
    setLoading(true);
    const importSvgIcon = async () => {
      try {
        const pngImg = (
          await import(`../../../assets/banners/freelance-service/${pngName}`)
        ).default;
        setPngComponent(() => pngImg);
      } catch (err) {
        setError(err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    importSvgIcon();
  }, [pngName]);
  return { error, loading, PngComponent };
};
