-- Agregar columnas para métodos de pago y referencias en transacciones_fiados
ALTER TABLE transacciones_fiados 
ADD COLUMN IF NOT EXISTS metodo_pago text DEFAULT 'efectivo',
ADD COLUMN IF NOT EXISTS referencia_transaccion text,
ADD COLUMN IF NOT EXISTS comprobante_url text;

-- Agregar foto y campos adicionales a clientes
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS foto_url text,
ADD COLUMN IF NOT EXISTS direccion text,
ADD COLUMN IF NOT EXISTS dni text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS notas text,
ADD COLUMN IF NOT EXISTS activo boolean DEFAULT true;

-- Crear tabla para historial de precios de productos
CREATE TABLE IF NOT EXISTS historial_precios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid REFERENCES productos(id) ON DELETE CASCADE,
  precio_costo_anterior numeric NOT NULL,
  precio_venta_anterior numeric NOT NULL,
  precio_costo_nuevo numeric NOT NULL,
  precio_venta_nuevo numeric NOT NULL,
  motivo text,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS en historial_precios
ALTER TABLE historial_precios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública de historial_precios" 
ON historial_precios FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserción pública de historial_precios" 
ON historial_precios FOR INSERT 
WITH CHECK (true);

-- Agregar campos adicionales a operadores
ALTER TABLE operadores 
ADD COLUMN IF NOT EXISTS email text UNIQUE,
ADD COLUMN IF NOT EXISTS dni text,
ADD COLUMN IF NOT EXISTS direccion text,
ADD COLUMN IF NOT EXISTS fecha_ingreso date DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS salario numeric;

-- Crear tabla para reportes SUNAT
CREATE TABLE IF NOT EXISTS reportes_sunat (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  periodo text NOT NULL,
  total_compras numeric DEFAULT 0,
  total_ventas numeric DEFAULT 0,
  total_fiados numeric DEFAULT 0,
  total_pagos numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE reportes_sunat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública de reportes_sunat" 
ON reportes_sunat FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserción pública de reportes_sunat" 
ON reportes_sunat FOR INSERT 
WITH CHECK (true);

-- Crear buckets de storage para comprobantes y fotos de clientes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('comprobantes-fiados', 'comprobantes-fiados', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('fotos-clientes', 'fotos-clientes', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para comprobantes-fiados
CREATE POLICY "Permitir lectura pública de comprobantes"
ON storage.objects FOR SELECT
USING (bucket_id = 'comprobantes-fiados');

CREATE POLICY "Permitir subida pública de comprobantes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'comprobantes-fiados');

CREATE POLICY "Permitir actualización pública de comprobantes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'comprobantes-fiados');

CREATE POLICY "Permitir eliminación pública de comprobantes"
ON storage.objects FOR DELETE
USING (bucket_id = 'comprobantes-fiados');

-- Políticas para fotos-clientes
CREATE POLICY "Permitir lectura pública de fotos clientes"
ON storage.objects FOR SELECT
USING (bucket_id = 'fotos-clientes');

CREATE POLICY "Permitir subida pública de fotos clientes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'fotos-clientes');

CREATE POLICY "Permitir actualización pública de fotos clientes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'fotos-clientes');

CREATE POLICY "Permitir eliminación pública de fotos clientes"
ON storage.objects FOR DELETE
USING (bucket_id = 'fotos-clientes');

-- Agregar índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_transacciones_cliente ON transacciones_fiados(cliente_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones_fiados(created_at);
CREATE INDEX IF NOT EXISTS idx_historial_producto ON historial_precios(producto_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(created_at);
CREATE INDEX IF NOT EXISTS idx_ventas_tipo ON ventas(tipo);