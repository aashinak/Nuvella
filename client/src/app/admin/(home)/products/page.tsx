
import Category from '@/components/admin/products/categorySection/category'
import Products from '@/components/admin/products/productSection/products'
import React from 'react'

function Page() {
  return (
    <div className='p-5 flex flex-col gap-4 flex-grow overflow-y-auto w-full'>
      <Category/>
      <Products/>
    </div>
  )
}

export default Page