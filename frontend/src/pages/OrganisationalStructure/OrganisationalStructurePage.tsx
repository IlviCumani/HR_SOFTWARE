import { useEffect, useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import { TreeNode } from "primereact/treenode";
import "../OrganisationalStructure/style/OrganisationalStructure.css";
import "../../../node_modules/primereact/resources/primereact.css";
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";
import useHttp from "../../hooks/useHttp";
import { formatData, nodeTemplate } from "./helperFunctions";

export default function SelectionDemo() {
  const [selection, setSelection] = useState<TreeNode[]>([]);
  const [, , sendRequest] = useHttp();

  useEffect(() => {
    sendRequest(
      {
        endpoint: "employees/organizational-tree",
        headers: {
          "Content-Type": "application/json",
        },
      },

      (data) => {
        data && formatData(data, setData);
      }
    );
  }, []);

  const [data, setData] = useState<TreeNode[]>([]);

  return (
    <div className="card overflow-x-auto">
      {data && data.length > 0 && (
        <OrganizationChart
          value={data}
          selectionMode="multiple"
          selection={selection}
          onSelectionChange={(e) => setSelection(e.data)}
          nodeTemplate={nodeTemplate}
        />
      )}
    </div>
  );
}
