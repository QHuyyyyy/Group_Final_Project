import React, { useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Claim } from '../../models/ClaimModel';
import ClaimDetailsModal from '../../components/shared/ClaimDetailsModal';

interface ClaimRecord extends Claim {
  key: string;
}

const ViewClaimRequest: React.FC = () => {
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredClaims] = useState<ClaimRecord[]>([]);
  const [loading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedClaim(null);
  };

  const columns: ColumnsType<ClaimRecord> = [
    // ...columns config giữ nguyên
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={filteredClaims}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.totalItems,
          onChange: (page: number, pageSize: number) => {
            setPagination(prev => ({
              ...prev,
              current: page,
              pageSize: pageSize || 10
            }));
          }
        }}
      />
      
      {isModalVisible && selectedClaim && (
        <ClaimDetailsModal
          visible={isModalVisible}
          claim={selectedClaim}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ViewClaimRequest; 