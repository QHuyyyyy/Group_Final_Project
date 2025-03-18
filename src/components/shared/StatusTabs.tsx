import { Tabs } from "antd";
import { FilterOutlined } from "@ant-design/icons";

interface StatusTab {
  key: string;
  label: string;
  count: number;
}

interface StatusTabsProps {
  activeKey: string;
  onChange: (value: string) => void;
  items: StatusTab[];
}

const StatusTabs = ({ activeKey, onChange, items }: StatusTabsProps) => {
  return (
    <div className="overflow-auto custom-scrollbar">
      <div className="flex flex-wrap gap-18 items-center mb-5 mx-2">
        <div className="flex items-center">
          <FilterOutlined className="mr-4 mb-2 text-gray-600" />
          <Tabs
            activeKey={activeKey}
            onChange={onChange}
            className="status-tabs"
            items={items.map(item => ({
              key: item.key,
              label: (
                <span className="flex items-center text-gray-600">
                  {item.label}
                  <span className="ml-1 text-gray-500">
                    ({item.count})
                  </span>
                </span>
              )
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusTabs; 