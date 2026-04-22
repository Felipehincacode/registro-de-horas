import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Usa la exportación CSV desde el dashboard para incluir filtros del cliente.'
  });
}
