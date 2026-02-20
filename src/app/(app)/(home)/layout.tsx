import { Category } from "@/payload-types";
import Footer from "./footer";
import Navbar from "./navbar";
import { SearchFilters } from "./search-filters";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { CustomCategory } from "./search-filters/types";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1, // returns Categories and subcategories[0]
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
    sort: "name",
  });

  const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // because depth is 1 we are sure that type returned will be Category.
      ...(doc as Category),
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#F4F4F4]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
