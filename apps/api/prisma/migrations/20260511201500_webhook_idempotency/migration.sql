-- CreateTable
CREATE TABLE "public"."StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "orderId" TEXT,
    "rawPayload" JSONB,
    "processedAt" TIMESTAMP(3),
    "processingError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeWebhookEvent_eventId_key" ON "public"."StripeWebhookEvent"("eventId");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_orderId_idx" ON "public"."StripeWebhookEvent"("orderId");

-- AddForeignKey
ALTER TABLE "public"."StripeWebhookEvent" ADD CONSTRAINT "StripeWebhookEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
