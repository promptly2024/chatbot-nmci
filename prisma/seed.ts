/* eslint-disable @typescript-eslint/no-require-imports */
// To Run this seed file use this command: ts-node prisma/seed.ts or npx prisma db seed

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const email = "rohitkuyada@gmail.com";
    const password = "12345678";

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const deleteChatMessages = await prisma.chatMessage.deleteMany({});
    const deleteChatSessions = await prisma.chatSession.deleteMany({});
    const deleteUser = await prisma.user.deleteMany({});
    console.log("Deleted users:", deleteUser.count);
    console.log("Deleted chat sessions:", deleteChatSessions.count);
    console.log("Deleted chat messages:", deleteChatMessages.count);
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
    const newChatSessionwithLongMessages = await prisma.chatSession.create({
        data: {
            title: "Long Messages Example",
            userId: user.id,
            messages: {
                create: [
                    {
                        role: "USER",
                        content: "Can you provide a detailed report on the sales performance over the last quarter?",
                    },
                    {
                        role: "ASSISTANT",
                        content: "Sure! Here’s a detailed report:\n\n**Sales Performance Report**\n\n- **January**: $30,000\n- **February**: $25,000\n- **March**: $28,000\n\n**Key Insights**:\n- The highest sales were in January.\n- February saw a dip in sales.\n- March showed a recovery in sales.\n\nWould you like to see a breakdown by product?",
                    },
                    {
                        role: "USER",
                        content: "Yes, please provide a breakdown by product.",
                    },
                    {
                        role: "ASSISTANT",
                        content: "Here’s the breakdown by product:\n\n- **Product A**: $15,000\n- **Product B**: $10,000\n- **Product C**: $5,000\n\nLet me know if you need any further details!",
                    },
                    {
                        role: "USER",
                        content: "Can you provide a summary of the key trends?",
                    },
                    {
                        role: "ASSISTANT",
                        content: "Here are the key trends from the sales data:\n\n- **Overall Sales Growth**: 15% increase compared to the previous quarter.\n- **Top Performing Product**: Product A with $15,000 in sales.\n- **Lowest Performing Product**: Product C with $5,000 in sales.\n\nLet me know if you need more details!",
                    },
                    {
                        role: "USER",
                        content: "Can you provide a summary of the key trends?",
                    },
                    {
                        role: "ASSISTANT",
                        content: "Here are the key trends from the sales data:\n\n- **Overall Sales Growth**: 15% increase compared to the previous quarter.\n- **Top Performing Product**: Product A with $15,000 in sales.\n- **Lowest Performing Product**: Product C with $5,000 in sales.\n\nLet me know if you need more details!",
                    }, {
                        role: "USER",
                        content: "Can you provide a summary of the key trends?",
                    }, {
                        role: "USER",
                        content: "What is your name?    ",
                    }, {
                        role: "ASSISTANT",
                        content: "My name is ChatGPT. How can I assist you today?",
                    }, {
                        role: "USER",
                        content: "What can you do?",
                    }, {
                        role: "ASSISTANT",
                        content: "I can assist you with a variety of tasks, including answering questions, providing information, and helping with problem-solving. How can I help you today?",
                    }, {
                        role: "USER",
                        content: "Can you help me with a coding problem?",
                    }, {
                        role: "ASSISTANT",
                        content: "Of course! Please describe the problem you're facing.",
                    }, {
                        role: "USER",
                        content: "I'm getting an error when I try to run my code.",
                    }, {
                        role: "ASSISTANT",
                        content: "I'm here to help! What error message are you seeing?",
                    }, {
                        role: "USER",
                        content: "I'm seeing a syntax error on line 10.",
                    }, {
                        role: "ASSISTANT",
                        content: "Syntax errors can be tricky! Can you show me the code around that line?",
                    }, {
                        role: "USER",
                        content: "Sure, here's the code:\n\n```javascript\nfunction test() {\n    console.log('Hello, world!');\n}\n```",
                    }, {
                        role: "ASSISTANT",
                        content: "Thanks for sharing! The code looks fine to me. Can you tell me more about the error you're encountering?",
                    }, {
                        role: "USER",
                        content: "The error message says 'Unexpected token' on line 10.",
                    }, {
                        role: "ASSISTANT",
                        content: "Got it! 'Unexpected token' errors usually indicate a syntax issue. Can you check for any missing commas or brackets in your code?",
                    }, {
                        role: "USER",
                        content: "I've checked and everything seems fine.",
                    }, {
                        role: "ASSISTANT",
                        content: "In that case, can you try running the code again and let me know if the error persists?",
                    }, {
                        role: "USER",
                        content: "Okay, I'll give it another try."
                    }, {
                        role: "ASSISTANT",
                        content: "Great! Let me know how it goes."
                    }],
            },
        },
    });
    console.log("Seeded Chat Session with messages:", chatSession.id);
    console.log("Seeded Chat Session with long messages:", newChatSessionwithLongMessages.id);
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
