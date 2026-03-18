"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  LayoutDashboard,
  LogOut,
  Pencil,
  Trash2,
  Eye,
  Link,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

type Tab = "overview" | "products" | "orders" | "users";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStock: { _id: string; name: string; stock: number }[];
  recentOrders: any[];
  monthlyRevenue: {
    _id: { year: number; month: number };
    revenue: number;
    count: number;
  }[];
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const statusColor: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  confirmed: "bg-indigo-100 text-indigo-800",
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useStore();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(stored);
    if (!u.isAdmin) {
      router.push("/");
      return;
    }
    setAdminEmail(u.email);
    fetchStats();
  }, []);

  useEffect(() => {
    if (tab === "products") fetchProducts();
    else if (tab === "orders") fetchOrders();
    else if (tab === "users") fetchUsers();
  }, [tab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/products?limit=50`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/orders?limit=50`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/users?limit=50`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setUsers(data.users || []);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`${API_URL}/admin/orders/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    fetchProducts();
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`${API_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    fetchUsers();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
    router.push("/");
  };

  const maxRevenue = stats
    ? Math.max(...stats.monthlyRevenue.map((m) => m.revenue), 1)
    : 1;

  return (
    <div className="flex min-h-screen bg-background font-[family-name:var(--font-space-grotesk)]">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-col border-r border-border md:flex">
        <div className="border-b border-border px-6 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Admin Panel
          </p>
          <p className="mt-1 text-sm font-medium truncate">{adminEmail}</p>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {(["overview", "products", "orders", "users"] as Tab[]).map((t) => {
            const icons = {
              overview: LayoutDashboard,
              products: Package,
              orders: ShoppingBag,
              users: Users,
            };
            const Icon = icons[t];
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left capitalize ${
                  tab === t
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Mobile nav */}
        <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-3 md:hidden">
          {(["overview", "products", "orders", "users"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap px-3 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                tab === t
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-10">
          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold uppercase tracking-[0.15em]">
                  Overview
                </h1>
                <button
                  onClick={() => router.push(`/`)}
                  className="hover:underline hover:cursor-pointer font-bold uppercase tracking-[0.15em]"
                >
                  Back To Home
                
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-28 animate-pulse border border-border bg-secondary"
                    />
                  ))}
                </div>
              ) : stats ? (
                <>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                      {
                        label: "Total Revenue",
                        value: `$${stats.totalRevenue.toLocaleString()}`,
                        icon: TrendingUp,
                      },
                      {
                        label: "Total Orders",
                        value: stats.totalOrders,
                        icon: ShoppingBag,
                      },
                      {
                        label: "Products",
                        value: stats.totalProducts,
                        icon: Package,
                      },
                      { label: "Users", value: stats.totalUsers, icon: Users },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="border border-border p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                              {label}
                            </p>
                            <p className="mt-2 text-2xl font-bold">{value}</p>
                          </div>
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                      {
                        label: "Paid Orders",
                        value: stats.paidOrders,
                        icon: CheckCircle,
                        color: "text-green-600",
                      },
                      {
                        label: "Pending",
                        value: stats.pendingOrders,
                        icon: Clock,
                        color: "text-yellow-600",
                      },
                      {
                        label: "Low Stock",
                        value: stats.lowStock.length,
                        icon: AlertTriangle,
                        color: "text-red-600",
                      },
                      {
                        label: "Unpaid",
                        value: stats.totalOrders - stats.paidOrders,
                        icon: XCircle,
                        color: "text-muted-foreground",
                      },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div
                        key={label}
                        className="flex items-center gap-4 border border-border p-5"
                      >
                        <Icon className={`h-8 w-8 ${color}`} />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-[0.1em]">
                            {label}
                          </p>
                          <p className="text-xl font-bold">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {stats.monthlyRevenue.length > 0 && (
                    <div className="border border-border p-6">
                      <p className="mb-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Monthly Revenue
                      </p>
                      <div className="flex items-end gap-2 h-40">
                        {stats.monthlyRevenue.map((m) => (
                          <div
                            key={`${m._id.year}-${m._id.month}`}
                            className="flex flex-1 flex-col items-center gap-2"
                          >
                            <p className="text-xs text-muted-foreground">
                              ${(m.revenue / 1000).toFixed(1)}k
                            </p>
                            <div
                              className="w-full bg-foreground transition-all"
                              style={{
                                height: `${(m.revenue / maxRevenue) * 100}px`,
                                minHeight: "4px",
                              }}
                            />
                            <p className="text-xs text-muted-foreground">
                              {MONTHS[m._id.month - 1]}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="border border-border p-5">
                      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-500" />{" "}
                        Low Stock
                      </p>
                      {stats.lowStock.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          All products well stocked
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {stats.lowStock.map((p) => (
                            <div
                              key={p._id}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="truncate">{p.name}</span>
                              <span
                                className={`font-medium ${p.stock === 0 ? "text-red-600" : "text-yellow-600"}`}
                              >
                                {p.stock} left
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border border-border p-5">
                      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Recent Orders
                      </p>
                      <div className="flex flex-col gap-3">
                        {stats.recentOrders.slice(0, 5).map((o: any) => (
                          <div
                            key={o._id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div>
                              <p className="font-medium">
                                {o.user?.name || "—"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ${o.totalPrice.toLocaleString()}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${statusColor[o.status] || ""}`}
                            >
                              {o.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {tab === "products" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold uppercase tracking-[0.15em]">
                  Products
                </h1>
                <button
                  onClick={() => router.push("/admin/products/new")}
                  className="bg-foreground text-background px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors"
                >
                  + Add Product
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse border border-border bg-secondary"
                    />
                  ))}
                </div>
              ) : (
                <div className="border border-border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground hidden md:table-cell">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground hidden md:table-cell">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground hidden md:table-cell">
                          Status
                        </th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr
                          key={p._id}
                          className="border-b border-border last:border-0 hover:bg-secondary transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {p.images?.[0] && (
                                <img
                                  src={
                                    p.images[0].startsWith("http")
                                      ? p.images[0]
                                      : `http://localhost:5000${p.images[0]}`
                                  }
                                  alt={p.name}
                                  className="h-10 w-10 object-cover border border-border"
                                />
                              )}
                              <span className="font-medium truncate max-w-[140px]">
                                {p.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                            {p.category}
                          </td>
                          <td className="px-4 py-3">
                            ${p.price.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span
                              className={
                                p.stock < 10 ? "text-red-600 font-medium" : ""
                              }
                            >
                              {p.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${p.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {p.isActive ? "Active" : "Hidden"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() =>
                                  router.push(`/admin/products/${p._id}`)
                                }
                                className="p-1.5 hover:bg-secondary rounded transition-colors"
                              >
                                <Pencil className="h-4 w-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => deleteProduct(p._id)}
                                className="p-1.5 hover:bg-secondary rounded transition-colors"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === "orders" && (
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold uppercase tracking-[0.15em]">
                Orders
              </h1>

              {loading ? (
                <div className="flex flex-col gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 animate-pulse border border-border bg-secondary"
                    />
                  ))}
                </div>
              ) : (
                <div className="border border-border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground hidden md:table-cell">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground hidden md:table-cell">
                          Payment
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground hidden md:table-cell">
                          Date
                        </th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr
                          key={o._id}
                          className="border-b border-border last:border-0 hover:bg-secondary transition-colors"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium">{o.user?.name || "—"}</p>
                            <p className="text-xs text-muted-foreground">
                              {o.user?.email || ""}
                            </p>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            ${o.totalPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={o.status}
                              onChange={(e) =>
                                updateOrderStatus(o._id, e.target.value)
                              }
                              className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${statusColor[o.status] || ""}`}
                            >
                              {[
                                "new",
                                "confirmed",
                                "processing",
                                "shipped",
                                "delivered",
                                "cancelled",
                              ].map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${paymentColor[o.paymentStatus] || ""}`}
                            >
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                router.push(`/admin/orders/${o._id}`)
                              }
                              className="p-1.5 hover:bg-secondary rounded transition-colors"
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── USERS ── */}
          {tab === "users" && (
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold uppercase tracking-[0.15em]">
                Users
              </h1>

              {loading ? (
                <div className="flex flex-col gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse border border-border bg-secondary"
                    />
                  ))}
                </div>
              ) : (
                <div className="border border-border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground hidden md:table-cell">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] text-muted-foreground hidden md:table-cell">
                          Joined
                        </th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr
                          key={u._id}
                          className="border-b border-border last:border-0 hover:bg-secondary transition-colors"
                        >
                          <td className="px-4 py-3 font-medium">{u.name}</td>
                          <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                            {u.email}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${u.isAdmin ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}
                            >
                              {u.isAdmin ? "Admin" : "User"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            {!u.isAdmin && (
                              <button
                                onClick={() => deleteUser(u._id)}
                                className="p-1.5 hover:bg-secondary rounded transition-colors"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
