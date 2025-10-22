import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CreditCard,
  Package,
  ShoppingCart,
  Crown
} from "lucide-react";

const Dashboard = () => {
  const suggestions = [
    { text: "Aumentar stock de Inca Kola 1.5L - Se está agotando", priority: "Alta" },
    { text: "Recordar a Juan Pérez su deuda de S/. 45.00", priority: "Media" },
    { text: "Revisar productos próximos a vencer (5 items)", priority: "Media" },
    { text: "Promocionar galletas Sublime - Bajo movimiento", priority: "Baja" },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Resumen de tu bodega en tiempo real</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Venta Hoy"
            value="S/. 1,245.00"
            icon={<DollarSign className="h-6 w-6" />}
            trend={{ value: "+12.5%", isPositive: true }}
          />
          <KPICard
            title="Ganancia Hoy"
            value="S/. 387.50"
            icon={<TrendingUp className="h-6 w-6" />}
            trend={{ value: "+8.3%", isPositive: true }}
          />
          <KPICard
            title="Deuda Total"
            value="S/. 2,340.00"
            icon={<CreditCard className="h-6 w-6" />}
            trend={{ value: "-5.2%", isPositive: true }}
          />
          <KPICard
            title="Alertas"
            value="8"
            icon={<AlertCircle className="h-6 w-6" />}
          />
        </div>

        {/* El Consejero */}
        <Card className="p-6 shadow-md border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary-light/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">El Consejero</h2>
              <p className="text-sm text-muted-foreground">Sugerencias inteligentes para tu negocio</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm">{suggestion.text}</p>
                </div>
                <Badge 
                  variant={
                    suggestion.priority === "Alta" ? "destructive" :
                    suggestion.priority === "Media" ? "secondary" :
                    "outline"
                  }
                  className="shrink-0"
                >
                  {suggestion.priority}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Ventas últimos 7 días</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {[120, 145, 98, 156, 187, 165, 203].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary-light"
                    style={{ height: `${(value / 203) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["L", "M", "M", "J", "V", "S", "D"][index]}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Top 5 Productos</h3>
            <div className="space-y-3">
              {[
                { name: "Inca Kola 1.5L", sales: 45, color: "bg-primary" },
                { name: "Pan Bimbo Blanco", sales: 38, color: "bg-primary-light" },
                { name: "Leche Gloria", sales: 32, color: "bg-secondary" },
                { name: "Arroz Superior 1kg", sales: 28, color: "bg-accent" },
                { name: "Aceite Primor", sales: 24, color: "bg-success" },
              ].map((product, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">{product.sales} ventas</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`${product.color} h-2 rounded-full transition-all`}
                      style={{ width: `${(product.sales / 45) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto py-4 flex-col gap-2">
              <ShoppingCart className="h-6 w-6" />
              <span>Nueva Venta</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Package className="h-6 w-6" />
              <span>Agregar Producto</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <CreditCard className="h-6 w-6" />
              <span>Registrar Pago</span>
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
