import { NextResponse } from 'next/server';

export function middleware(request) {
    // Captura a string do token
    const token = request.cookies.get('session')?.value; // obter token
    const { pathname } = request.nextUrl; // rota do usuario

    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/perfil', request.url));
    } // Se acessar /login com token redireciona para /menu (TESTANDO)

    if (pathname === '/register' && token) {
        return NextResponse.redirect(new URL('/perfil', request.url));
    } // Se acessar /login com token redireciona para /menu (TESTANDO)

    if (pathname === '/perfil' && token === undefined) {
        return NextResponse.redirect(new URL('/login', request.url));
    } // Se acessar /perfil sem token redireciona para /login (TESTANDO)
    
    return NextResponse.next();
}

// Configuração para interceptar as rotas
export const config = {
    matcher: ['/menu/:path*', '/login', '/register', '/perfil', '/admin'],
};