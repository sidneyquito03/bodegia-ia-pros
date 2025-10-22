import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Producto } from "@/hooks/useInventario";

interface ProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (producto: Omit<Producto, 'id'>) => void;
  producto?: Producto;
}

export const ProductoModal = ({ isOpen, onClose, onSave, producto }: ProductoModalProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    stock: 0,
    precio_costo: 0,
    precio_venta: 0,
    categoria: 'Abarrotes',
    estado: 'Disponible',
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        codigo: producto.codigo,
        stock: producto.stock,
        precio_costo: producto.precio_costo,
        precio_venta: producto.precio_venta,
        categoria: producto.categoria,
        estado: producto.estado,
      });
    } else {
      setFormData({
        nombre: '',
        codigo: '',
        stock: 0,
        precio_costo: 0,
        precio_venta: 0,
        categoria: 'Abarrotes',
        estado: 'Disponible',
      });
    }
  }, [producto, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{producto ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio_costo">P. Costo</Label>
              <Input
                id="precio_costo"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio_costo}
                onChange={(e) => setFormData({ ...formData, precio_costo: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio_venta">P. Venta</Label>
              <Input
                id="precio_venta"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio_venta}
                onChange={(e) => setFormData({ ...formData, precio_venta: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bebidas">Bebidas</SelectItem>
                  <SelectItem value="Panadería">Panadería</SelectItem>
                  <SelectItem value="Lácteos">Lácteos</SelectItem>
                  <SelectItem value="Abarrotes">Abarrotes</SelectItem>
                  <SelectItem value="Limpieza">Limpieza</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Stock Bajo">Stock Bajo</SelectItem>
                  <SelectItem value="Stock Crítico">Stock Crítico</SelectItem>
                  <SelectItem value="Agotado">Agotado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {producto ? 'Actualizar' : 'Agregar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
