import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface Proveedor {
  id: string;
  nombre: string;
  ruc?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  tiempo_entrega_dias: number;
  notas?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CompraProveedor {
  id: string;
  proveedor_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
  fecha_pedido: string;
  fecha_entrega_estimada?: string;
  fecha_entrega_real?: string;
  estado: string;
  notas?: string;
  created_at?: string;
}

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [compras, setCompras] = useState<CompraProveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProveedores = async () => {
    try {
      const { data, error } = await supabase
        .from('proveedores')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setProveedores(data || []);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los proveedores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompras = async (proveedorId?: string) => {
    try {
      let query = supabase
        .from('compras_proveedores')
        .select('*')
        .order('fecha_pedido', { ascending: false });

      if (proveedorId) {
        query = query.eq('proveedor_id', proveedorId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCompras(data || []);
    } catch (error) {
      console.error('Error cargando compras:', error);
    }
  };

  const agregarProveedor = async (proveedor: Omit<Proveedor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('proveedores')
        .insert([proveedor]);

      if (error) throw error;

      toast({
        title: "Proveedor agregado",
        description: `${proveedor.nombre} ha sido agregado correctamente`,
      });

      fetchProveedores();
    } catch (error: any) {
      console.error('Error agregando proveedor:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar el proveedor",
        variant: "destructive",
      });
    }
  };

  const actualizarProveedor = async (id: string, updates: Partial<Proveedor>) => {
    try {
      const { error } = await supabase
        .from('proveedores')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Proveedor actualizado",
        description: "Los cambios se guardaron correctamente",
      });

      fetchProveedores();
    } catch (error: any) {
      console.error('Error actualizando proveedor:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el proveedor",
        variant: "destructive",
      });
    }
  };

  const toggleProveedor = async (id: string, activo: boolean) => {
    await actualizarProveedor(id, { activo: !activo });
  };

  const registrarCompra = async (compra: Omit<CompraProveedor, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('compras_proveedores')
        .insert([compra]);

      if (error) throw error;

      toast({
        title: "Compra registrada",
        description: "La compra ha sido registrada correctamente",
      });

      fetchCompras();
    } catch (error: any) {
      console.error('Error registrando compra:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo registrar la compra",
        variant: "destructive",
      });
    }
  };

  const actualizarCompra = async (id: string, updates: Partial<CompraProveedor>) => {
    try {
      const { error } = await supabase
        .from('compras_proveedores')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Compra actualizada",
        description: "Los cambios se guardaron correctamente",
      });

      fetchCompras();
    } catch (error: any) {
      console.error('Error actualizando compra:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la compra",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProveedores();
    fetchCompras();

    const channel = supabase
      .channel('proveedores-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'proveedores'
        },
        () => {
          fetchProveedores();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'compras_proveedores'
        },
        () => {
          fetchCompras();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    proveedores,
    compras,
    loading,
    agregarProveedor,
    actualizarProveedor,
    toggleProveedor,
    registrarCompra,
    actualizarCompra,
    fetchCompras,
    refetch: fetchProveedores,
  };
};
