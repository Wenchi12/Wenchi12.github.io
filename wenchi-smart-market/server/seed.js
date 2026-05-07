const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sellers = [
  { phone: '260971001001', name: 'Grace Mwale', location: 'Soweto Market' },
  { phone: '260971002002', name: 'Joseph Banda', location: 'Kamwala Market' },
  { phone: '260971003003', name: 'Charity Phiri', location: 'Chisokone Market' },
  { phone: '260971004004', name: 'Patrick Tembo', location: 'Luburma Market' },
  { phone: '260971005005', name: 'Esther Zulu', location: 'City Market, Lusaka' },
];

const productsBySellerIndex = [
  [
    { name: 'Tomatoes', price: 25, quantity: 50, location: 'Soweto Market, Stall 14' },
    { name: 'Onions', price: 15, quantity: 80, location: 'Soweto Market, Stall 14' },
    { name: 'Rape (Rape Leaves)', price: 5, quantity: 120, location: 'Soweto Market, Stall 14' },
  ],
  [
    { name: 'Maize Flour (25kg)', price: 185, quantity: 30, location: 'Kamwala Market' },
    { name: 'Sugar Beans (1kg)', price: 35, quantity: 60, location: 'Kamwala Market' },
    { name: 'Groundnuts (1kg)', price: 45, quantity: 40, location: 'Kamwala Market' },
  ],
  [
    { name: 'Dried Kapenta (500g)', price: 55, quantity: 25, location: 'Chisokone Market' },
    { name: 'Fresh Tilapia (per fish)', price: 40, quantity: 20, location: 'Chisokone Market' },
    { name: 'Chibwabwa (Pumpkin Leaves)', price: 8, quantity: 70, location: 'Chisokone Market' },
  ],
  [
    { name: 'Charcoal (50kg bag)', price: 120, quantity: 15, location: 'Luburma Market' },
    { name: 'Sweet Potatoes (5kg)', price: 30, quantity: 35, location: 'Luburma Market' },
  ],
  [
    { name: 'Bananas (bunch)', price: 20, quantity: 45, location: 'City Market, Lusaka' },
    { name: 'Mangoes (dozen)', price: 30, quantity: 60, location: 'City Market, Lusaka' },
    { name: 'Avocados (3 pieces)', price: 15, quantity: 50, location: 'City Market, Lusaka' },
  ],
];

async function main() {
  console.log('Seeding Wenchi database...');

  // Clear existing data
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.seller.deleteMany();

  for (let i = 0; i < sellers.length; i++) {
    const seller = await prisma.seller.create({ data: sellers[i] });
    console.log(`Created seller: ${seller.name}`);

    for (const product of productsBySellerIndex[i]) {
      const p = await prisma.product.create({
        data: { ...product, sellerId: seller.id },
      });
      console.log(`  + ${p.name} @ K${p.price}`);
    }
  }

  console.log('\nSeed complete.');
  console.log(`${sellers.length} sellers, ${productsBySellerIndex.flat().length} products ready.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
