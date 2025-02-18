import { useState } from "react";
import { Modal, Button, notification } from "antd";

interface ReturnRequestProps {
    id: number | null;
    visible: boolean;
    onReturn: (id: number) => void;
    onCancel: () => void;
}

const ReturnRequest: React.FC<ReturnRequestProps> = ({ id, visible, onReturn, onCancel }) => {
    const [loading, setLoading] = useState(false);

    const handleReturn = async () => {
        if (id === null) return;
        setLoading(true);


        setTimeout(() => {
            onReturn(id);
            setLoading(false);
            notification.success({
                message: "Request Returned",
                description: `Request ID ${id} has been returned to Draft.`,
            });
        }, 1000);
    };

    return (
        <Modal
            title="Return Request"
            open={visible}
            onOk={handleReturn}
            onCancel={onCancel}
            okText="Yes, Return"
            okType="primary"
            cancelText="Cancel"
            confirmLoading={loading}
        >
            <p>Are you sure you want to return request {id ? `ID ${id}` : "this request"} to Draft?</p>
            <p>Once returned, the status will change back to "Draft".</p>
        </Modal>
    );
};

export default ReturnRequest;
