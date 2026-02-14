# Sistema de Gestión: Refaccionaria "El Rayo"

Este proyecto es una aplicación web Full-Stack diseñada para la administración profesional de inventarios de refacciones automotrices. Implementa un sistema de seguridad basado en tokens y una arquitectura de persistencia de datos relacional.

---

## 1. Documentación del Proyecto

### Requerimientos Funcionales (RF)
* **RF-01 Autenticación:** El sistema permite el registro de nuevos usuarios y el inicio de sesión seguro mediante JSON Web Tokens (JWT).
* **RF-02 Gestión CRUD:** Los usuarios autenticados pueden crear, leer, actualizar y eliminar registros de refacciones en tiempo real.
* **RF-03 Cifrado de Datos:** Las contraseñas de los usuarios se almacenan cifradas mediante algoritmos de hash (bcrypt).
* **RF-04 Protección de Rutas:** Solo usuarios con un token válido pueden realizar modificaciones (POST, PUT, DELETE) en el inventario.

### Requerimientos No Funcionales (RNF)
* **RNF-01 Interfaz de Usuario:** Diseño responsivo desarrollado con Bootstrap 5, optimizado para alto contraste y legibilidad.
* **RNF-02 Persistencia:** Uso de SQLite3 como motor de base de datos ligero y eficiente para la gestión de archivos locales.
* **RNF-03 Disponibilidad:** Despliegue en plataforma SaaS (Render) para garantizar acceso remoto 24/7.
* **RNF-04 Seguridad de API:** Implementación de cabeceras de autorización Bearer para la comunicación cliente-servidor.

---

## 2. Diagrama Entidad-Relación (E-R)

El sistema se basa en un modelo relacional sencillo pero robusto:

**Entidad: USUARIOS**
- `id` (Llave Primaria, Autoincrementable)
- `email` (Texto, Único, Obligatorio)
- `password` (Texto, Cifrado)

**Entidad: PRODUCTOS**
- `id` (Llave Primaria, Autoincrementable)
- `numero_parte` (Texto, Único)
- `nombre` (Texto)
- `marca` (Texto)
- `precio` (Numérico)
- `stock` (Entero)

*Relación:* El sistema valida que solo los usuarios existentes en la tabla `usuarios` puedan generar cambios en la tabla `productos`.

---

## 3. Justificación de la Plataforma SaaS (Render)

Se seleccionó **Render** como la plataforma para el despliegue de la aplicación por las siguientes razones técnicas:
1. **Infraestructura Gestionada:** Al ser un modelo SaaS, elimina la necesidad de configurar servidores manuales o entornos de ejecución complejos.
2. **Ciclo de Vida Automático:** Permite la Integración Continua (CI) sincronizada con GitHub, facilitando actualizaciones inmediatas.
3. **Manejo de Binarios:** Render permite la compilación nativa de librerías como SQLite3 en entornos Linux, garantizando la estabilidad de la base de datos.

---

## 4. Acceso y Ejecución

**Enlace del Proyecto en Vivo:** `https://refa-final.onrender.com/` 

**Credenciales de Acceso Rápido:**
- **Usuario:** `admin@test.com`
- **Contraseña:** `123456`

**Instalación Local:**
```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar servidor
node index.js

# 3. Ejecutar pruebas unitarias
npm test