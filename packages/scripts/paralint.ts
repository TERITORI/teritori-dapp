import child_process from "child_process";
import fs from "fs/promises";
import { Listr } from "listr2";
import { z } from "zod";

import { zodTryParseJSON } from "../utils/sanitize";

const main = async () => {
  const confJSON = await fs.readFile("paralint.json", "utf-8");
  const conf = zodTryParseJSON(z.record(z.string()), confJSON);
  if (!conf) {
    console.error("Invalid paralint.json");
    process.exit(1);
  }
  const tasks = new Listr(
    Object.entries(conf).map(([name, cmd]) => {
      return {
        title: name,
        task: async () => {
          await new Promise((resolve, reject) => {
            child_process.exec(
              cmd,
              {
                encoding: "utf-8",
              },
              (err, stdout, stderr) => {
                if (err) {
                  reject(new Error(name + "\n" + stdout + stderr));
                } else {
                  resolve(undefined);
                }
              },
            );
          });
        },
      };
    }),
    {
      concurrent: true,
      exitOnError: false,
    },
  );
  await tasks.run();
  if (tasks.tasks.some((t) => t.state === "FAILED")) {
    console.error("Failed");
    process.exit(1);
  }
};

main();
