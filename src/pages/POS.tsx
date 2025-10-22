import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Mic, Plus, Minus, Trash2 } from "lucide-react";

const POS = () => {
  const productos = [
    { id: 1, nombre: "Inca Kola 1.5L", precio: 5.00, categoria: "Bebidas" },
    { id: 2, nombre: "Pan Bimbo", precio: 6.00, categoria: "Panadería" },
    { id: 3, nombre: "Leche Gloria", precio: 5.50, categoria: "Lácteos" },
    { id: 4, nombre: "Arroz Superior", precio: 4.50, categoria: "Abarrotes" },
    { id: 5, nombre: "Aceite Primor", precio: 12.00, categoria: "Abarrotes" },
    { id: 6, nombre: "Azúcar Blanca", precio: 3.80, categoria: "Abarrotes" },
  ];

  const carrito = [
    { id: 1, nombre: "Inca Kola 1.5L", precio: 5.00, cantidad: 2 },
    { id: 2, nombre: "Pan Bimbo", precio: 6.00, cantidad: 1 },
  ];

  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Punto de Venta</h1>
          <p className="text-muted-foreground mt-1">Registra ventas rápidamente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Catálogo - 3 columnas */}
          <Card className="lg:col-span-3 p-6 shadow-card">
            <div className="space-y-4">
              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar producto o escanear código..." 
                  className="pl-10 pr-12 h-12 text-lg"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>

              {/* Grid de productos */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {productos.map((producto) => (
                  <Card 
                    key={producto.id} 
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-4xl">📦</span>
                    </div>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                      {producto.nombre}
                    </h3>
                    <Badge variant="outline" className="text-xs mb-2">
                      {producto.categoria}
                    </Badge>
                    <p className="text-lg font-bold text-primary">
                      S/. {producto.precio.toFixed(2)}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          {/* Carrito - 2 columnas */}
          <Card className="lg:col-span-2 p-6 shadow-card lg:sticky lg:top-8 h-fit">
            <h2 className="text-xl font-semibold mb-4">Carrito</h2>
            
            <div className="space-y-3 mb-6">
              {carrito.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No hay productos en el carrito</p>
                </div>
              ) : (
                carrito.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        S/. {item.precio.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number" 
                        value={item.cantidad}
                        className="w-16 h-8 text-center"
                      />
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold">S/. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-primary">S/. {subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button className="h-12">
                Cobrar
              </Button>
              <Button variant="outline" className="h-12">
                Fiar
              </Button>
            </div>
            <Button variant="ghost" className="w-full mt-2">
              Cancelar
            </Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default POS;
