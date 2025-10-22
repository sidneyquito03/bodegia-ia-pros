import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (monto: number, descripcion: string) => void;
  clienteNombre: string;
  deudaActual: number;
}

export const PagoModal = ({ isOpen, onClose, onSave, clienteNombre, deudaActual }: PagoModalProps) => {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const montoNum = parseFloat(monto);
    if (montoNum > 0 && montoNum <= deudaActual) {
      onSave(montoNum, descripcion);
      setMonto('');
      setDescripcion('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Registrar Pago</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <div className="text-sm font-medium p-2 bg-muted rounded">{clienteNombre}</div>
          </div>

          <div className="space-y-2">
            <Label>Deuda Actual</Label>
            <div className="text-lg font-bold text-destructive p-2 bg-muted rounded">
              S/. {deudaActual.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto">Monto a Pagar</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              min="0.01"
              max={deudaActual}
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Pago parcial, Pago completo..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Registrar Pago
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
