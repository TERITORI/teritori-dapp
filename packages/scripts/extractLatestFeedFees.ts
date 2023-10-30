import { program } from "commander";
import fs from "fs";

const main = async () => {
  program.argument("<tx-log-file-path>");
  program.parse();

  const feesByCategory: { [key: number]: string } = {};

  const [txLogFilePath] = program.args as [string];

  const txLogFile = fs.readFileSync(txLogFilePath, "utf8");
  const txLog = JSON.parse(txLogFile);
  const { txs } = txLog;
  for (const tx of txs) {
    if (tx.code !== 0) {
      continue;
    }
    for (const m of tx.tx.body.messages) {
      const msg = m.msg;
      const payload = msg.update_fee_by_category;
      feesByCategory[payload.category] = payload.fee;
    }
  }
  console.log(JSON.stringify(feesByCategory, null, 2));
};

main();
