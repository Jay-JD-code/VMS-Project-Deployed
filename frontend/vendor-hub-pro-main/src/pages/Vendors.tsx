import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import StatusBadge from "@/components/StatusBadge";
import { vendorApi } from "@/lib/api";
import { mockVendors } from "@/lib/mock-data";
import type { VendorStatus, VendorRequest } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Search, Filter, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyForm: VendorRequest = { companyName: "", contactPerson: "", email: "", phone: "", address: "" };

export default function Vendors() {
  const { canApproveVendors, canManageVendors } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VendorStatus | "ALL">("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<VendorRequest>({ ...emptyForm });
  // ✅ Track which vendor is pending delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data: vendors = mockVendors, isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: vendorApi.getAll,
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: (data: VendorRequest) => vendorApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor registered successfully");
      setShowAddForm(false);
      setForm({ ...emptyForm });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to register vendor"),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => vendorApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor approved");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to approve vendor"),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => vendorApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor rejected");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to reject vendor"),
  });

  // ✅ Delete mutation — only for REJECTED vendors, only for ADMIN
  const deleteMutation = useMutation({
    mutationFn: (id: string) => vendorApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor deleted");
      setConfirmDeleteId(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete vendor");
      setConfirmDeleteId(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim()) { toast.error("Company name is required"); return; }
    createMutation.mutate(form);
  };

  const filtered = vendors.filter((v) => {
    const matchSearch =
      v.companyName.toLowerCase().includes(search.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AppLayout title="Vendor Management" subtitle="Manage and monitor vendor relationships">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-9 pr-3 text-xs bg-card border border-input rounded-md w-56 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter size={14} className="text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as VendorStatus | "ALL")}
              className="h-8 px-2 text-xs bg-card border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="ALL">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
        {canManageVendors && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 h-8 px-3 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            Add Vendor
          </button>
        )}
      </div>

      {/* Add Vendor Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-md p-4 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Register New Vendor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Company Name *</label>
              <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full h-8 px-3 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Contact Person</label>
              <input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} className="w-full h-8 px-3 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-8 px-3 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-8 px-3 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1">Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full h-8 px-3 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button type="submit" disabled={createMutation.isPending} className="h-8 px-4 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:opacity-90 disabled:opacity-50">
              {createMutation.isPending ? "Submitting..." : "Submit"}
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="h-8 px-4 bg-muted text-muted-foreground text-xs font-medium rounded-md hover:bg-muted/80">Cancel</button>
          </div>
        </form>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 size={18} className="animate-spin mr-2" /> Loading vendors...
        </div>
      )}

      {!isLoading && (
        <div className="bg-card border border-border rounded-md overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="font-medium text-foreground">{vendor.companyName}</td>
                  <td>{vendor.contactPerson}</td>
                  <td className="text-muted-foreground">{vendor.email}</td>
                  <td className="text-muted-foreground">{vendor.phone}</td>
                  <td><StatusBadge status={vendor.status} /></td>
                  <td className="text-muted-foreground">{vendor.createdAt}</td>
                  <td>
                    <div className="flex items-center gap-2">

                      {/* PENDING — Approve + Reject */}
                      {vendor.status === "PENDING" && canApproveVendors && (
                        <>
                          <button
                            onClick={() => approveMutation.mutate(vendor.id)}
                            disabled={approveMutation.isPending}
                            className="text-xs text-primary font-medium hover:underline disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectMutation.mutate(vendor.id)}
                            disabled={rejectMutation.isPending}
                            className="text-xs text-destructive font-medium hover:underline disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* ✅ REJECTED — Delete button (admin only, with confirmation) */}
                      {vendor.status === "REJECTED" && canApproveVendors && (
                        confirmDeleteId === vendor.id ? (
                          // Inline confirmation — prevents accidental deletes
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">Sure?</span>
                            <button
                              onClick={() => deleteMutation.mutate(vendor.id)}
                              disabled={deleteMutation.isPending}
                              className="text-xs text-destructive font-medium hover:underline disabled:opacity-50"
                            >
                              {deleteMutation.isPending ? "Deleting..." : "Yes, delete"}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-xs text-muted-foreground hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(vendor.id)}
                            className="flex items-center gap-1 text-xs text-destructive font-medium hover:underline"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        )
                      )}

                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted-foreground py-8">
                    No vendors found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {vendors.length} vendors
        </p>
      </div>
    </AppLayout>
  );
}