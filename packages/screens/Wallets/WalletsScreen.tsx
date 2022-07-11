import { WalletsManager } from "../../components/WalletsManager";
import { useAppNavigation } from "../../utils/navigation";

export const WalletsScreen: React.FC = () => {
  const navigation = useAppNavigation();
  return <WalletsManager onClose={navigation.goBack} />;
};
