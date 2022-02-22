import { useRouter } from 'next/router'
import Link from 'next/link'
import api from '../../../api/api'
import { Layout, Empty, Row, Col, Button, Modal, Form, Input, InputNumber } from 'antd'
const { Content } = Layout;
import { useEffect, useState } from 'react'
const Product = () => {
    const router = useRouter()
    const [product, setProduct] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [isError, setError] = useState(false)
    const [reviews, setReviews] = useState(null)
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { id } = router.query
    useEffect(async () => {
        setLoading(true)
        const productData = await api('get', 'product/', {}, id);
        const reviewsData = await api('get', 'reviews/', {}, id);
        if (productData && productData.error) {
            setError(true)
            setLoading(false);
        } else {
            setProduct(productData.data)
            setLoading(false);
        }
        if (reviewsData && reviewsData.data) {
            setReviews(reviewsData.data)
        }
        return () => { return false }
    }, []);
    if (isLoading) return <p>Loading...</p>
    if (!product || isError) return <Empty />
    const style = { padding: "1rem 1rem" };
    const contentStyle = {
        padding: 24,
        margin: 0,
        minHeight: 280,
    };

    const showModal = () => {
        setVisible(true);
    };
    const handleCancel = () => {
        setVisible(false);
    };

    const onFinish = async (values) => {
        const reviewAdded = await api('post', 'reviews/', { ...values, productId: id }, id);
        if (reviewAdded && !reviewAdded.error) {
            console.log("revoew added");
            setVisible(false);
            setConfirmLoading(false);
            const reviewsData = await api('get', 'reviews/', {}, id);
            if (reviewsData && reviewsData.data) {
                setReviews(reviewsData.data)
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <Content style={contentStyle} className="site-layout-background">
            <Link href="/">
                <a>Back</a>
            </Link>
            <Row align="top" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={
                {
                    marginBottom: "1rem",
                }
            }>
                <Col className="gutter-row" span={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <img
                        alt="example"
                        width="100%"
                        src={product.imgUrl}
                    />
                </Col>
                <Col className="gutter-row" span={6}>
                    <Row gutter={16}>
                        <div style={style}>
                            <h2>{product.name}</h2>
                        </div>
                    </Row>
                    <Row gutter={16}>
                        <div style={style}>
                            <p>{product.price}{product.currency}</p>
                        </div>
                    </Row>
                    <Row gutter={16}>
                        <div style={style}>
                            <h3>{product.description}</h3>
                        </div>
                    </Row>
                </Col>
            </Row>
            <Row align="top" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={
                {
                    marginBottom: "3rem",
                }
            }>
                <Col className="gutter-row" span={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Button onClick={showModal}>Add a review</Button>
                </Col>
            </Row>
            <Row align="top" gutter={16}>
                {reviews && reviews.map((review, index) => {
                    return <Col className="gutter-row" span={12} key={index}>
                        <h2>Review #{index + 1}</h2>
                        <p>{review.text}</p>
                    </Col>
                })}
            </Row>
            <Modal
                title="Add review"
                visible={visible}
                // onOk={handleOk}
                confirmLoading={confirmLoading}
                // onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>
                ]}

            >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="locale"
                        name="locale"
                        rules={[{ required: true, message: 'Please input locale' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="rating"
                        name="rating"
                        rules={[{ required: true, message: 'Please input rating', }]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="text"
                        name="text"
                        rules={[{ required: true, message: 'Please add commments' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        </Content >
    )
}
export default Product