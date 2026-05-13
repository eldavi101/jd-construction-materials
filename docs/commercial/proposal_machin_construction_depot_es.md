# Propuesta Comercial y Tecnica

Proyecto: J&D Construction Materials  
Tipo: E-commerce custom desarrollado a codigo (sin Shopify ni WordPress)  
Objetivo: Vender materiales de construccion online con inventario, pagos integrados y posicionamiento en Google + motores de IA.

Fecha: 2026-05-11

## 1) Alcance MVP (incluido)

1. Catalogo de productos con categorias, buscador y filtros basicos.
2. Pagina de producto con galeria, precio, stock y descripcion optimizada para SEO.
3. Carrito y checkout con Stripe.
4. Panel admin para inventario:
   - SKU
   - stock
   - alertas de bajo inventario
   - actualizacion manual de existencias
5. Panel admin para ordenes:
   - estados de pedido
   - detalle de cliente
   - historial de cambios
6. SEO tecnico base:
   - sitemap.xml automatico
   - robots.txt
   - metadata dinamica
   - canonical tags
   - Open Graph
   - Schema JSON-LD
7. GEO/IA base:
   - contenido semantico estructurado
   - FAQs por producto
   - llms.txt inicial
8. Analytics inicial:
   - GA4 + eventos clave de e-commerce
9. Deploy en produccion y configuracion inicial de dominio y SSL.

## 2) Stack Tecnologico

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: NestJS
- Base de datos: PostgreSQL + Prisma ORM
- Pagos: Stripe
- Infraestructura recomendada:
  - Frontend: Vercel
  - Backend: Railway o Render
  - Database: Neon o Supabase (PostgreSQL)
  - DNS/CDN/SSL: Cloudflare
  - Imagenes: Cloudinary

## 3) Entregables

1. Codigo fuente completo en repositorio Git.
2. Modelo de datos y migraciones.
3. Admin funcional de inventario y ordenes.
4. Checkout Stripe funcional en produccion.
5. SEO tecnico implementado en el MVP.
6. Documentacion operativa basica y handoff.

## 4) Cronograma Estimado

- Semana 1: Discovery, requerimientos finales y arquitectura.
- Semana 2 a 4: Catalogo, producto, carrito, auth/admin base.
- Semana 5 a 6: Inventario, ordenes, Stripe, emails transaccionales.
- Semana 7: SEO tecnico + GEO/IA base.
- Semana 8: QA, performance, hardening, lanzamiento.

Duracion total estimada: 8 semanas (MVP profesional).

## 5) Inversion

Precio familiar recomendado: **USD 9,500**

Esquema de pago por hitos:

1. 40% al iniciar: USD 3,800
2. 30% en hito medio: USD 2,850
3. 20% pre-lanzamiento: USD 1,900
4. 10% cierre y estabilizacion: USD 950

Servicios opcionales:

- Mantenimiento mensual: USD 350/mes
- SEO + GEO mensual: USD 900/mes

## 6) Costos Externos (a cargo del cliente)

1. Dominio: USD 15 a 30/anual
2. Hosting + DB + CDN + media: USD 120 a 450/mes (segun trafico)
3. Comisiones Stripe: segun estructura vigente de Stripe
4. Email transaccional y herramientas: USD 20 a 120/mes

## 7) No Incluido en MVP

1. Integraciones ERP complejas o contabilidad avanzada.
2. Multi-warehouse avanzado con reglas logisticas complejas.
3. Aplicacion movil nativa.
4. BI avanzado y automatizaciones enterprise.
5. Produccion masiva de contenido editorial inicial.

## 8) Garantia y Soporte

1. Garantia tecnica de 30 dias post-lanzamiento para bugs del alcance aprobado.
2. Cambios fuera de alcance se cotizan por separado.
3. Entregas por hitos con demos funcionales.

## 9) Siguiente Paso

1. Aprobacion de esta propuesta.
2. Pago inicial del 40%.
3. Kickoff y cierre de requerimientos en 48-72 horas.
4. Inicio Sprint 1.

---

## 10) Firma

Cliente: _________________________  
Fecha: ___________________________  

Proveedor: _______________________  
Fecha: ___________________________
