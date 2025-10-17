-- =====================================================
-- SISTEMA COMPLETO DE E-COMMERCE
-- =====================================================
-- Fecha: 2025-01-17
-- Descripción: Sistema completo de tienda online con:
--              - Pedidos (orders)
--              - Items del pedido (order_items)
--              - Direcciones de envío (shipping_addresses)
--              - Facturas (invoices)
--              - Métodos de pago (payment_methods)
--              - Historial de estados
-- =====================================================

-- =====================================================
-- 1. TABLA: shipping_addresses
-- =====================================================
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Datos de dirección
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'España',
  
  -- Flags
  is_default BOOLEAN DEFAULT false,
  is_billing BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices
CREATE INDEX idx_shipping_addresses_user ON shipping_addresses(user_id);
CREATE INDEX idx_shipping_addresses_default ON shipping_addresses(user_id, is_default) WHERE is_default = true;

-- =====================================================
-- 2. TABLA: payment_methods
-- =====================================================
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Datos del método de pago
  type VARCHAR(50) NOT NULL, -- 'card', 'paypal', 'bizum', 'transfer'
  provider VARCHAR(50), -- 'stripe', 'paypal', etc.
  
  -- Para tarjetas
  last4 VARCHAR(4),
  brand VARCHAR(50), -- 'visa', 'mastercard', 'amex'
  exp_month INTEGER,
  exp_year INTEGER,
  
  -- Para otros métodos
  email VARCHAR(255), -- Para PayPal
  account_number VARCHAR(100), -- Para transferencias (encriptado)
  
  -- Stripe/Payment Gateway IDs
  stripe_payment_method_id VARCHAR(255),
  paypal_payer_id VARCHAR(255),
  
  -- Flags
  is_default BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices
CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_default ON payment_methods(user_id, is_default) WHERE is_default = true;

-- =====================================================
-- 3. TABLA: orders
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Número de pedido único
  order_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Estado del pedido
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  -- pending, paid, processing, shipped, delivered, cancelled, refunded
  
  -- Importes
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Dirección de envío
  shipping_address_id UUID REFERENCES shipping_addresses(id),
  shipping_address_snapshot JSONB, -- Copia de la dirección en el momento del pedido
  
  -- Método de pago
  payment_method_id UUID REFERENCES payment_methods(id),
  payment_method_snapshot JSONB, -- Copia del método de pago usado
  
  -- Información de pago
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, authorized, captured, failed, refunded
  payment_provider VARCHAR(50), -- 'stripe', 'paypal', etc.
  payment_provider_id VARCHAR(255), -- ID en el proveedor de pago
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Información de envío
  shipping_provider VARCHAR(100), -- 'correos', 'seur', 'mrw', etc.
  tracking_number VARCHAR(255),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Notas
  customer_notes TEXT,
  admin_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- =====================================================
-- 4. TABLA: order_items
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Producto (asumo que tienes una tabla products)
  product_id UUID, -- REFERENCES products(id) si existe
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  product_image_url TEXT,
  
  -- Variante del producto (talla, color, etc.)
  variant_id UUID,
  variant_name VARCHAR(255),
  
  -- Precio y cantidad
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Descuentos
  discount_amount DECIMAL(10,2) DEFAULT 0,
  
  -- Snapshot del producto en el momento de la compra
  product_snapshot JSONB,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- =====================================================
-- 5. TABLA: order_status_history
-- =====================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Estado
  from_status VARCHAR(50),
  to_status VARCHAR(50) NOT NULL,
  
  -- Detalles
  notes TEXT,
  changed_by UUID REFERENCES users(id), -- Quién cambió el estado (admin, sistema, etc.)
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_created ON order_status_history(created_at DESC);

-- =====================================================
-- 6. TABLA: invoices
-- =====================================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Número de factura único
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Tipo de factura
  type VARCHAR(50) DEFAULT 'invoice', -- invoice, credit_note, proforma
  
  -- Importes (copiados del pedido)
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Datos fiscales
  billing_name VARCHAR(255) NOT NULL,
  billing_nif VARCHAR(50),
  billing_address TEXT NOT NULL,
  
  -- PDF
  pdf_url TEXT,
  
  -- Estado
  status VARCHAR(50) DEFAULT 'draft', -- draft, issued, sent, paid, cancelled
  
  -- Fechas
  issue_date DATE NOT NULL,
  due_date DATE,
  paid_date DATE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices
CREATE INDEX idx_invoices_order ON invoices(order_id);
CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_issue_date ON invoices(issue_date DESC);

-- =====================================================
-- 7. FUNCIONES AUTOMÁTICAS
-- =====================================================

-- 7.1 Generar número de pedido único
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  exists_count INTEGER;
BEGIN
  LOOP
    -- Formato: ORD-YYYYMMDD-XXXX
    new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                  LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    SELECT COUNT(*) INTO exists_count
    FROM orders
    WHERE order_number = new_number;
    
    EXIT WHEN exists_count = 0;
  END LOOP;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- 7.2 Generar número de factura único
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  exists_count INTEGER;
BEGIN
  LOOP
    -- Formato: INV-YYYY-XXXX
    new_number := 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
                  LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    SELECT COUNT(*) INTO exists_count
    FROM invoices
    WHERE invoice_number = new_number;
    
    EXIT WHEN exists_count = 0;
  END LOOP;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- 7.3 Trigger para registrar cambios de estado
CREATE OR REPLACE FUNCTION track_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO order_status_history (order_id, from_status, to_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_trigger
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION track_order_status_change();

-- 7.4 Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_addresses_updated_at
BEFORE UPDATE ON shipping_addresses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON payment_methods
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- 8.1 shipping_addresses
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shipping addresses"
ON shipping_addresses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shipping addresses"
ON shipping_addresses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shipping addresses"
ON shipping_addresses FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shipping addresses"
ON shipping_addresses FOR DELETE
USING (auth.uid() = user_id);

-- 8.2 payment_methods
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment methods"
ON payment_methods FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
ON payment_methods FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
ON payment_methods FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
ON payment_methods FOR DELETE
USING (auth.uid() = user_id);

-- 8.3 orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Solo admins pueden actualizar pedidos
CREATE POLICY "Admins can update orders"
ON orders FOR UPDATE
USING (is_admin());

-- 8.4 order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items from their own orders"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- 8.5 order_status_history
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view status history of their own orders"
ON order_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_status_history.order_id
    AND orders.user_id = auth.uid()
  )
);

-- 8.6 invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices"
ON invoices FOR SELECT
USING (auth.uid() = user_id);

-- =====================================================
-- 9. COMENTARIOS
-- =====================================================

COMMENT ON TABLE shipping_addresses IS 'Direcciones de envío de los usuarios';
COMMENT ON TABLE payment_methods IS 'Métodos de pago guardados de los usuarios';
COMMENT ON TABLE orders IS 'Pedidos de la tienda';
COMMENT ON TABLE order_items IS 'Items/productos de cada pedido';
COMMENT ON TABLE order_status_history IS 'Historial de cambios de estado de pedidos';
COMMENT ON TABLE invoices IS 'Facturas generadas para los pedidos';

-- =====================================================
-- ✅ SCRIPT COMPLETADO
-- =====================================================
