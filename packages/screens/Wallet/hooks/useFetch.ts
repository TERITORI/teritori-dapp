import { useEffect, useState } from "react";

type AsyncCallback<T> = () => Promise<T>;

export default function useFetch<T>(cbFunc: AsyncCallback<T>) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    (async () => {
      const returnedData = await cbFunc();
      setData(returnedData);
    })();
  }, [cbFunc]);

  return data;
}
