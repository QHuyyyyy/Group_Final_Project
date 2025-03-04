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
            <p style={{ marginTop:20,color: "#8c8c8c" }}>Please wait</p>
          </div>
        </Layout>
      )
  )
}
