import { Input, Select } from "antd";

const { Search } = Input;
const { Option } = Select;

interface PageHeaderProps {
  title: string;
  onSearch: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightContent?: React.ReactNode;
  searchType?: string;
  onSearchTypeChange?: (value: string) => void;
  searchPlaceholder?: string;
}

const PageHeader = ({ 
  title, 
  onSearch, 
  onChange, 
  rightContent, 
  searchType = "claim_name",
  onSearchTypeChange,
  searchPlaceholder = "Search by claim name"
}: PageHeaderProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-[#d9d9d9] rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            {onSearchTypeChange && (
              <Select 
                defaultValue={searchType} 
                className="!w-36 font-medium text-blue-600"
                onChange={onSearchTypeChange}
                variant="borderless"
                popupClassName="font-medium"
                dropdownStyle={{ borderRadius: '0.375rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                optionLabelProp="label"
              >
                <Option value="claim_name" label={<span className="!text-blue-600 !font-semibold flex items-center">Claim Name</span>}>
                  <div className="flex items-center py-1">
                    <span className="text-black-400">Claim Name</span>
                  </div>
                </Option>
                <Option value="staff_name" label={<span className="!text-blue-600 !font-semibold flex items-center">Staff Name</span>}>
                  <div className="flex items-center py-1">
                    <span className="text-black-400">Staff Name</span>
                  </div>
                </Option>
              </Select>
            )}
            <div className="h-6 w-px bg-gray-300"></div>
            <Search
              placeholder={searchPlaceholder}
              onSearch={onSearch}
              onChange={onChange}
              className="!w-80"
              variant="borderless"
              allowClear
            />
          </div>
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 