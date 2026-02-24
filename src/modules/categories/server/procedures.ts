
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { Category } from "@/payload-types";


export const categoriesRouter = createTRPCRouter({

    getMany: baseProcedure.query(async ({ ctx }) => {

        const data = await ctx.db.find({
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

        const formattedData = data.docs.map((doc) => ({
            ...doc,
            subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
                // because depth is 1 we are sure that type returned will be Category.
                ...(doc as Category),
            })),
        }));


        return formattedData
    })
}) 