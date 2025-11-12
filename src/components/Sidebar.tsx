import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Settings,
  Menu,
  X,
  FileText,
  Store,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/inventario", icon: Package, label: "Inventario" },
  { to: "/fiados", icon: Receipt, label: "Fiados" },
  { to: "/pos", icon: ShoppingCart, label: "Punto de Venta" },
  { to: "/reportes", icon: TrendingUp, label: "Reportes" },
  { to: "/equipo", icon: Users, label: "Vendedores" },
  { to: "/proveedores", icon: Store, label: "Proveedores" },
  { to: "/configuracion", icon: Settings, label: "Configuración" },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente"
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-md"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-60 bg-card shadow-lg transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Bodegia
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Gestión Inteligente</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-3">
            {user && (
              <div className="px-3 py-2 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Sesión activa</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
              </div>
            )}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              © 2025 Bodegia
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
