
import * as React from "react";
import { SyncingEditor } from "./SyncingEditor";

export const GroupEditor = ({match}) =>  {
let params = match.params;
  return (
    <div>
      <SyncingEditor groupId={params.id} />
      {/* I am in group {params.id} */}
    </div>
  );
};