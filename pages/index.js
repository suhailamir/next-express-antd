import { Card, List, Row, Layout, Empty, Input, Col } from 'antd'
const { Content } = Layout;
const { Meta } = Card;
import api from '../api/api'
const { Search } = Input;

import { useEffect, useState } from 'react'
import Link from 'next/link'
export default function Home() {
  const [products, setProducts] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [isError, setError] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState([])



  useEffect(async () => {
    setLoading(true)
    try {
      const { data, error } = await api('get', 'product');
      if (error) {
        setError(true)
        setLoading(false);
      } else {
        setProducts(data)
        setLoading(false);
      }
    } catch (e) {
      setError(true)
      setLoading(false);

    }
  }, [])
  if (isLoading) return <p>Loading...</p>
  if (!products || isError) return <Empty />
  const onSearch = async (key) => {
    if (!key || filteredProducts.length) {
      const { data, error } = await api('get', 'product');
      if (error) {
        setError(true)
        setLoading(false);
      } else {
        setProducts(data)
        setLoading(false);
      }
    } else {
      let serachResults = products.filter((item) => item.name.includes(key) || item.description.includes(key) || item.id.includes(key))
      setProducts(serachResults);
      setFilteredProducts(serachResults);
    }

  }
  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
      }}
    >
      <Row style={{ marginBottom: '1rem', justifyContent: 'flex-end' }}>
        <Col >
          <Search placeholder="Search products" allowClear onSearch={onSearch} />
        </Col>
      </Row>
      <Row >
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 6,
          }}
          split={true}
          dataSource={products}
          renderItem={product => (
            <Link href="/product/[id]" as={`/product/${product.id}`}>
              <a>
                <List.Item>
                  <Card
                    style={{ width: 300 }}
                    cover={
                      <img
                        alt="example"
                        src={product.imgUrl}
                      />
                    }
                  >
                    <Meta
                      title={product.name}
                      description={product.description}
                    />
                  </Card>
                </List.Item>
              </a>
            </Link>

          )}
        />

      </Row>
    </Content>


  )
}


