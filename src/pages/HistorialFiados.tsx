import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, TrendingUp, TrendingDown, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HistorialFiados = () => {
  const [transacciones, setTransacciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    fetchTransacciones();
  }, [filtro]);

  const fetchTransacciones = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('transacciones_fiados')
        .select('*, clientes(nombre)')
        .order('created_at', { ascending: false });

      if (filtro !== 'todos') {
        query = query.eq('tipo', filtro);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTransacciones(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPorTipo = (tipo: string) => {
    return transacciones
      .filter(t => t.tipo === tipo)
      .reduce((sum, t) => sum + Number(t.monto), 0);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Historial de Fiados</h1>
          <p className="text-muted-foreground mt-1">Registro completo de transacciones</p>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-destructive/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Fiado</p>
                <p className="text-2xl font-bold text-destructive">
                  S/. {getTotalPorTipo('fiado').toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-full">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pagado</p>
                <p className="text-2xl font-bold text-green-600">
                  S/. {getTotalPorTipo('pago').toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtro */}
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las transacciones</SelectItem>
              <SelectItem value="fiado">Solo fiados</SelectItem>
              <SelectItem value="pago">Solo pagos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Historial */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Transacciones</h2>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Cargando...</p>
          ) : transacciones.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No hay transacciones registradas
            </p>
          ) : (
            <div className="space-y-3">
              {transacciones.map((transaccion) => (
                <div 
                  key={transaccion.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={transaccion.tipo === 'fiado' ? 'destructive' : 'default'}>
                        {transaccion.tipo === 'fiado' ? '📤 Fiado' : '💰 Pago'}
                      </Badge>
                      <span className="font-medium">
                        {(transaccion as any).clientes?.nombre || 'Cliente desconocido'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {transaccion.descripcion}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(transaccion.created_at), "dd 'de' MMMM, yyyy - HH:mm", { locale: es })}
                      </span>
                      {transaccion.metodo_pago && (
                        <Badge variant="outline" className="text-xs">
                          {transaccion.metodo_pago}
                        </Badge>
                      )}
                      {transaccion.referencia_transaccion && (
                        <span className="text-xs">
                          Ref: {transaccion.referencia_transaccion}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      transaccion.tipo === 'fiado' ? 'text-destructive' : 'text-green-600'
                    }`}>
                      {transaccion.tipo === 'fiado' ? '+' : '-'} S/. {Number(transaccion.monto).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <ChatbotWidget />
    </Layout>
  );
};

export default HistorialFiados;
