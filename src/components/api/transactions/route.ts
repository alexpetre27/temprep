import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { category: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("❌ Eroare la preluarea tranzacțiilor:", error);
    return NextResponse.json(
      { error: "Eroare la preluarea tranzacțiilor" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, amount, date, note, categoryId, type } = data;

    // ✅ Validări simple
    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Titlul este obligatoriu." },
        { status: 400 }
      );
    }
    if (isNaN(Number(amount))) {
      return NextResponse.json(
        { error: "Suma trebuie să fie un număr valid." },
        { status: 400 }
      );
    }
    if (!categoryId) {
      return NextResponse.json(
        { error: "Categoria este obligatorie." },
        { status: 400 }
      );
    }
    if (
      !type ||
      (type !== "INCOME" &&
        type !== "EXPENSE" &&
        type !== "income" &&
        type !== "expense")
    ) {
      return NextResponse.json(
        { error: "Tipul (INCOME/EXPENSE) este obligatoriu." },
        { status: 400 }
      );
    }

    // ✅ Creează tranzacția
    const newTransaction = await prisma.transaction.create({
      data: {
        title,
        amount: Number(amount),
        note: note ?? null,
        date: date ? new Date(date) : new Date(),
        type: type.toUpperCase() === "INCOME" ? "INCOME" : "EXPENSE",
        category: {
          connect: { id: Number(categoryId) },
        },
      },
      include: { category: true },
    });

    return NextResponse.json(newTransaction);
  } catch (error: any) {
    console.error("❌ Eroare la adăugarea tranzacției:", error);
    return NextResponse.json(
      { error: "Eroare la adăugarea tranzacției", details: error.message },
      { status: 500 }
    );
  }
}
