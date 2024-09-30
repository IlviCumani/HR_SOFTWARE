import { Table as T, Input, TableProps } from "antd";
import "../../styles/Table/Table.css";
import type { TablePropsType, createTableColumns } from "../../types/Table";

export function getAllUniqueValues(array: any[], key: string) {
  const uniqueValues = array
    .map((data) => data[key])
    .filter((value, index, self) => self.indexOf(value) === index);

  return uniqueValues.map((option) => ({
    text: option,
    value: option,
  }));
}

export function createTableColumns({
  title,
  dataIndex,
  key,
  fixed,
  displayAs,
  width = 100,
  align = "left",
  filters,
  filterSearch,
  filterIcon,
  filterDropdown = false,
  onFilter,
}: createTableColumns) {
  return {
    title: title,
    dataIndex: dataIndex,
    key: key,
    render: (text: any, record: any) =>
      displayAs ? displayAs(text, record) : text,
    fixed: fixed,
    width: width,
    align: align,
    filters: filters,
    filterSearch: filterSearch,
    filterDropdown: filterDropdown
      ? ({ setSelectedKeys, selectedKeys, confirm }: any) => (
          <Input
            autoFocus
            placeholder="Search name"
            value={selectedKeys[0]}
            size="large"
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          />
        )
      : undefined,
    filterIcon: filterIcon,
    onFilter: onFilter,
  };
}

interface ExtendedTablePropsType extends TablePropsType {
  onChange?: TableProps<any>["onChange"];
  rowSelection?: TableProps<any>["rowSelection"];
}

const Table = ({
  data,
  columns,
  fixed = false,
  pageSize,
  pagination,
  rowSelection,
  showHeader = true,
  expandable,
  onChange,
  identifier = "_id",
}: ExtendedTablePropsType) => {
  return (
    <T
      rowKey={(record) => record[identifier]}
      locale={{
        emptyText:
          "No data available in table. Please check if you have added data to the table. ",
      }}
      pagination={
        pagination
          ? { ...pagination, position: ["bottomLeft"] }
          : pagination === false
          ? false
          : { position: ["bottomLeft"], pageSize: pageSize ? pageSize : 10 }
      }
      className="information-table-of-doom-and-despair-des-pa-sito "
      columns={columns}
      dataSource={data}
      bordered
      rowClassName="table-row"
      showHeader={showHeader}
      size="small"
      scroll={{ x: fixed ? 1500 : undefined }}
      expandable={expandable ? expandable : undefined}
      onChange={onChange}
      rowSelection={rowSelection ? rowSelection : undefined}
    />
  );
};

export default Table;
