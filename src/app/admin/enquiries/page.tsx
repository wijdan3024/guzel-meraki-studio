import { prisma } from "@/lib/prisma";
import AdminEnquiriesClient from "./AdminEnquiriesClient";

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.eventEnquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = enquiries.map((e) => ({
    ...e,
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,
    createdAt: e.createdAt.toISOString(),
  }));

  return <AdminEnquiriesClient enquiries={serialized} />;
}
