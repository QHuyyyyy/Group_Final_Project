import React from "react";
import { Card, Row, Col, Typography, Menu } from "antd";
import {
    CarOutlined,
    BankOutlined,
    GiftOutlined,
    ThunderboltOutlined,
    HeartOutlined,
    SafetyCertificateOutlined,
    TruckOutlined,
    ToolOutlined,
    VideoCameraOutlined,
    ShoppingOutlined,
    RocketOutlined
} from "@ant-design/icons";
import Header from "../../layout/header";
import Banner from "../../layout/banner";
import Footer from "../../layout/footer";

import { motion } from "framer-motion";
const { Title, Paragraph } = Typography;

const services = [
    { name: "Aviation", icon: <RocketOutlined /> },
    { name: "Automotive", icon: <CarOutlined /> },
    { name: "Banking & Financial Services", icon: <BankOutlined /> },
    { name: "Consumer Packaged Goods", icon: <GiftOutlined /> },
    { name: "Energy & Utilities", icon: <ThunderboltOutlined /> },
    { name: "Healthcare", icon: <HeartOutlined /> },
    { name: "Insurance", icon: <SafetyCertificateOutlined /> },
    { name: "Logistics", icon: <TruckOutlined /> },
    { name: "Manufacturing", icon: <ToolOutlined /> },
    { name: "Media & Entertainment", icon: <VideoCameraOutlined /> },
    { name: "Retail", icon: <ShoppingOutlined /> },
];

const Services: React.FC = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <Banner
                title="Services & Industries"
                description="We empower enterprises to achieve highest potential with extensive capabilities,
domain expertise and cutting-edge AI solutions."
            />
            <div className="text-center my-12">
                <Title level={2} style={{ color: "#f57c00" }}>Industries</Title>
                <Paragraph className="text-gray-600 text-lg max-w-3xl mx-auto">
                    Our industry-spanning services and solutions enable enterprises to enhance resilience,
                    agility, and global competitiveness.
                </Paragraph>
            </div>

            <div className="w-[80%] mx-auto mb-16">
                <Row gutter={[24, 24]} justify="center">
                    {services.map((service, index) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={index}>
                            <Card
                                hoverable
                                className="flex flex-col items-center justify-center text-center p-6 transition duration-300 hover:bg-blue-500 hover:text-white"
                            >
                                <div className="text-5xl text-orange-500 mb-4 transition duration-300 hover:text-white">
                                    {service.icon}
                                </div>
                                <Title level={4} className="text-gray-800 transition duration-300 hover:text-white">
                                    {service.name}
                                </Title>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Capabilities Section */}


            <div className="relative bg-gradient-to-b from-gray-100 via-gray-100 to-gray-100 text-black py-20 px-6">


                <div className="max-w-7xl mx-auto text-center">

                    {/* Tiêu đề chính */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Title level={2} className="text-white text-5xl font-extrabold">
                            Capabilities
                        </Title>
                    </motion.div>

                    {/* Thanh Menu */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mt-6"
                    >
                        <Menu mode="horizontal" className="flex justify-center bg-transparent border-none">
                            {[
                                "IT Strategic Consultancy",
                                "Digital Technologies and Platforms",
                                "Product Engineering Services",
                                "IT Management Services",
                                "IT Services"
                            ].map((item, index) => (
                                <Menu.Item
                                    key={index}
                                    className={`text-gray-300 hover:text-orange-400 transition-all duration-300 text-lg font-medium ${index === 0 ? "text-orange-400  " : ""
                                        }`}
                                    style={{ paddingBottom: "8px" }}
                                >
                                    {item}
                                </Menu.Item>
                            ))}
                        </Menu>
                    </motion.div>

                    {/* Nội dung chính */}
                    <Row gutter={[48, 48]} align="middle" className="mt-16">
                        {/* Phần text bên trái */}
                        <Col xs={24} md={12}>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-left"
                            >
                                <Title level={3} className="text-orange-400 text-4xl font-bold">
                                    DX Garage
                                </Title>
                                <Paragraph className="text-lg font-semibold text-gray-300">
                                    No-code / Low-code
                                </Paragraph>
                                <Paragraph className="text-gray-300 leading-relaxed text-xl">
                                    Digital transformation (DX) is challenging from ideation to enterprise-wide adoption.
                                    DX Garage provides tools, methodologies, and packages to accelerate your DX journey,
                                    reducing time to market and optimizing costs.
                                </Paragraph>
                                <a
                                    href="#"
                                    className="inline-flex items-center text-orange-400 text-lg font-semibold transition-all duration-300 hover:text-orange-300"
                                >
                                    See More →
                                </a>
                            </motion.div>
                        </Col>

                        {/* Phần hình ảnh bên phải */}
                        <Col xs={24} md={12}>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex justify-center"
                            >
                                <img
                                    src="https://fptsoftware.com/-/media/project/fpt-software/fso/uplift/overall/our-services/dx-garage.webp?extension=webp&modified=20241224073736&hash=692AE575D0AE00DB7FC2548A964BF221"
                                    alt="DX Garage"
                                    className="rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                                />
                            </motion.div>
                        </Col>
                    </Row>
                </div>
            </div>


            {/* You Might Like Section */}
            <div className="py-16 px-8 text-center">
                <Title level={2}>
                    You <span className="text-green-600">Might</span> <span className="text-orange-500">Like</span>
                </Title>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
                    {/* Hình ảnh */}
                    <div className="flex-1 flex justify-center">
                        <Card hoverable className="w-full">
                            <img
                                src="https://fptsoftware.com/-/media/project/fpt-software/fso/blog/talk-to-experts-episode-6-thumbnail.webp?extension=webp&modified=20250113074832&hash=F45C9F552D0FBB6CD056D1D509AC892A"
                                alt="Talk to Experts"
                                className="rounded-lg w-full object-cover"
                            />
                        </Card>
                    </div>

                    {/* Nội dung */}
                    <div className="flex-1 flex flex-col justify-center text-left">
                        <Title level={4}>
                            Talk to Experts Episode 6: Revving Up the Future of Intelligent Driving with Virtual ECU
                        </Title>
                        <Paragraph>
                            In the evolving world of software-defined vehicles, virtual ECUs (vECUs) play a central role in
                            streamlining both hardware and software development.
                        </Paragraph>
                        <a href="#" className="text-orange-400">Read more →</a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Services;
