import { useAuth } from "@/hooks/useAuth";
import { ROLE_PERMISSIONS } from "@/types";
import type { UserRole } from "@/types";
import { LogOut } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { user, logout } = useAuth();
  const role = user?.role as UserRole | undefined;
  const roleLabel = role ? ROLE_PERMISSIONS[role]?.label || role : "";

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "0 28px 0 32px",
      }}
    >
      {/* Page title */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--accent)",
            fontWeight: 700,
          }}
        >
          {title.toLowerCase().replace(/\s+/g, "·")}
        </span>
        <h1
          className="serif"
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
            color: "var(--ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {/* {title} */}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)", marginTop: 2 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side: user info + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        {/* Avatar + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingRight: 12,
            borderRight: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
              fontFamily: "var(--font-playfair, serif)",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>
              {user?.name}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              {roleLabel}
            </span>
          </div>
        </div>

       
      </div>
    </header>
  );
}