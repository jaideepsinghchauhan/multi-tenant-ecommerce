import {
    defaultShouldDehydrateQuery,
    QueryClient,
} from '@tanstack/react-query'
import superjson from 'superjson'

export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // to avoid refetching immediately on the client
                staleTime: 30 * 1000,
            },
            dehydrate: {
                // per default, only successful queries are included in dehydration
                serializeData: superjson.serialize,
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === 'pending',
            },
            hydrate: {
                deserializeData: superjson.deserialize,
            }
        },
    })
}