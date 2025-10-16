"use client";

import { CategorySearch } from "@/components/ui/CategorySearch";
import TransactionList from "@/components/ui/TransactionList";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  color?: string;
}
interface TransactionData {
  id: string;
  title: string;
  amount: number;
  category: Category;
  type: "INCOME" | "EXPENSE";
  date: string;
}

interface TransactionBarProps {
  transactions: TransactionData[];
}

export default function TransactionSearchBar({
  transactions,
}: TransactionBarProps) {
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");

  const handleSearch = (term: string, category: string) => {
    setCurrentQuery(term);
    setCurrentCategory(category);
  };

  return (
    <div className="p-0">
      <CategorySearch onSearch={handleSearch} />

      <div className="mt-4 p-4 border rounded-md bg-secondary/20">
        <p className="text-sm">Rezultate afișate pentru:</p>
        <p className="font-medium mt-1">
          Căutare: **"{currentQuery || "toate"}"** | Filtru: **{currentCategory}
          **
        </p>
      </div>

      <TransactionList
        transactions={transactions}
        currentQuery={currentQuery}
        currentCategory={currentCategory}
      />
    </div>
  );
}
