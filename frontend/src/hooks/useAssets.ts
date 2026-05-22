import { useAssetsContext } from "@/context/AssetsContext";

export type { Assets } from "@/context/AssetsContext";

export const useAssets = () => useAssetsContext();
