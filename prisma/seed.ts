/* eslint-disable @typescript-eslint/no-require-imports */
// To Run this seed file use this command: npx ts-node prisma/seed.ts or npx prisma db seed

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const email = "rohitkuyada@gmail.com";
    const password = "12345678";

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // const deleteChatMessages = await prisma.chatMessage.deleteMany({});
    // const deleteChatSessions = await prisma.chatSession.deleteMany({});
    // const deleteUser = await prisma.user.deleteMany({});
    // console.log("Deleted users:", deleteUser.count);
    // console.log("Deleted chat sessions:", deleteChatSessions.count);
    // console.log("Deleted chat messages:", deleteChatMessages.count);

    // create SuperAdmin if not exists
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            name: "Rohit Kumar Yadav",
            email,
            password: hashedPassword,
            role: "SUPERADMIN",
            image: "https://avatars.githubusercontent.com/u/130658366?v=4",
            isActive: true,
        },
    });

    console.log("Seeded SuperAdmin user:", user.email);

    // 1. Sales Query Example with bar chart
    const salesSession = await prisma.chatSession.create({
        data: {
            title: "Quarterly Sales Overview",
            userId: user.id,
            messages: {
                create: [
                    {
                        role: "USER",
                        content: "Show me sales between April and September",
                    },
                    {
                        role: "ASSISTANT",
                        content:
                            "Here’s the sales performance from April to September:\n- April: $20,000\n- May: $25,000\n- June: $18,500\n- July: $23,000\n- August: $21,700\n- September: $27,300",
                        metadata: {
                            type: "bar",
                            title: "Sales (Apr–Sep)",
                            description: "Monthly sales trend between April and September.",
                            data: {
                                items: [
                                    { label: "April", value: 20000 },
                                    { label: "May", value: 25000 },
                                    { label: "June", value: 18500 },
                                    { label: "July", value: 23000 },
                                    { label: "August", value: 21700 },
                                    { label: "September", value: 27300 },
                                ],
                            },
                        },
                    },
                ],
            },
        },
    });

    // 2. Product Breakdown Example with table
    const productSession = await prisma.chatSession.create({
        data: {
            title: "Product Breakdown",
            userId: user.id,
            messages: {
                create: [
                    {
                        role: "USER",
                        content: "Can you give me a breakdown by product for Q1?",
                    },
                    {
                        role: "ASSISTANT",
                        content:
                            "Here’s the product-wise sales for Q1:\n- Product A: $15,000\n- Product B: $10,000\n- Product C: $5,000",
                        metadata: {
                            type: "table",
                            title: "Product Sales (Q1)",
                            description: "Sales contribution of each product in Q1.",
                            data: {
                                headers: ["Product", "Sales (USD)"],
                                rows: [
                                    ["Product A", 15000],
                                    ["Product B", 10000],
                                    ["Product C", 5000],
                                ],
                            },
                        },
                    },
                ],
            },
        },
    });

    // 3. Market Share Example with pie chart
    const marketSession = await prisma.chatSession.create({
        data: {
            title: "Market Share Analysis",
            userId: user.id,
            messages: {
                create: [
                    {
                        role: "USER",
                        content: "What’s the market share distribution?",
                    },
                    {
                        role: "ASSISTANT",
                        content:
                            "Here’s the market share split:\n- Brand X: 40%\n- Brand Y: 35%\n- Brand Z: 25%",
                        metadata: {
                            type: "pie",
                            title: "Market Share Distribution",
                            description: "Percentage of market held by each brand.",
                            data: {
                                items: [
                                    { label: "Brand X", value: 40 },
                                    { label: "Brand Y", value: 35 },
                                    { label: "Brand Z", value: 25 },
                                ],
                            },
                        },
                    },
                ],
            },
        },
    });

    // 4. KPI Dashboard Example
    const kpiSession = await prisma.chatSession.create({
        data: {
            title: "Monthly KPI Report",
            userId: user.id,
            messages: {
                create: [
                    {
                        role: "USER",
                        content: "Give me the KPIs for March 2025",
                    },
                    {
                        role: "ASSISTANT",
                        content:
                            "Here are the KPIs for March 2025:\n- Total Revenue: $500,000\n- New Customers: 320\n- Churn Rate: 4%",
                        metadata: {
                            type: "kpi",
                            title: "March 2025 KPIs",
                            description: "Key performance metrics for March 2025.",
                            data: {
                                kpis: [
                                    {
                                        label: "Total Revenue",
                                        value: 500000,
                                        unit: "USD",
                                        trend: "up",
                                    },
                                    {
                                        label: "New Customers",
                                        value: 320,
                                        trend: "down",
                                    },
                                    {
                                        label: "Churn Rate",
                                        value: "4%",
                                        trend: "neutral",
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        },
    });

    // 5. Line Chart Example for yearly growth
    const growthSession = await prisma.chatSession.create({
        data: {
            title: "Yearly Growth Trend",
            userId: user.id,
            messages: {
                create: [
                    {
                        role: "USER",
                        content: "Can you show me the revenue growth over 2024?",
                    },
                    {
                        role: "ASSISTANT",
                        content:
                            "Here’s the monthly revenue growth for 2024:\n- Jan: $40k\n- Feb: $42k\n- Mar: $38k\n- Apr: $50k\n- May: $55k\n- Jun: $53k",
                        metadata: {
                            type: "line",
                            title: "Revenue Growth (2024)",
                            description: "Monthly revenue trend in 2024.",
                            data: {
                                items: [
                                    { label: "Jan", value: 40000 },
                                    { label: "Feb", value: 42000 },
                                    { label: "Mar", value: 38000 },
                                    { label: "Apr", value: 50000 },
                                    { label: "May", value: 55000 },
                                    { label: "Jun", value: 53000 },
                                ],
                            },
                        },
                    },
                ],
            },
        },
    });

    // 6. Example with no metadata
    const chatOnlySession = await prisma.chatSession.create({
        data: {
            title: "Casual Conversation",
            userId: user.id,
            messages: {
                create: [
                    {
                        role: "USER",
                        content: "What is your name?",
                    },
                    {
                        role: "ASSISTANT",
                        content: "My name is ChatGPT. How can I assist you today?",
                        metadata: {
                            type: "none",
                            data: {},
                        },
                    },
                ],
            },
        },
    });

    console.log("Seeded sessions:");
    console.log({
        salesSession: salesSession.id,
        productSession: productSession.id,
        marketSession: marketSession.id,
        kpiSession: kpiSession.id,
        growthSession: growthSession.id,
        chatOnlySession: chatOnlySession.id,
    });
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
