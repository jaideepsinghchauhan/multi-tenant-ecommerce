import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CustomCategory } from "./types";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ca } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CustomCategory[];
}
export const CategoriesSidebar = ({ open, onOpenChange, data }: Props) => {
  const [parentCategory, setParentCategory] = useState<CustomCategory[] | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null);
  const router = useRouter();

  // If we have parent categories show those otherwise show root categories.
  // This allows us to drill down into subcategories on mobile.
  const currentCategories = parentCategory ?? data ?? [];

  const handleCategoryClick = (category: CustomCategory) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategory(category.subcategories as CustomCategory[]);
      setSelectedCategory(category);
    } else {
      // leaf category, no subcategory
      if (parentCategory && selectedCategory) {
        // this is a subcategory, navigate to /category/subcategory
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        // this is a root category
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }

      handleOpenChange(false);
    }
  };
  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategory(null);
    onOpenChange(open);
  };
const handleBackClick = () => {
    if(parentCategory) {
        setParentCategory(null)
        setSelectedCategory(null)
    }
}
  const backgroundColor = selectedCategory?.color || "white";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor: backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategory && (
            <button
              onClick={() => handleBackClick()}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
            >
              <ChevronLeftIcon className="size-4 mr-2"></ChevronLeftIcon>Back
            </button>
          )}
          {currentCategories.map((category: CustomCategory) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4 ml-auto" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
