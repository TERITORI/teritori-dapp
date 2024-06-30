import child_process from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";

import sqh from "./sqh";

const ref = "gnodev-api-reset";
const remote = "https://github.com/TERITORI/gno.git";

const main = async () => {
  const buildDir = await fs.mkdtemp(path.join(os.tmpdir(), "gno-build-"));
  const cmd = `git clone ${sqh(remote)} ${sqh(buildDir)} && cd ${sqh(buildDir)} && git checkout ${sqh(ref)} && make install`;
  console.log(">", cmd);
  child_process.execSync(cmd, { stdio: "inherit" });
};

main();
