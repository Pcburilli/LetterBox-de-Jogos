import { NextResponse } from 'next/server';

export function middleware(request) {
    // Captura a string do token
    const token = request.cookies.get('token_usuario')?.value; // obter token

    const { pathname } = request.nextUrl; // rota do usuario

    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/', request.url));
    } // Se acessar /login com token redireciona para /menu (TESTANDO)

    if (pathname === '/register' && token) {
        return NextResponse.redirect(new URL('/', request.url));
    } // Se acessar /login com token redireciona para /menu (TESTANDO)
    
    return NextResponse.next();
}

// Configuração para interceptar as rotas
export const config = {
    matcher: ['/menu/:path*', '/login', '/register'],
};