import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Pencil, ToggleLeft, ToggleRight } from "lucide-react";

const Equipo = () => {
  const operadores = [
    { id: 1, nombre: "Carlos Mendoza", iniciales: "CM", celular: "987 654 321", activo: true },
    { id: 2, nombre: "Lucía Torres", iniciales: "LT", celular: "956 123 789", activo: true },
    { id: 3, nombre: "Miguel Ángel", iniciales: "MA", celular: "912 456 789", activo: false },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Equipo</h1>
            <p className="text-muted-foreground mt-1">Administra a tus operadores</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Operador
          </Button>
        </div>

        {/* Lista de operadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operadores.map((operador) => (
            <Card key={operador.id} className="p-6 shadow-card">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 bg-primary text-primary-foreground">
                  <AvatarFallback className="text-lg">{operador.iniciales}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{operador.nombre}</h3>
                  <p className="text-sm text-muted-foreground">📱 {operador.celular}</p>
                  <Badge 
                    className="mt-2"
                    variant={operador.activo ? "default" : "secondary"}
                  >
                    {operador.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  {operador.activo ? (
                    <>
                      <ToggleLeft className="h-4 w-4" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <ToggleRight className="h-4 w-4" />
                      Activar
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Equipo;
