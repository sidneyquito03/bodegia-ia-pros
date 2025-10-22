import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreditCard, Users, TrendingDown } from "lucide-react";

const Fiados = () => {
  const clientes = [
    { id: 1, nombre: "Juan Pérez", iniciales: "JP", deuda: 45.00, transacciones: 3 },
    { id: 2, nombre: "María García", iniciales: "MG", deuda: 127.50, transacciones: 8 },
    { id: 3, nombre: "Carlos López", iniciales: "CL", deuda: 89.00, transacciones: 5 },
    { id: 4, nombre: "Ana Rodríguez", iniciales: "AR", deuda: 234.00, transacciones: 12 },
    { id: 5, nombre: "Pedro Sánchez", iniciales: "PS", deuda: 56.50, transacciones: 4 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Gestión de Fiados</h1>
          <p className="text-muted-foreground mt-1">Control de créditos a clientes</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard
            title="Deuda Total"
            value="S/. 2,340.00"
            icon={<CreditCard className="h-6 w-6" />}
          />
          <KPICard
            title="Clientes con Deuda"
            value="18"
            icon={<Users className="h-6 w-6" />}
          />
          <KPICard
            title="Promedio por Cliente"
            value="S/. 130.00"
            icon={<TrendingDown className="h-6 w-6" />}
          />
        </div>

        {/* Clientes con Deuda */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Clientes con Deuda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientes.map((cliente) => (
              <Card key={cliente.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 bg-primary text-primary-foreground">
                    <AvatarFallback>{cliente.iniciales}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{cliente.nombre}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cliente.transacciones} transacciones
                    </p>
                    <p className="text-2xl font-bold text-destructive mt-2">
                      S/. {cliente.deuda.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-4" size="sm">
                  Ver Detalle
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Fiados;
