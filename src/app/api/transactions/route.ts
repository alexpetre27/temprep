// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType, TransactionCategory } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Deconstruiește și validează datele primite (FOARTE IMPORTANT)
    const { title, amount, category, type, date } = body;

    // Convertește tipurile la formatele așteptate de Prisma:
    // 1. Amount: Numar (Float)
    // 2. Type & Category: ENUM (Uppercase)
    // 3. Date: Obiect Date valid (ISO String)

    const newTransaction = await prisma.transaction.create({
      data: {
        title: title,
        amount: amount, // Deja number din frontend
        // Folosim direct tipurile ENUM din Prisma Client
        category: category as TransactionCategory,
        type: type as TransactionType,
        date: new Date(date), // Creează un obiect Date din ISO string
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
      orderBy: { date: "asc" }, // Sortează după dată
    });

    // **********************************************
    // Etapa de Formatare pentru Chart
    // **********************************************

    // Aici implementezi logica de grupare a datelor (ex: pe zi/lună)
    const chartData = transactions.map((t) => ({
      date: t.date.toISOString().split("T")[0], // Ex: "2025-10-13"
      amount: t.type === TransactionType.INCOME ? t.amount : -t.amount, // Negativ pentru cheltuieli
      category: t.category,
    }));

    // În funcție de tipul de chart (ex: BarChart, LineChart),
    // poate fi necesară o grupare mai complexă (ex: total pe lună/categorie)

    return NextResponse.json(chartData, { status: 200 });
  } catch (error) {
    console.error("Eroare la preluarea tranzacțiilor:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
