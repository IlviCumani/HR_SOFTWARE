import Table from "../../../components/Table/Table";

import { getColumns } from "./columns/AssetsColumn";

const AssetContent = ({ tableData }: any) => {
  const columns = getColumns(tableData);

  return <Table columns={columns} data={tableData} />;
};

export default AssetContent;
