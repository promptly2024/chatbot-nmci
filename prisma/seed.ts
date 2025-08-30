/* eslint-disable @typescript-eslint/no-require-imports */
// To Run this seed file use this command: ts-node prisma/seed.ts or npx prisma db seed

const { PrismaClient } = require("../app/generated/prisma");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const email = "rohitkuyada@gmail.com";
    const password = "12345678";

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create SuperAdmin if not exists
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: hashedPassword,
            role: "SUPERADMIN",
            isActive: true,
        },
    });

    console.log("Seeded SuperAdmin user:", user.email);

    const chatSession = await prisma.chatSession.create({
        data: {
            title: "Sales Query Example",
            userId: user.id,
            messages: {
                create: [
                    {
                        role: "USER",
                        content: "Show me sales between April and September",
                    },
                    {
                        role: "ASSISTANT",
                        content: "Here’s the summary:\n- April: $20,000\n- May: $25,000\n- June: $18,500\n- July: $23,000\n- August: $21,700\n- September: $27,300",
                        metadata: {
                            chart: "bar",
                            values: [20000, 25000, 18500, 23000, 21700, 27300],
                        },
                    },
                    {
                        role: "USER",
                        content: "Can you also give me a CSV export?",
                    },
                    {
                        role: "ASSISTANT",
                        content: "✅ CSV export has been generated and is ready for download.",
                        metadata: {
                            exportType: "CSV",
                            filePath: "/exports/sales_apr_sep.csv",
                        },
                    },
                ],
            },
        },
    });
    console.log("Seeded Chat Session with messages:", chatSession.id);
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
