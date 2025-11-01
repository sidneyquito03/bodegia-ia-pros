import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReportesSUNAT = () => {
  const [periodo, setPeriodo] = useState('mes-actual');
  const [datos, setDatos] = useState({
    totalVentas: 0,
    totalCompras: 0,
    totalFiados: 0,
    totalPagos: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    cargarDatos();
  }, [periodo]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const fechas = calcularFechas(periodo);

      // Obtener ventas
      const { data: ventas } = await supabase
        .from('ventas')
        .select('total')
        .gte('created_at', fechas.inicio)
        .lte('created_at', fechas.fin);

      // Obtener transacciones de fiados
      const { data: transacciones } = await supabase
        .from('transacciones_fiados')
        .select('tipo, monto')
        .gte('created_at', fechas.inicio)
        .lte('created_at', fechas.fin);

      const totalVentas = ventas?.reduce((sum, v) => sum + Number(v.total), 0) || 0;
      const totalFiados = transacciones?.filter(t => t.tipo === 'fiado').reduce((sum, t) => sum + Number(t.monto), 0) || 0;
      const totalPagos = transacciones?.filter(t => t.tipo === 'pago').reduce((sum, t) => sum + Number(t.monto), 0) || 0;

      setDatos({
        totalVentas,
        totalCompras: 0, // Aquí se puede agregar lógica para compras si existe la tabla
        totalFiados,
        totalPagos,
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularFechas = (periodo: string) => {
    const ahora = new Date();
    let inicio = new Date();
    let fin = new Date();

    switch (periodo) {
      case 'mes-actual':
        inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        fin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
        break;
      case 'mes-anterior':
        inicio = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
        fin = new Date(ahora.getFullYear(), ahora.getMonth(), 0);
        break;
      case 'trimestre':
        const mesInicio = Math.floor(ahora.getMonth() / 3) * 3;
        inicio = new Date(ahora.getFullYear(), mesInicio, 1);
        fin = new Date(ahora.getFullYear(), mesInicio + 3, 0);
        break;
      case 'anual':
        inicio = new Date(ahora.getFullYear(), 0, 1);
        fin = new Date(ahora.getFullYear(), 11, 31);
        break;
    }

    return {
      inicio: inicio.toISOString(),
      fin: fin.toISOString(),
    };
  };

  const descargarReporte = () => {
    const csv = `
REPORTE PARA SUNAT - RÉGIMEN ÚNICO SIMPLIFICADO (RUS)
Período: ${periodo}
Fecha de generación: ${new Date().toLocaleDateString('es-PE')}

RESUMEN FINANCIERO:
Total de Ventas:,S/. ${datos.totalVentas.toFixed(2)}
Total de Compras:,S/. ${datos.totalCompras.toFixed(2)}
Total Fiado (Créditos):,S/. ${datos.totalFiados.toFixed(2)}
Total Cobrado:,S/. ${datos.totalPagos.toFixed(2)}
Ingresos Netos:,S/. ${(datos.totalVentas + datos.totalPagos).toFixed(2)}
`.trim();

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte-sunat-${periodo}-${new Date().getTime()}.csv`;
    link.click();

    toast({
      title: "Reporte descargado",
      description: "El archivo CSV se descargó correctamente",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Reportes SUNAT</h1>
          <p className="text-muted-foreground mt-1">
            Resumen simple para declaración de impuestos (RUS)
          </p>
        </div>

        {/* Selector de período */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[250px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes-actual">Mes Actual</SelectItem>
                <SelectItem value="mes-anterior">Mes Anterior</SelectItem>
                <SelectItem value="trimestre">Trimestre Actual</SelectItem>
                <SelectItem value="anual">Año Actual</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={descargarReporte} className="ml-auto">
              <Download className="mr-2 h-4 w-4" />
              Descargar Reporte CSV
            </Button>
          </div>
        </Card>

        {/* Resumen de datos */}
        {loading ? (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">Cargando datos...</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Ventas</p>
                  <p className="text-2xl font-bold text-green-600">
                    S/. {datos.totalVentas.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Ingresos por ventas en el período seleccionado
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Compras</p>
                  <p className="text-2xl font-bold text-blue-600">
                    S/. {datos.totalCompras.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Gastos en compras e inventario (requiere registro manual)
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-orange-500/10 rounded-full">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Fiado</p>
                  <p className="text-2xl font-bold text-orange-600">
                    S/. {datos.totalFiados.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Créditos otorgados a clientes en el período
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cobrado</p>
                  <p className="text-2xl font-bold text-purple-600">
                    S/. {datos.totalPagos.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Pagos recibidos de deudas anteriores
              </p>
            </Card>
          </div>
        )}

        {/* Información adicional */}
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-3">ℹ️ Información para RUS</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              • El <strong>Total de Ventas</strong> es el monto que debes declarar como ingresos brutos.
            </p>
            <p>
              • El <strong>Total Fiado</strong> y <strong>Total Cobrado</strong> son para tu control interno.
            </p>
            <p>
              • Los <strong>Ingresos Netos</strong> (Ventas + Cobros) representan el flujo de efectivo real.
            </p>
            <p>
              • Este reporte es un resumen simplificado. Consulta con un contador para tu declaración oficial.
            </p>
          </div>
        </Card>
      </div>

      <ChatbotWidget />
    </Layout>
  );
};

export default ReportesSUNAT;
