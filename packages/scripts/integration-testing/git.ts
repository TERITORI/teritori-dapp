import child_process from "child_process";
import fs from "fs/promises";
import { tmpdir } from "os";
import path from "path";

// Clone a git repo to a temporary directory and return the path
export const cloneRepo = async (
  repoURL: string,
  ref: string,
): Promise<string> => {
  const repoPath = await fs.mkdtemp(path.join(tmpdir(), "git-repo-"));
  const cmd = `git clone ${repoURL} ${repoPath} && cd ${repoPath} && git checkout ${ref}`;
  // console.log("> " + cmd);
  await new Promise((resolve, reject) => {
    child_process.exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(stdout + stderr));
      } else {
        resolve(undefined);
      }
    });
  });
  return repoPath;
};
