import OrderDetailsContainer from '@/components/user/orders/orderDetails/orderDetailsContainer'
import React from 'react'

export default async function Page({
    params,
}: {
    params: Promise<{ orderId: string }>
}) {
    const resolvedParams = await params; // Await the promise
    return <OrderDetailsContainer orderId={resolvedParams.orderId} />
}
