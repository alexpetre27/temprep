"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

interface FormData {
  title: string;
  amount: number;
  category: string;
  date: Date | undefined;
  note?: string;
  type: string;
}

export function AddTransactionDialog({
  onAdd,
}: {
  // onAdd primește datele NOI returnate de server
  onAdd?: (data: any) => void;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 🚨 LOGICA RESTABILITĂ: Salvarea către API
  const handleSaveToApi = async (data: FormData) => {
    const formattedData = {
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: data.date ? data.date.toISOString() : new Date().toISOString(),
      type: data.type.toUpperCase(),
      note: data.note || null,
    };

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Salvarea tranzacției a eșuat!");
      }

      // Preia tranzacția salvată (cu ID, categorie completă, etc.)
      const savedTransaction = await response.json();

      if (onAdd) {
        // Trimite tranzacția COMPLETA înapoi la mainpage.tsx
        onAdd(savedTransaction);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Eroare la salvare:", error);
      alert(
        `Eroare la adăugarea tranzacției: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const formTitle = formData.get("title") as string;
    const formAmount = formData.get("amount") as string;
    const formCategory = formData.get("category") as string;
    const formType = formData.get("type") as string;
    const formNote = formData.get("note") as string | undefined;

    if (
      !formTitle ||
      !formAmount ||
      !formCategory ||
      !formType ||
      isNaN(parseFloat(formAmount))
    ) {
      alert(
        "Vă rugăm completați toate câmpurile obligatorii (Titlu, Sumă, Categorie, Tip)."
      );
      return;
    }

    const data: FormData = {
      title: formTitle,
      amount: parseFloat(formAmount),
      category: formCategory,
      date,
      type: formType,
      note: formNote,
    };
    handleSaveToApi(data);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-auto sm:w-[150px]">
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent
        className="
          fixed top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2
          sm:max-w-[425px] w-[90%] sm:w-auto bg-background
          rounded-lg border shadow-xl p-6
        "
      >
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the transaction details below and click save to add it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Grocery shopping"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="e.g. 120.50"
              min="0"
              inputMode="decimal"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Food</SelectItem>
                <SelectItem value="2">Transport</SelectItem>
                <SelectItem value="3">Bills</SelectItem>
                <SelectItem value="4">Entertainment</SelectItem>
                <SelectItem value="5">Salary</SelectItem>
                <SelectItem value="6">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select name="type" defaultValue="expense">
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: ro })
                  ) : (
                    <span>Alege o dată</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Input id="note" name="note" placeholder="e.g. Cash payment" />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
