export const getDuration = (
  days: string | undefined,
  hours: string | undefined,
  minutes: string | undefined,
): number => {
  const num_days = !days ? 0 : parseInt(days, 10);
  const num_hours = !hours ? 0 : parseInt(hours, 10);
  const num_minutes = !minutes ? 0 : parseInt(minutes, 10);
  return num_days * 3600 * 24 + num_hours * 3600 + num_minutes * 60;
};

export const getPercent = (num: number | undefined): string => {
  let ret_num: number;
  ret_num = num === undefined ? 0 : num;
  ret_num = ret_num < 0 ? 0 : ret_num;
  ret_num = ret_num > 100 ? 100 : ret_num;
  return (ret_num / 100).toFixed(2);
};

export const extractDaoKind = (
  votingModuleInfo: string,
): string | undefined => {
  const rawDaoKind = votingModuleInfo.split("@v")[0];
  switch (rawDaoKind) {
    case "gno.land/p/teritori/dao_roles_voting_group":
      return "roles based organization";
    case "gno.land/p/teritori/dao_voting_group":
      return "memberships based organization";
    default:
      return undefined;
  }
};
