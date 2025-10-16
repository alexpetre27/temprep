import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, amount, category, type, date } = body;

    const newTransaction = await prisma.transaction.create({
      data: {
        title: title,
        amount: amount,

        category: category,
        type: type,
        date: new Date(date),
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Eroare la crearea tranzacției:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "asc" },
    });

    const chartData = transactions.map((t) => ({
      date: t.date.toISOString().split("T")[0],
      amount: t.type === TransactionType.INCOME ? t.amount : -t.amount,
      category: t.category,
    }));

    return NextResponse.json(chartData, { status: 200 });
  } catch (error) {
    console.error("Eroare la preluarea tranzacțiilor:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
