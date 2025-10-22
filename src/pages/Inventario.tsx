import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { ProductoModal } from "@/components/modals/ProductoModal";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useInventario, Producto } from "@/hooks/useInventario";

const Inventario = () => {
  const { productos, loading, agregarProducto, actualizarProducto, eliminarProducto } = useInventario();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState<string | null>(null);

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setModalOpen(true);
  };

  const handleSave = (producto: Omit<Producto, 'id'>) => {
    if (editingProducto) {
      actualizarProducto(editingProducto.id, producto);
    } else {
      agregarProducto(producto);
    }
    setEditingProducto(undefined);
  };

  const handleDeleteClick = (id: string) => {
    setProductoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productoToDelete) {
      eliminarProducto(productoToDelete);
      setProductoToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

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

  const handleStockChange = (id: string, newStock: number) => {
    if (newStock >= 0) {
      actualizarProducto(id, { stock: newStock });
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
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => {
                setEditingProducto(undefined);
                setModalOpen(true);
              }} className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Producto
              </Button>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar producto..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : productosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                ) : (
                  productosFiltrados.map((producto) => {
                    const ganancia = ((producto.precio_venta - producto.precio_costo) / producto.precio_costo * 100);
                    return (
                      <TableRow key={producto.id}>
                        <TableCell className="font-medium">{producto.nombre}</TableCell>
                        <TableCell className="text-muted-foreground">{producto.codigo}</TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={producto.stock} 
                            onChange={(e) => handleStockChange(producto.id, parseInt(e.target.value) || 0)}
                            className="w-20 h-8"
                          />
                        </TableCell>
                        <TableCell>S/. {producto.precio_costo.toFixed(2)}</TableCell>
                        <TableCell>S/. {producto.precio_venta.toFixed(2)}</TableCell>
                        <TableCell className="text-success font-medium">
                          {ganancia.toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{producto.categoria}</Badge>
                        </TableCell>
                        <TableCell>{getEstadoBadge(producto.estado)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEdit(producto)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(producto.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <ProductoModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProducto(undefined);
        }}
        onSave={handleSave}
        producto={editingProducto}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ChatbotWidget />
    </Layout>
  );
};

export default Inventario;
