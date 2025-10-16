/*
  Warnings:

  - The values [income,expense] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `category` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('FOOD', 'TRANSPORT', 'BILLS', 'ENTERTAINMENT', 'SALARY', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('INCOME', 'EXPENSE');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "public"."TransactionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "category",
ADD COLUMN     "category" "TransactionCategory" NOT NULL;
