import { Plane, Building2, PlaneTakeoff, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const metrics = [
  { title: 'Aeropuertos', value: '12', icon: Plane, color: 'text-blue-600', bg: 'bg-blue-100' },
  { title: 'Aerolíneas', value: '8', icon: Building2, color: 'text-green-600', bg: 'bg-green-100' },
  { title: 'Aviones', value: '45', icon: PlaneTakeoff, color: 'text-purple-600', bg: 'bg-purple-100' },
  { title: 'Conceptos', value: '24', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-100' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">Resumen del sistema de gestión aeroportuaria</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{m.title}</CardTitle>
              <div className={`rounded-lg ${m.bg} p-2`}>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
