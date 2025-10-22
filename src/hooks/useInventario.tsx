import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface Producto {
  id: string;
  nombre: string;
  codigo: string;
  stock: number;
  precio_costo: number;
  precio_venta: number;
  categoria: string;
  estado: string;
}

export const useInventario = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProductos = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const agregarProducto = async (producto: Omit<Producto, 'id'>) => {
    try {
      const { error } = await supabase
        .from('productos')
        .insert([producto]);

      if (error) throw error;

      toast({
        title: "Producto agregado",
        description: `${producto.nombre} ha sido agregado al inventario`,
      });

      fetchProductos();
    } catch (error: any) {
      console.error('Error agregando producto:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar el producto",
        variant: "destructive",
      });
    }
  };

  const actualizarProducto = async (id: string, updates: Partial<Producto>) => {
    try {
      const { error } = await supabase
        .from('productos')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Producto actualizado",
        description: "Los cambios se guardaron correctamente",
      });

      fetchProductos();
    } catch (error: any) {
      console.error('Error actualizando producto:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el producto",
        variant: "destructive",
      });
    }
  };

  const eliminarProducto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del inventario",
      });

      fetchProductos();
    } catch (error: any) {
      console.error('Error eliminando producto:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProductos();

    // Suscripción en tiempo real
    const channel = supabase
      .channel('productos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'productos'
        },
        () => {
          fetchProductos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    productos,
    loading,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    refetch: fetchProductos,
  };
};
