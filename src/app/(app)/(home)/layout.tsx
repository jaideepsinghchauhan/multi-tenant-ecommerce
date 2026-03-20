import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";

import Footer from "@/modules/home/ui/components/footer";
import Navbar from "@/modules/home/ui/components/navbar";
import { SearchFilters, SearchFiltersSkeleton } from "@/modules/home/ui/components/search-filters";


interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  // this code below is using procdure and is prefetching the categories data on the server side before rendering the page,
  //  so that the data is available when the page is rendered. This can help improve performance and
  // reduce the time it takes for the page to load, as the data will already be available when the page is rendered.
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFiltersSkeleton />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 bg-[#F4F4F4]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
