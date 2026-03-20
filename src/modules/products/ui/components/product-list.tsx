"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
    category?: string
}

export const ProductList = ({ category }: Props) => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.products.getMany.queryOptions(
            { category }
        )
    );

    return (
        <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

export const ProductListSkeleton = () => {
    return (
        <div>
            Loading...
        </div>
    )
}