import { ZodNumber, ZodString } from "zod";

import { NetworkFeature, allFeatureObjects } from "@/networks/features";
import { capitalize } from "@/utils/text";

const main = async () => {
  console.log(`
    package networks

    import (
      "encoding/json"
      "github.com/pkg/errors"
    )
  `);

  const enumCode = await genFeaturesEnum();
  console.log(enumCode);

  const featureObjectsCode = await genFeatureObjects();
  console.log(featureObjectsCode);

  const unmarshalCode = await genUnmarshal();
  console.log(unmarshalCode);
};

const enumName = "FeatureType";

const genFeaturesEnum = async () => {
  let enumCode = `
  const (
`;

  for (const [key, value] of Object.entries(NetworkFeature)) {
    enumCode += `${enumName}${key} = ${enumName}("${value}")\n`;
  }

  enumCode += ")";
  return enumCode;
};

const zodToGoType = (zodType: unknown) => {
  switch (true) {
    case zodType instanceof ZodString:
      return "string";
    case zodType instanceof ZodNumber:
      return "float64";
    default:
      throw new Error(`failed to convert zod type ${zodType} to go type`);
  }
};

const genFeatureObjects = async () => {
  const strs = [];
  for (const featureObject of allFeatureObjects) {
    const { type, ...shape } = featureObject.shape;
    const structName = `Feature${type.value}`;
    const featureObjectCode = `
type ${structName} struct {
  *FeatureBase
${Object.entries(shape)
  .map(
    ([key, value]) =>
      `    ${capitalize(key)} ${zodToGoType(value)} \`json:"${key}"\``,
  )
  .join("\n")}
}

var _ Feature = &${structName}{}

func (f ${structName}) Type() ${enumName} {
  return ${enumName}${type.value}
}

func (nb *NetworkBase) Get${structName}() (*${structName}, error) {
  feature, err := nb.GetFeature(${enumName}${type.value})
  if err != nil {
    return nil, err
  }
  return feature.(*${structName}), nil
}
    `;
    strs.push(featureObjectCode);
  }
  return strs.join("\n");
};

const genUnmarshal = async () => {
  return `
func UnmarshalFeature(b []byte) (Feature, error) {
  var base FeatureBase
  if err := json.Unmarshal(b, &base); err != nil {
    return nil, errors.Wrap(err, "failed to unmarshal feature base")
  }
  switch base.Type {
    ${allFeatureObjects
      .map((featureObject) => {
        return `case ${enumName}${featureObject.shape.type.value}:
      var f Feature${featureObject.shape.type.value}
      if err := json.Unmarshal(b, &f); err != nil {
        return nil, errors.Wrap(err, "failed to unmarshal feature ${featureObject.shape.type.value}")
      }
      return &f, nil`;
      })
      .join("\n")}
  }
  return nil, errors.Errorf("unknown feature type %s", base.Type)
}
`;
};

main();

