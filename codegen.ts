import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  generates: {
    "./packages/api/multisig/index.ts": {
      documents: "multisig-requests.graphql",
      schema: "multisig-schema.graphql",
      plugins: [
        "typescript",
        "typescript-operations",
        {
          "typescript-react-query": {
            exposeDocument: true,
            exposeQueryKeys: true,
            exposeFetcher: true,
          },
        },
      ],
    },
  },
};

export default config;
