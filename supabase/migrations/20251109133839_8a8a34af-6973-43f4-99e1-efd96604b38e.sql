-- Crear tabla de proveedores
CREATE TABLE IF NOT EXISTS public.proveedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  ruc TEXT,
  contacto TEXT,
  telefono TEXT,
  email TEXT,
  direccion TEXT,
  tiempo_entrega_dias INTEGER DEFAULT 0,
  notas TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS en proveedores
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;

-- Políticas para proveedores
CREATE POLICY "Permitir lectura pública de proveedores"
ON public.proveedores FOR SELECT
USING (true);

CREATE POLICY "Permitir inserción pública de proveedores"
ON public.proveedores FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de proveedores"
ON public.proveedores FOR UPDATE
USING (true);

CREATE POLICY "Permitir eliminación pública de proveedores"
ON public.proveedores FOR DELETE
USING (true);

-- Trigger para proveedores
CREATE TRIGGER update_proveedores_updated_at
BEFORE UPDATE ON public.proveedores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Agregar nuevos campos a productos
ALTER TABLE public.productos 
ADD COLUMN IF NOT EXISTS proveedor_id UUID REFERENCES public.proveedores(id),
ADD COLUMN IF NOT EXISTS fecha_vencimiento DATE,
ADD COLUMN IF NOT EXISTS marca TEXT,
ADD COLUMN IF NOT EXISTS medida_peso TEXT,
ADD COLUMN IF NOT EXISTS stock_critico INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS stock_bajo INTEGER DEFAULT 20;

-- Crear tabla de historial de compras a proveedores
CREATE TABLE IF NOT EXISTS public.compras_proveedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id UUID REFERENCES public.proveedores(id),
  producto_id UUID REFERENCES public.productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  fecha_pedido TIMESTAMP WITH TIME ZONE DEFAULT now(),
  fecha_entrega_estimada DATE,
  fecha_entrega_real DATE,
  estado TEXT DEFAULT 'pendiente',
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS en compras_proveedores
ALTER TABLE public.compras_proveedores ENABLE ROW LEVEL SECURITY;

-- Políticas para compras_proveedores
CREATE POLICY "Permitir lectura pública de compras_proveedores"
ON public.compras_proveedores FOR SELECT
USING (true);

CREATE POLICY "Permitir inserción pública de compras_proveedores"
ON public.compras_proveedores FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de compras_proveedores"
ON public.compras_proveedores FOR UPDATE
USING (true);

CREATE POLICY "Permitir eliminación pública de compras_proveedores"
ON public.compras_proveedores FOR DELETE
USING (true);