-- Agregar columna de imagen a productos
ALTER TABLE public.productos 
ADD COLUMN IF NOT EXISTS imagen_url TEXT;

-- Crear bucket para imágenes de productos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('productos-imagenes', 'productos-imagenes', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para el bucket de imágenes de productos
CREATE POLICY "Las imágenes de productos son públicamente accesibles"
ON storage.objects FOR SELECT
USING (bucket_id = 'productos-imagenes');

CREATE POLICY "Cualquiera puede subir imágenes de productos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'productos-imagenes');

CREATE POLICY "Cualquiera puede actualizar imágenes de productos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'productos-imagenes');

CREATE POLICY "Cualquiera puede eliminar imágenes de productos"
ON storage.objects FOR DELETE
USING (bucket_id = 'productos-imagenes');