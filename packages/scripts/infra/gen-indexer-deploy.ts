import { program } from "commander";
import fs from "fs";
import { Deployment } from "kubernetes-models/apps/v1";
import { Container } from "kubernetes-models/v1";
import path from "path";
import yaml from "yaml";

import { NetworkFeature, NetworkKind, getNetwork } from "@/networks";

program
  .option("-n, --network-id <network-id>", "network id")
  .option("-i, --image <image>", "image")
  .option("-o, --output-dir <output-dir>", "output directory")
  .option("-d, --database-name <database-name>", "database name");

program.parse();

const { networkId, image, outputDir, databaseName } = program.opts() as {
  networkId: string;
  image: string;
  outputDir: string;
  databaseName: string;
};

const network = getNetwork(networkId);
if (!network) {
  console.error(`Invalid network id: ${networkId}`);
  process.exit(1);
}

const genDeployment = (mode: string) => {
  const filePrefix = `${networkId}-${mode}-${databaseName}`;
  const podName = `indexer-${filePrefix}`;

  const args: string[] = [];
  if (network.kind === NetworkKind.Ethereum) {
    args.push("sink");
  }
  args.push(
    `--indexer-mode=${mode}`,
    `--indexer-network-id=${networkId}`,
    `--database-name=${databaseName}`,
  );

  const deployment = new Deployment({
    metadata: {
      name: podName,
    },
    spec: {
      selector: {
        matchLabels: {
          app: podName,
        },
      },
      template: {
        metadata: {
          labels: {
            app: podName,
          },
        },
        spec: {
          containers: [
            new Container({
              name: podName,
              image,
              imagePullPolicy: "Always",
              envFrom: [
                {
                  configMapRef: {
                    name: "teritori-env-from-file",
                  },
                },
                {
                  secretRef: {
                    name: "teritori-db-secret",
                  },
                },
              ],
              args,
            }),
          ],
        },
      },
    },
  });

  deployment.validate();

  const p = path.join(outputDir, `${filePrefix}.yaml`);
  console.log(`📜 ${p}`);
  fs.writeFileSync(p, yaml.stringify(deployment.toJSON(), null, 2));
};

genDeployment("data");
if (network.features.includes(NetworkFeature.RiotP2E)) {
  genDeployment("p2e");
}
