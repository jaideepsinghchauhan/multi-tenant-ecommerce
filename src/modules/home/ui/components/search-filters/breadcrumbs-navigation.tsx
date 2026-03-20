import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

interface Props {
    activeCategory: string;
    activeCategoryName: string | null;
    activeSubcategoryName: string | undefined;
}

export const BreadcrumbsNavigation = ({ activeCategory, activeCategoryName, activeSubcategoryName }: Props) => {

    if (!activeCategoryName || activeCategory === "all") {
        return null;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {
                    activeSubcategoryName ? (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild className="text-xl font-medium underline text-primary">
                                    <Link href={`/${activeCategory}`}>{activeCategoryName}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-primary font-medium text-lg">/</BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-xl font-medium underline text-primary">
                                    {activeSubcategoryName}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    ) : (
                        <BreadcrumbItem>
                                <BreadcrumbPage className="text-xl font-medium underline text-primary">
                                    {activeCategoryName}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                    )

                }
            </BreadcrumbList>
        </Breadcrumb>
    );
};