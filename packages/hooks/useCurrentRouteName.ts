import { NavigationState, useNavigationState } from "@react-navigation/native";

function getCurrentRouteName(navigationState: NavigationState) {
  if (!navigationState) {
    return null;
  }

  const route = navigationState.routes[navigationState.index];

  if (route.state) {
    return getCurrentRouteName(route.state as NavigationState);
  }

  return route.name;
}

export const useCurrentRouteName = () => {
  const navigationState = useNavigationState((state) => state);

  return getCurrentRouteName(navigationState);
};
