"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Category {
  id: string;
  name: string;
  color?: string;
}
interface TransactionData {
  id: string;
  title: string;
  amount: number;
  date: string;
  note?: string | null;
  category: Category;
  type: "INCOME" | "EXPENSE";
}

interface TransactionListProps {
  transactions: TransactionData[];
  currentQuery: string;
  currentCategory: string;
}

export default function TransactionList({
  transactions = [],
  currentQuery,
  currentCategory,
}: TransactionListProps) {
  const filteredTransactions = transactions.filter((tx) => {
    const matchesQuery = tx.title
      .toLowerCase()
      .includes(currentQuery.toLowerCase());

    // Asigură-te că tx.category există înainte de a accesa .name
    const categoryNameLower = tx.category?.name?.toLowerCase() || "";

    const matchesCategory =
      currentCategory.toLowerCase() === "all" ||
      categoryNameLower === currentCategory.toLowerCase();

    return matchesQuery && matchesCategory;
  });

  if (!filteredTransactions.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Nu au fost găsite tranzacții care să corespundă criteriilor de căutare.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {filteredTransactions.map((tx) => (
        <Card
          key={tx.id}
          className="border border-border hover:shadow-md transition-all duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">{tx.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant={tx.type === "INCOME" ? "default" : "secondary"}
                className={
                  tx.type === "INCOME"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }
              >
                {tx.type === "INCOME" ? "Venit" : "Cheltuială"}
              </Badge>
              <Badge
                style={{
                  backgroundColor: tx.category?.color || "hsl(var(--accent))",
                }}
                className="text-white"
              >
                {tx.category?.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>
              <span className="font-medium text-foreground">Sumă:</span>{" "}
              <span
                className={
                  tx.type === "INCOME" ? "text-green-600" : "text-red-500"
                }
              >
                {tx.amount.toFixed(2)} lei
              </span>
            </p>
            <p>
              <span className="font-medium text-foreground">Dată:</span>{" "}
              {new Date(tx.date).toLocaleDateString("ro-RO")}
            </p>
            {tx.note && (
              <>
                <Separator className="my-2" />
                <p className="italic">{tx.note}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
