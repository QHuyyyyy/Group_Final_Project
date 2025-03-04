import { Spin,Layout } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
export default function UserSpinner() {
    const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;
  return (
    (
        <Layout style={{ 
          height: "100vh", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          background: "#f0f2f5"
        }}>
          <div style={{ textAlign: "center" }}>
            <Spin indicator={loadingIcon} />
            <h2 style={{ marginTop: 20, color: "#1890ff" }}>Loading page...</h2>
          <p style={{ color: "#8c8c8c" }}>Please wait for a moment</p>
          </div>
        </Layout>
      )
  )
}
