import React from 'react';
import { Tabs } from 'antd';

interface StatusTabsProps {
  activeKey: string;
  onChange: (status: string) => void;
  items: {
    key: string;
    label: string;
    count: number;
  }[];
  className?: string;
}

const StatusTabs: React.FC<StatusTabsProps> = ({
  activeKey,
  onChange,
  items,
  className
}) => {
  return (
    <Tabs
      activeKey={activeKey}
      onChange={onChange}
      items={items.map(item => ({
        key: item.key,
        label: `${item.label} (${item.count})`
      }))}
      className={className}
    />
  );
};

export default StatusTabs; 