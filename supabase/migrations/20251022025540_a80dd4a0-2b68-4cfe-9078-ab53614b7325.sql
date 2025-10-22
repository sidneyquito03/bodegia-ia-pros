-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS public.productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  precio_costo DECIMAL(10, 2) NOT NULL CHECK (precio_costo >= 0),
  precio_venta DECIMAL(10, 2) NOT NULL CHECK (precio_venta >= 0),
  categoria TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Disponible',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  celular TEXT,
  deuda_total DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (deuda_total >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de transacciones de fiados
CREATE TABLE IF NOT EXISTS public.transacciones_fiados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('fiado', 'pago')),
  monto DECIMAL(10, 2) NOT NULL,
  descripcion TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de ventas
CREATE TABLE IF NOT EXISTS public.ventas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('efectivo', 'fiado')),
  cliente_id UUID REFERENCES public.clientes(id),
  subtotal DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de operadores
CREATE TABLE IF NOT EXISTS public.operadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  celular TEXT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON public.productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON public.productos(categoria);
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON public.clientes(nombre);
CREATE INDEX IF NOT EXISTS idx_transacciones_cliente ON public.transacciones_fiados(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON public.ventas(created_at);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON public.productos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar productos de ejemplo
INSERT INTO public.productos (nombre, codigo, stock, precio_costo, precio_venta, categoria, estado) VALUES
  ('Inca Kola 1.5L', 'BEB001', 24, 3.50, 5.00, 'Bebidas', 'Disponible'),
  ('Pan Bimbo Blanco', 'PAN001', 15, 4.20, 6.00, 'Panadería', 'Disponible'),
  ('Leche Gloria', 'LAC001', 8, 3.80, 5.50, 'Lácteos', 'Stock Bajo'),
  ('Arroz Superior 1kg', 'ARR001', 45, 3.20, 4.50, 'Abarrotes', 'Disponible'),
  ('Aceite Primor', 'ACE001', 2, 8.50, 12.00, 'Abarrotes', 'Stock Crítico'),
  ('Azúcar Blanca 1kg', 'ABA001', 30, 2.80, 3.80, 'Abarrotes', 'Disponible')
ON CONFLICT (codigo) DO NOTHING;

-- Insertar clientes de ejemplo
INSERT INTO public.clientes (nombre, celular, deuda_total) VALUES
  ('Juan Pérez', '987654321', 45.00),
  ('María García', '956123789', 127.50),
  ('Carlos López', '912456789', 89.00),
  ('Ana Rodríguez', '923456789', 234.00),
  ('Pedro Sánchez', '934567890', 56.50)
ON CONFLICT DO NOTHING;

-- Insertar operadores de ejemplo
INSERT INTO public.operadores (nombre, celular, activo) VALUES
  ('Carlos Mendoza', '987654321', true),
  ('Lucía Torres', '956123789', true),
  ('Miguel Ángel', '912456789', false)
ON CONFLICT DO NOTHING;

-- RLS Policies (acceso público para simplicidad inicial)
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacciones_fiados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública de productos" ON public.productos FOR SELECT USING (true);
CREATE POLICY "Permitir inserción pública de productos" ON public.productos FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización pública de productos" ON public.productos FOR UPDATE USING (true);
CREATE POLICY "Permitir eliminación pública de productos" ON public.productos FOR DELETE USING (true);

CREATE POLICY "Permitir lectura pública de clientes" ON public.clientes FOR SELECT USING (true);
CREATE POLICY "Permitir inserción pública de clientes" ON public.clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización pública de clientes" ON public.clientes FOR UPDATE USING (true);
CREATE POLICY "Permitir eliminación pública de clientes" ON public.clientes FOR DELETE USING (true);

CREATE POLICY "Permitir lectura pública de transacciones" ON public.transacciones_fiados FOR SELECT USING (true);
CREATE POLICY "Permitir inserción pública de transacciones" ON public.transacciones_fiados FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización pública de transacciones" ON public.transacciones_fiados FOR UPDATE USING (true);
CREATE POLICY "Permitir eliminación pública de transacciones" ON public.transacciones_fiados FOR DELETE USING (true);

CREATE POLICY "Permitir lectura pública de ventas" ON public.ventas FOR SELECT USING (true);
CREATE POLICY "Permitir inserción pública de ventas" ON public.ventas FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización pública de ventas" ON public.ventas FOR UPDATE USING (true);

CREATE POLICY "Permitir lectura pública de operadores" ON public.operadores FOR SELECT USING (true);
CREATE POLICY "Permitir inserción pública de operadores" ON public.operadores FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización pública de operadores" ON public.operadores FOR UPDATE USING (true);
CREATE POLICY "Permitir eliminación pública de operadores" ON public.operadores FOR DELETE USING (true);