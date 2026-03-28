import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_PERMISSIONS } from "@/types";
import type { UserRole } from "@/types";

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  CreditCard,
  FileText,
  BarChart3,
  LogOut,
  ChevronLeft,
  Menu,
  Package,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

const allNavItems: { path: string; label: string; icon: LucideIcon }[] = [
  { path: "/dashboard",       label: "Dashboard",       icon: LayoutDashboard },
  { path: "/vendors",         label: "Vendors",          icon: Users           },
  { path: "/orders",          label: "Purchase Orders",  icon: ShoppingCart    },
  { path: "/payments",        label: "Payments",         icon: CreditCard      },
  { path: "/documents",       label: "Documents",        icon: FileText        },
  { path: "/performance",     label: "Performance",      icon: BarChart3       },
  // ✅ NEW: Create Account — shown only to ADMIN (controlled via allowedRoutes in types.ts)
  { path: "/create-account",  label: "Create Account",   icon: UserPlus        },
  { path: "/catalog",         label: "My Catalog",       icon: Package         },
];

const W_OPEN      = 248;
const W_COLLAPSED = 64;

export default function Sidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const role = (user?.role || "ADMIN") as UserRole;
  const perms = ROLE_PERMISSIONS[role];
  const navItems = allNavItems.filter((item) =>
    perms.allowedRoutes.some((r) => item.path.startsWith(r))
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-current-w",
      `${collapsed ? W_COLLAPSED : W_OPEN}px`
    );
  }, [collapsed]);

  const w = collapsed ? W_COLLAPSED : W_OPEN;

  return (
    <aside
      style={{
        width: w,
        transition: "width 0.2s cubic-bezier(0.16,1,0.3,1)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--white)",
        borderRight: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          height: "var(--topbar-h)",
          padding: collapsed ? "0 12px" : "0 16px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
     {!collapsed && (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    {/* Logo mark */}
    <svg viewBox="0 0 40 46" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,2 38,12 38,34 20,44 2,34 2,12" fill="#1a1510" />
      <path d="M11 16 L20 32 L29 16" stroke="#c8a96e" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span className="serif" style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>
        VMS
      </span>
      <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>
        Vendor Portal
      </span>
    </div>
  </div>
)}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--muted)",
            cursor: "pointer",
            flexShrink: 0,
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent-dim)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          {collapsed ? <Menu size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto", overflowX: "hidden" }}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                margin: "1px 8px",
                padding: collapsed ? "10px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--ink)" : "var(--muted)",
                background: isActive ? "var(--accent-dim2)" : "transparent",
                textDecoration: "none",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--accent-dim)";
                  e.currentTarget.style.color = "var(--ink-2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--muted)";
                }
              }}
            >
              {isActive && !collapsed && (
                <span
                  style={{
                    position: "absolute",
                    left: 8,
                    width: 3,
                    height: 20,
                    borderRadius: 2,
                    background: "var(--accent)",
                  }}
                />
              )}
              <item.icon size={17} style={{ flexShrink: 0, color: isActive ? "var(--accent)" : "inherit" }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer: user info + logout */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "12px 8px", flexShrink: 0 }}>
        {!collapsed && user && (
          <div
            style={{
              padding: "8px 10px 10px",
              marginBottom: 4,
              borderRadius: 8,
              background: "var(--cream-2)",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}
              >
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.name}
                </p>
                <p style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.email}
                </p>
              </div>
            </div>
            <span
              style={{
                display: "inline-block", marginTop: 6,
                padding: "2px 7px", fontSize: 9, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                borderRadius: 4, background: "var(--accent-dim2)",
                color: "var(--accent)", border: "1px solid var(--accent-border)",
              }}
            >
              {perms.label}
            </span>
          </div>
        )}

        <button
          onClick={logout}
          title="Sign out"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 8, width: "100%",
            padding: collapsed ? "10px 0" : "9px 12px",
            borderRadius: 8, border: "1px solid transparent",
            background: "transparent", color: "var(--muted)",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
            transition: "background 0.15s, color 0.15s, border-color 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.background = "var(--red-bg)";
            btn.style.color = "var(--red)";
            btn.style.borderColor = "var(--red-border)";
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.background = "transparent";
            btn.style.color = "var(--muted)";
            btn.style.borderColor = "transparent";
          }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}