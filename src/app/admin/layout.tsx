import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import {
  LayoutDashboard,
  ShoppingBag,
  ListChecks,
  Package,
  MessageSquareHeart,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: ListChecks },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquareHeart },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/account");

  return (
    <div className="min-h-screen bg-[#F5F1EC] flex">
      {/* ---- Sidebar ---- */}
      <aside className="w-64 bg-[#2B2320] text-[#FBF6F2] flex flex-col fixed h-screen">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-display text-xl text-[#C9A25D]">Guzel Meraki</p>
          <p className="text-xs text-[#FBF6F2]/40 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#FBF6F2]/70 hover:bg-white/5 hover:text-[#FBF6F2] transition-colors"
            >
              <Icon size={18} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-white/10">
          <p className="text-sm px-4 mb-3">{user.email}</p>
          <a
            href="/api/auth/logout"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#FBF6F2]/70 hover:bg-white/5 hover:text-[#FBF6F2] transition-colors"
          >
            <LogOut size={18} strokeWidth={1.5} /> Log out
          </a>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
