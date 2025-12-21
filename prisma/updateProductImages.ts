import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const productUpdates = [
    {
      name: "Veranda Lounge Chair - Classic",
      image_url:
        "https://res.cloudinary.com/dbcuyckat/image/upload/v1760870920/verandalounge_chair_-_classic_ubx00x.png?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Veranda Stacking Chair",
      image_url:
        "https://res.cloudinary.com/dbcuyckat/image/upload/v1760870919/verandastackingchair_jtlqja.png?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Veranda Adirondack Chair",
      image_url:
        "https://res.cloudinary.com/dbcuyckat/image/upload/v1760870920/verandaadirondackchair_jlcrq8.png?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Veranda Dining Table - Round",
      image_url:
        "https://res.cloudinary.com/dbcuyckat/image/upload/v1760870917/verandadiningtable_-_round_mwy64p.png?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Veranda Side Table",
      image_url:
        "https://res.cloudinary.com/dbcuyckat/image/upload/v1760858729/sideTable_hzjoi8.jpg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Veranda Planter - Large",
      image_url:
        "https://res.cloudinary.com/dbcuyckat/image/upload/v1760870923/verandaplanter-_large_q0fnwb.png?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  for (const { name, image_url: imageUrl } of productUpdates) {
    await prisma.product.updateMany({
      where: { name },
      data: { imageUri: imageUrl },
    });
    console.log(`✓ Updated image for ${name}`);
  }

  console.log("\n✅ All product images updated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
