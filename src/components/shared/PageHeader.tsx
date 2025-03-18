import { Input } from "antd";

const { Search } = Input;

interface PageHeaderProps {
  title: string;
  onSearch: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightContent?: React.ReactNode;
}

const PageHeader = ({ title, onSearch, onChange, rightContent }: PageHeaderProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center gap-4">
          <Search
            placeholder="Search by claim name"
            onSearch={onSearch}
            onChange={onChange}
            className="!w-72"
            allowClear
          />
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 