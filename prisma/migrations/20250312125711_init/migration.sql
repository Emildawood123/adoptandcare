-- DropForeignKey
ALTER TABLE "VetConsultation" DROP CONSTRAINT "VetConsultation_petId_fkey";

-- AlterTable
ALTER TABLE "VetConsultation" ALTER COLUMN "petId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "VetConsultation" ADD CONSTRAINT "VetConsultation_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
