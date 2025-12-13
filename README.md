#  Registro de Voluntarios – Aplicación Web Angular

Aplicación web desarrollada en **Angular** para la gestión de voluntarios y actividades, permitiendo registrar, visualizar, editar y eliminar información de manera segura y ordenada. El sistema está orientado a organizaciones que requieren administrar equipos de voluntarios de forma eficiente.


## Tecnologías Utilizadas

- **Angular** (Framework frontend)
- **TypeScript** (Lenguaje principal)
- **HTML5** y **CSS3** (Estructura y estilos)
- **Angular Standalone Components**
- **Angular Router** (Navegación)
- **Reactive Forms** (Formularios reactivos)
- **RxJS** (Programación reactiva)
- **Firebase Authentication** (Autenticación de usuarios)
- **Firebase Firestore** (Base de datos NoSQL)
- **Firebase Hosting** (Despliegue de la aplicación)
- **Git & GitHub** (Control de versiones)

---

## Requisitos para Instalar y Ejecutar el Proyecto

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js**
- **Angular CLI**
- **Git**
- Navegador web moderno

### 🔧 Instalación de Angular CLI

```bash
npm install -g @angular/cli

## Instalación y Ejecución del Proyecto

Clonar el repositorio:

```bash
git clone https://github.com/adlermaher/registro-de-voluntarios

cd registro-de-voluntarios
npm install
ng serve
## URL Del hosting
https://registro-voluntarios-3f8d7-default-rtdb.firebaseio.com/

## Arquitectura del Proyecto

La aplicación utiliza una arquitectura basada en componentes y servicios, siguiendo las buenas prácticas del framework Angular.

## Componentes Principales

AppComponent: Componente raíz de la aplicación.

NavbarComponent: Barra de navegación principal.

VolunteerListComponent: Listado y búsqueda de voluntarios.

VolunteerFormComponent: Registro y edición de voluntarios.

ActivityComponents: Gestión de actividades.

AuthComponents: Inicio y cierre de sesión.

## Servicios

AuthService: Gestión de autenticación mediante Firebase Authentication.

VolunteerService: Operaciones CRUD de voluntarios usando Firestore.

ActivityService: Gestión de actividades.

Guards de autenticación para la protección de rutas.

La comunicación entre componentes y servicios se realiza mediante Observables (RxJS).
## URL Del hosting
https://registro-voluntarios-3f8d7-default-rtdb.firebaseio.com/