import child_process from "child_process";

import sqh from "./sqh";

const ref = "project-manager-atomic";
const remote = "git@github.com:TERITORI/gno.git";

const main = async () => {
  const cmd = `rm -fr gno && git clone ${sqh(remote)} && cd gno && git checkout ${sqh(ref)} && make install`;
  console.log(">", cmd);
  child_process.execSync(cmd, { stdio: "inherit" });
};

main();
