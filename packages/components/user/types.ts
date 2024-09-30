export type TNSItems = "TNSManage" | "TNSRegister" | "TNSExplore";
export type TNSModals =
  | "TNSManage"
  | "TNSRegister"
  | "TNSExplore"
  | "TNSConsultName"
  | "TNSMintName"
  | "TNSUpdateName"
  | "TNSBurnName";

export type TNSCloseHandler = (
  modalName?: TNSModals,
  navigateTo?: TNSModals,
  name?: string,
) => void;

export interface TNSModalCommonProps {
  onClose: TNSCloseHandler;
  navigateBackTo?: TNSModals;
}
