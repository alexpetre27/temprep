"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ChartPieLabel } from "@/components/charts/ChartPie";
import { AddTransactionDialog } from "@/components/dialogs/AddTransactionDialog";

// NOU: Interfață pentru obiectul Category
interface Category {
  id: number;
  name: string; // sau alt câmp relevant
}

// CORECTAT: Interfață pentru TransactionData
interface TransactionData {
  id: string; // Presupunând că ID-ul este string sau number
  title: string;
  amount: number;
  category: Category; // << Acum este obiect
  type: "INCOME" | "EXPENSE";
  date: string;
}

export default function Page() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error("Eroare la preluarea tranzacțiilor.");
      }
      const data: TransactionData[] = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Eroare la fetch:", error);
      toast.error("Eroare la încărcarea datelor. Verifică serverul.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (rawData: any) => {
    // CORECȚIE AICI: Eliminăm conversia incorectă a categoriei.
    // Presupunem că rawData conține acum 'categoryId', 'amount', 'title', 'type', etc.
    const formattedData = {
      ...rawData,
      // Ne asigurăm că tipul este în formatul ENUM cerut de Prisma (dacă este cazul)
      type: (rawData.type as string).toUpperCase(),
      date: rawData.date.toISOString(),
      // 'categoryId' va fi trimis direct (ca string numeric)
    };

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Salvarea a eșuat pe server.");
      }

      const newTransaction: TransactionData = await response.json();

      // CORECTAT: Folosim `newTransaction` care ar trebui să fie conform interfeței.
      setTransactions((prev) => [newTransaction, ...prev]);
      toast.success("Tranzacție adăugată cu succes!");
    } catch (error) {
      console.error("Eroare la salvarea tranzacției:", error);
      toast.error(
        `Eroare: ${
          error instanceof Error ? error.message : "A apărut o problemă."
        }`
      );
    }
  };

  // CORECȚIE AICI: Extragem numele categoriei din obiectul category.
  const getChartData = (txns: TransactionData[]) => {
    const categoryTotals = txns.reduce((acc, t) => {
      if (t.type === "EXPENSE") {
        // ACCESĂM t.category.name în loc de t.category
        const categoryName = t.category.name;
        acc[categoryName] = (acc[categoryName] || 0) + t.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  };

  const pieChartData = getChartData(transactions);

  return (
    <div className="pr-8 pl-8 w-full">
      {isLoading ? (
        <div className="text-center py-10">Încărcare...</div>
      ) : (
        <ChartPieLabel data={pieChartData} />
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        {/* Funcția de callback trimite datele direct la handleAddTransaction */}
        <AddTransactionDialog onAdd={handleAddTransaction} />
        <Button variant="outline">Remove Data</Button>
        <Button variant="outline">Modify Data</Button>
      </div>
      <Toaster />
    </div>
  );
}
