/**
 * Seed one realistic tenant and campaign.
 *
 * Run with: npm run db:seed
 *
 * Idempotent — safe to run repeatedly. It upserts by slug rather than creating
 * duplicates, because this points at the linked Neon branch and a seed that
 * piles up rows is worse than no seed.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set — run `neon link` first.");

const db = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: url.replace(/sslmode=(require|prefer)/, "sslmode=verify-full"),
  }),
});

const rupees = (n: number) => Math.round(n * 100);

async function main() {
  const tenant = await db.tenant.upsert({
    where: { slug: "music-club" },
    update: {},
    create: {
      slug: "music-club",
      name: "Music Club",
      type: "club",
      accentColour: "#1B52D7",
      contactName: "Priya Nair",
      contactPhone: "+919876543210",
      contactEmail: "priya@example.ac.in",
      status: "active",
    },
  });

  const corporate = await db.tenant.upsert({
    where: { slug: "northstar" },
    update: {},
    create: {
      slug: "northstar",
      name: "Northstar Analytics",
      type: "corporate",
      accentColour: "#0E7A57",
      contactName: "Aditi Rao",
      contactPhone: "+918045551234",
      contactEmail: "aditi@example.com",
      status: "active",
    },
  });

  // A lead, so the ops console has something to convert.
  await db.tenant.upsert({
    where: { slug: "litsoc" },
    update: {},
    create: {
      slug: "litsoc",
      name: "Literary Society",
      type: "club",
      contactName: "Rahul Iyer",
      contactPhone: "+919812345678",
      contactEmail: "rahul@example.ac.in",
      status: "lead",
    },
  });

  const chart = await db.sizeChart.upsert({
    where: {
      tenantId_name_version: {
        tenantId: tenant.id,
        name: "Heavyweight hoodie",
        version: 1,
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Heavyweight hoodie",
      version: 1,
      measurements: [
        { size: "S", chestCm: 52, lengthCm: 68 },
        { size: "M", chestCm: 55, lengthCm: 70 },
        { size: "L", chestCm: 58, lengthCm: 72 },
        { size: "XL", chestCm: 61, lengthCm: 74 },
        { size: "2XL", chestCm: 64, lengthCm: 76 },
      ],
    },
  });

  // A window relative to today, so the seeded storefront is always in its
  // live state rather than "not opened yet" a week after seeding.
  const day = 86_400_000;
  const opensAt = new Date(Date.now() - 5 * day);
  const closesAt = new Date(Date.now() + 9 * day);
  const deliveryEstimate = new Date(Date.now() + 23 * day);

  const existing = await db.campaign.findFirst({
    where: { tenantId: tenant.id, title: "Hostel Night 2026" },
  });

  if (existing) {
    await db.campaign.update({
      where: { id: existing.id },
      data: { opensAt, closesAt, deliveryEstimate, status: "live" },
    });
  }

  const campaign =
    existing ??
    (await db.campaign.create({
      data: {
        tenantId: tenant.id,
        title: "Hostel Night 2026",
        description:
          "Hoodies for the Class of '27. 320 GSM, printed in-house, your name on the sleeve if you want it.",
        opensAt,
        closesAt,
        moq: 40,
        moqFailurePolicy: "extend",
        deliveryEstimate,
        collectionInstructions:
          "Collect from the department office, Block 2, between 10am and 5pm.",
        status: "live",
        payoutPayeeType: "entity",
        payoutPayeeName: "Music Club",
        payoutBasis: "percent_gross",
        payoutValue: 800, // 8% in basis points
        payoutSlaDays: 14,
      },
    }));

  const product = await db.product.findFirst({
    where: { campaignId: campaign.id, name: "Heavyweight hoodie" },
  });

  if (!product) {
    const created = await db.product.create({
      data: {
        tenantId: tenant.id,
        campaignId: campaign.id,
        name: "Heavyweight hoodie",
        description:
          "320 GSM brushed fleece, unisex fit. Left chest print, optional sleeve name.",
        basePrice: rupees(899),
        images: [],
        printSpec: "Screen print, left chest 90mm",
        sizeChartId: chart.id,
        published: true,
      },
    });

    await db.variant.createMany({
      data: (["S", "M", "L", "XL", "2XL"] as const).map((size) => ({
        tenantId: tenant.id,
        productId: created.id,
        size,
        colour: "Navy",
        retired: size === "2XL",
      })),
      skipDuplicates: true,
    });
  }

  // ── Orders, so the dashboard has a real size spread to show ──────────────
  const variants = await db.variant.findMany({
    where: { tenantId: tenant.id },
    include: { product: true },
  });

  const existingOrders = await db.order.count({
    where: { tenantId: tenant.id, campaignId: campaign.id },
  });

  if (existingOrders === 0 && variants.length > 0) {
    const sellable = variants.filter((v) => !v.retired);
    const names = [
      "Priya Nair", "Arjun Mehta", "Sana Qureshi", "Rahul Iyer", "Meera Joshi",
      "Kabir Shah", "Ananya Rao", "Vikram Desai", "Ishita Bose", "Rohan Pillai",
      "Tara Menon", "Aditya Ghosh", "Nikita Reddy", "Farhan Ali", "Divya Kapoor",
      "Siddharth Jain", "Neha Chauhan", "Karan Malhotra", "Riya Sharma", "Manav Gupta",
    ];
    // A deliberately lopsided spread: real campaigns are never uniform, and a
    // dashboard that only ever shows flat data hides the thing it is for.
    const weights = [1, 3, 5, 3, 0]; // S M L XL 2XL(retired)

    const pool: typeof sellable = [];
    sellable.forEach((v, i) => {
      for (let n = 0; n < (weights[i] ?? 1); n++) pool.push(v);
    });

    for (let i = 0; i < names.length; i++) {
      const variant = pool[i % pool.length];
      const qty = i % 7 === 0 ? 2 : 1;
      const unitPrice = variant.product.basePrice + variant.priceDelta;
      const subtotal = unitPrice * qty;
      const tax = Math.round((subtotal * 1200) / 10_000);
      const roundedTax = Math.round(tax / 100) * 100;

      await db.order.create({
        data: {
          tenantId: tenant.id,
          campaignId: campaign.id,
          buyerName: names[i],
          phone: `+9198${String(10_000_000 + i * 137).slice(0, 8)}`,
          email: `${names[i].split(" ")[0].toLowerCase()}@example.ac.in`,
          identifier: `2022B${(i % 4) + 1}A${70_000 + i * 13}G`,
          subtotal,
          tax: roundedTax,
          total: subtotal + roundedTax,
          // One order left unpaid, so reconciliation has something real to show.
          paymentStatus: i === names.length - 1 ? "pending" : "paid",
          paymentRef: i === names.length - 1 ? null : `pay_seed_${i}`,
          pickupCode: `MHQ-${["3A4C","6E7F","9GHJ","4KPR","7TWX","3YAC","6EFG","9HJK","4PRT","7WXY","3ACE","6FGH","9JKP","4RTW","7XY3","3CEF","6GHJ","9KPR","4TWX","7Y3A"][i]}`,
          status: "confirmed",
          items: {
            create: {
              tenantId: tenant.id,
              variantId: variant.id,
              qty,
              unitPrice,
              taxAmount: roundedTax,
            },
          },
        },
      });
    }
  }

  const paidCount = await db.order.count({
    where: { tenantId: tenant.id, paymentStatus: "paid" },
  });

  console.info("Seeded:");
  console.info(`  ${paidCount} paid orders on the campaign`);
  console.info(`  ${tenant.name}   → http://music-club.localhost:3000`);
  console.info(`  ${corporate.name} → http://northstar.localhost:3000`);
  console.info(`  campaign "${campaign.title}" (${campaign.status})`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
