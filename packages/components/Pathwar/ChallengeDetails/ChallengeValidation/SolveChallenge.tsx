import React, { useState } from "react";

import { PreValidate } from "./PreValidate";
import { ValidateForm } from "./ValidateForm";
import { Challenge } from "../../../../api/pathwar/v1/pathwar";

export const SolveChallenge: React.FC<{ data: Challenge }> = ({ data }) => {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <PreValidate data={data} setShowForm={setShowForm} showForm={showForm} />
      {showForm && <ValidateForm data={data} />}
    </>
  );
};
