import { EllipsisOutlined, HeartOutlined, LoadingOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Avatar, Card, Carousel, Empty, Input, Pagination, Select } from 'antd'
import Meta from 'antd/es/card/Meta'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useDebounce from '../hook/useDebounce'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  

  function handleProductsSearch(e) {
    setLoading(true)
    setSearch(e.target.value)
  }


  // select start
  const onChange = (value) => {
    setLoading(true)
    setTimeout(() => {
      setSelectedCategory(value)
    }, 1000)
  };

  useEffect(() => {
    axios.get('https://api.escuelajs.co/api/v1/categories').then(res => {
      setCategories(res.data.map(item => {
        const data = {
          value: item.id,
          label: item.name
        }
        return data
      }))
    })
  }, [])

  // select end

  const searchWaiting = useDebounce(search, 600)

  useEffect(() => {
    axios.get(`https://api.escuelajs.co/api/v1/products`, {
      params: {
        title: searchWaiting,
        categoryId: selectedCategory,
        offset: 0,
        limit: 20,
      }
    }).then(res => {
      setProducts(res.data)

      setLoading(false)
    })
  }, [searchWaiting, selectedCategory])

  return (
    <div className='p-2 max-w-[1100px] mx-auto'>
      <div className='flex justify-centers items-center space-x-10 mb-6'>
        <Input onChange={handleProductsSearch} allowClear size='large' autoComplete='off' className='w-[400px] ' name='search' placeholder='Searching ....' />
        <Select allowClear size='large' className='w-[300px]'
          showSearch
          placeholder="Choose a category"
          optionFilterProp="label"
          onChange={onChange}
          options={categories}
        />
      </div>
      <Carousel style={{ width: '100%', height: '230px', margin: '0 auto 30px', borderRadius: '20px' }} autoplay effect="fade">
        {products.length > 0 ? products.map(item => <img key={item.id} className='h-[230px] w-full rounded-lg object-cover' src={item.images[0]} alt='products' />) : ""}
      </Carousel>

      <ul className='flex items-center flex-wrap justify-between pb-10 gap-10'>

        {loading ? <li className='mx-auto mt-[100px]'><LoadingOutlined style={{ fontSize: '70px' }} /></li> :
          products.length > 0 ? products.map(item => (<li key={item.id}>
            <Card className='shadow-xl'
              style={{ width: 300 }}
              cover={
                <img
                  alt="product image"
                  src={item.images[1]}
                />
              }
              actions={[
                <EllipsisOutlined className='scale-150' key="ellipsis" />,
                <ShoppingCartOutlined className='scale-150' key="shopping" />,
                <HeartOutlined className='scale-150' key='heart' />
              ]}
            >
              <Meta
                avatar={<Avatar src={item.category.image} />}
                title={item.title}
                description={<p className='line-clamp-2'>{item.description}</p>}
              />
            </Card>
          </li>
          ))
            : <li className='mx-auto mt-[100px] scale-150'><Empty /></li>
        }
      </ul>
      {/* <Pagination style={{ textAlign: 'center', marginTop: '20px' }}
        onChange={handlePaginationChange}
        defaultCurrent={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total} /> */}

    </div>
  )
}

export default Home
