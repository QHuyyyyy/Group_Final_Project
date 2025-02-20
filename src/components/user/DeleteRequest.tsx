import { Modal } from "antd";

interface DeleteRequestProps {
    id: number | null;
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteRequest: React.FC<DeleteRequestProps> = ({ id, visible, onConfirm, onCancel }) => {
    return (
        <Modal
            title="Confirm Deletion"
            open={visible}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Yes, Delete"
            okType="danger"
            cancelText="Cancel"
        >
            <p>Are you sure you want to SEND request ID {id}?</p>
            <p>This action cannot be undone.</p>
        </Modal>
    );
};

export default DeleteRequest;