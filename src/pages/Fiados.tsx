import { useState } from "react";
import { Layout } from "@/components/Layout";
import { KPICard } from "@/components/KPICard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { PagoModal } from "@/components/modals/PagoModal";
import { CreditCard, Users, TrendingDown } from "lucide-react";
import { useFiados } from "@/hooks/useFiados";

const Fiados = () => {
  const { clientes, loading, registrarPago } = useFiados();
  const [pagoModalOpen, setPagoModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);

  const deudaTotal = clientes.reduce((sum, c) => sum + c.deuda_total, 0);
  const clientesConDeuda = clientes.filter(c => c.deuda_total > 0).length;
  const promedioDeuda = clientesConDeuda > 0 ? deudaTotal / clientesConDeuda : 0;

  const handleRegistrarPago = (monto: number, descripcion: string) => {
    if (selectedCliente) {
      registrarPago(selectedCliente.id, monto, descripcion);
      setSelectedCliente(null);
    }
  };

  const getIniciales = (nombre: string) => {
    const parts = nombre.split(' ');
    return parts.length >= 2 
      ? `${parts[0][0]}${parts[1][0]}`
      : nombre.slice(0, 2).toUpperCase();
  };

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
            value={`S/. ${deudaTotal.toFixed(2)}`}
            icon={<CreditCard className="h-6 w-6" />}
          />
          <KPICard
            title="Clientes con Deuda"
            value={clientesConDeuda}
            icon={<Users className="h-6 w-6" />}
          />
          <KPICard
            title="Promedio por Cliente"
            value={`S/. ${promedioDeuda.toFixed(2)}`}
            icon={<TrendingDown className="h-6 w-6" />}
          />
        </div>

        {/* Clientes con Deuda */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Clientes con Deuda</h2>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Cargando...</p>
          ) : clientes.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No hay clientes registrados</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientes.map((cliente) => (
                <Card key={cliente.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 bg-primary text-primary-foreground">
                      <AvatarFallback>{getIniciales(cliente.nombre)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{cliente.nombre}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cliente.celular || 'Sin teléfono'}
                      </p>
                      <p className="text-2xl font-bold text-destructive mt-2">
                        S/. {cliente.deuda_total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    size="sm"
                    onClick={() => {
                      setSelectedCliente(cliente);
                      setPagoModalOpen(true);
                    }}
                    disabled={cliente.deuda_total === 0}
                  >
                    Registrar Pago
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      {selectedCliente && (
        <PagoModal
          isOpen={pagoModalOpen}
          onClose={() => {
            setPagoModalOpen(false);
            setSelectedCliente(null);
          }}
          onSave={handleRegistrarPago}
          clienteNombre={selectedCliente.nombre}
          deudaActual={selectedCliente.deuda_total}
        />
      )}

      <ChatbotWidget />
    </Layout>
  );
};

export default Fiados;
