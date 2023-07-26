import React, { useEffect, useState } from "react";
import { SvgProps } from "react-native-svg";
export const useDynamicSvgImport = (iconName: string) => {
  const [SvgComponent, setSvgComponent] = useState<
    React.FC<SvgProps> | null | undefined
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  useEffect(() => {
    setLoading(true);
    const importSvgIcon = async () => {
      try {
        const SvgIcon: React.FC<SvgProps> = (
          await import(`../../../assets/icons/freelance-service/${iconName}`)
        ).default;
        setSvgComponent(() => SvgIcon);
      } catch (err) {
        setError(err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    importSvgIcon();
  }, [iconName]);
  return { error, loading, SvgComponent };
};
