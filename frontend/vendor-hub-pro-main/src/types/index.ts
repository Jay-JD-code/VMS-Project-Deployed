// Types matching backend DTOs

export type VendorStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface Vendor {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  status: VendorStatus;
  createdAt?: string;
}

export interface VendorRequest {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export type OrderStatus =
  | "CREATED"
  | "APPROVED"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  vendorId: string;
  vendorName?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderRequest {
  vendorId: string;
  items: OrderItem[];
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Payment {
  id: number;
  orderId: number;
  vendorId?: string;
  vendorName?: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface PaymentRequest {
  orderId: number;
  amount: number;
  method: string;
}

export interface DocumentEntity {
  id: number;
  vendorId: string;
  vendorName?: string;
  documentType: string;
  fileName: string;
  filePath: string;
  uploadedAt: string;
}

export interface PerformanceReview {
  id: number;
  vendorId: string;
  vendorName?: string;
  deliveryScore: number;
  qualityScore: number;
  complianceScore: number;
  overallScore: number;
  calculatedAt: string;
}

export interface DashboardStats {
  totalVendors: number;
  activeVendors: number;
  pendingApprovals: number;
  totalOrders: number;
  pendingPayments: number;
  totalPaymentsAmount: number;
}

export type UserRole = "ADMIN" | "VENDOR" | "PROCUREMENT" | "FINANCE";

export interface VendorItem {
  id: string;
  vendorId: string;
  name: string;
  description?: string;
  unit?: string;
  unitPrice: number;
  available: boolean;
  createdAt?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  firstLogin: boolean;
}

export interface DashboardResponse {
  stats: {
    vendors: number;
    orders: number;
    payments: number;
    performance: number;
  };
  vendorStatus: { status: string; value: number }[];
  paymentStatus: { status: string; value: number }[];
  ordersTrend:   { month: string; orders: number }[];
}

export const ROLE_PERMISSIONS: Record<
  UserRole,
  {
    label: string;
    allowedRoutes: string[];
    defaultRoute: string;
    canApproveVendors: boolean;
    canProcessPayments: boolean;
    canManageVendors: boolean;
    canViewAllData: boolean;
  }
> = {
  ADMIN: {
    label: "Administrator",
    allowedRoutes: [
      "/dashboard",
      "/vendors",
      "/orders",
      "/payments",
      "/documents",
      "/performance",
      "/create-account", // ✅ ADMIN only
    ],
    defaultRoute: "/dashboard",
    canApproveVendors:  true,
    canProcessPayments: true,
    canManageVendors:   true,
    canViewAllData:     true,
  },

  VENDOR: {
    label: "Vendor",
    allowedRoutes: [
      "/dashboard",
      "/orders",
      "/payments",
      "/documents",
      "/performance",
      "/catalog",
    ],
    defaultRoute: "/dashboard",
    canApproveVendors:  false,
    canProcessPayments: false,
    canManageVendors:   false,
    canViewAllData:     false,
  },

  PROCUREMENT: {
    label: "Procurement",
    allowedRoutes: [
      "/dashboard",
      "/vendors",
      "/orders",
      "/payments",
      "/documents",
      "/performance",
    ],
    defaultRoute: "/dashboard",
    canApproveVendors:  false,
    canProcessPayments: false,
    canManageVendors:   true,
    canViewAllData:     true,
  },

  FINANCE: {
    label: "Finance",
    allowedRoutes: [
      "/dashboard",
      "/vendors",
      "/orders",
      "/payments",
      "/documents",
    ],
    defaultRoute: "/dashboard",
    canApproveVendors:  false,
    canProcessPayments: true,
    canManageVendors:   false,
    canViewAllData:     true,
  },
};