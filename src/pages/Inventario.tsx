import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Search, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Inventario = () => {
  const productos = [
    { id: 1, nombre: "Inca Kola 1.5L", codigo: "BEB001", stock: 24, costo: 3.50, venta: 5.00, ganancia: 42.9, categoria: "Bebidas", estado: "Disponible" },
    { id: 2, nombre: "Pan Bimbo Blanco", codigo: "PAN001", stock: 15, costo: 4.20, venta: 6.00, ganancia: 42.9, categoria: "Panadería", estado: "Disponible" },
    { id: 3, nombre: "Leche Gloria", codigo: "LAC001", stock: 8, costo: 3.80, venta: 5.50, ganancia: 44.7, categoria: "Lácteos", estado: "Stock Bajo" },
    { id: 4, nombre: "Arroz Superior 1kg", codigo: "ARR001", stock: 45, costo: 3.20, venta: 4.50, ganancia: 40.6, categoria: "Abarrotes", estado: "Disponible" },
    { id: 5, nombre: "Aceite Primor", codigo: "ACE001", stock: 2, costo: 8.50, venta: 12.00, ganancia: 41.2, categoria: "Abarrotes", estado: "Stock Crítico" },
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return <Badge className="bg-success text-success-foreground">{estado}</Badge>;
      case "Stock Bajo":
        return <Badge variant="secondary">{estado}</Badge>;
      case "Stock Crítico":
        return <Badge variant="destructive">{estado}</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Inventario</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus productos y stock</p>
        </div>

        {/* Toolbar */}
        <Card className="p-4 shadow-card">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full md:w-auto">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Producto
              </Button>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Carga Masiva
              </Button>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar producto..." 
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>P. Costo</TableHead>
                  <TableHead>P. Venta</TableHead>
                  <TableHead>Ganancia %</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell className="text-muted-foreground">{producto.codigo}</TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={producto.stock} 
                        className="w-20 h-8"
                      />
                    </TableCell>
                    <TableCell>S/. {producto.costo.toFixed(2)}</TableCell>
                    <TableCell>S/. {producto.venta.toFixed(2)}</TableCell>
                    <TableCell className="text-success font-medium">
                      {producto.ganancia.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{producto.categoria}</Badge>
                    </TableCell>
                    <TableCell>{getEstadoBadge(producto.estado)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Inventario;
