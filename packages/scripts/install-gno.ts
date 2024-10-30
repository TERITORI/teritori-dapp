import child_process from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";

import sqh from "./sqh";

const ref = "9786fa366f922f04e1251ec6f1df6423b4fd2bf4";
const remote = "https://github.com/gnolang/gno.git";

const main = async () => {
  const buildDir = await fs.mkdtemp(path.join(os.tmpdir(), "gno-build-"));
  const cmd = `git clone ${sqh(remote)} ${sqh(buildDir)} && cd ${sqh(buildDir)} && git checkout ${sqh(ref)} && make install`;
  console.log(">", cmd);
  child_process.execSync(cmd, { stdio: "inherit" });
};

main();
