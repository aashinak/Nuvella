"use client"
import React from 'react'
import FilterPanel from './filterPanel'
import ProductGroup from './productGroup'

function SearchContainer() {
  return (
    <div className='w-full flex-grow flex '>
      <FilterPanel/>
      <ProductGroup/>
    </div>
  )
}

export default SearchContainer