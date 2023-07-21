import {
  MultisigServiceClientImpl,
  GrpcWebImpl,
} from "../../api/multisig/v1/multisig";

// we use a hook to prevent huge refactor in the future if it starts depending on state

const rpc = new GrpcWebImpl("http://localhost:9091", {
  debug: false,
});
const client = new MultisigServiceClientImpl(rpc);

export const useMultisigClient = () => {
  return client;
};
