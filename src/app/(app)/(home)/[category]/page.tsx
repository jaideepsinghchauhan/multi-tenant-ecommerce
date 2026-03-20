interface Props {
  params: Promise<{ category: string }>
}

const Page = async ({ params }: Props) => {
  const { category } = await params;
  return (
    <div>
      <p>Category: {category}</p>
    </div>
  );
};

export default Page;
