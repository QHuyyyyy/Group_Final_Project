import { useState } from "react";
import { Modal, notification } from "antd";

interface CancelRequestProps {
    id: string | null;
    status: string;
    visible: boolean;
    onCancelRequest: (id: string) => Promise<void>;
    onClose: () => void;
}
// const CancelRequest: React.FC<CancelRequestProps> = ({ id, status, visible, onCancelRequest, onClose }) => {
const CancelRequest: React.FC<CancelRequestProps> = ({ id, visible, onCancelRequest, onClose }) => {
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        if (id === null) return;
        setLoading(true);

        setTimeout(() => {
            onCancelRequest(id);
            setLoading(false);
            notification.success({
                message: "Request Cancelled",
                description: `Request ID ${id} has been cancelled.`,
            });
        }, 1000);
    };

    return (
        <Modal
            title="Cancel Request"
            open={visible}
            onOk={handleCancel}
            onCancel={onClose}
            okText="Yes, Cancel"
            okType="danger"
            cancelText="Cancel"
            confirmLoading={loading}
        >
            <p>
                Are you sure you want to cancel request {id ? `ID ${id}` : "this request"}?
            </p>
            <p>Once cancelled, the status will change to "Cancelled".</p>
        </Modal>
    );
};

export default CancelRequest;
