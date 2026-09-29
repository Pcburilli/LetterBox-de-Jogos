import { NextResponse } from 'next/server';

export async function middleware(request) {
    // Captura a string do token
    const token = request.cookies.get('session')?.value; // obter token
    const { pathname } = request.nextUrl; // rota do usuario

    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/perfil', request.url));
    } // Se acessar /login com token redireciona para /perfil

    if (pathname === '/register' && token) {
        return NextResponse.redirect(new URL('/perfil', request.url));
    } // Se acessar /register com token redireciona para /perfil

    if (pathname === '/perfil' && token === undefined) {
        return NextResponse.redirect(new URL('/login', request.url));
    } // Se acessar /perfil sem token redireciona para /login

    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        try {
            const response = await fetch('http://localhost:5000/api/auth/admin', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie': `session=${token}` 
                 }
            });

            if (!response.ok) {
                console.log('Acesso negado pelo Flask:', response.status);
                return NextResponse.redirect(new URL('/perfil', request.url));
            }

        } catch (error) {
            console.error('Erro:', error);
            return NextResponse.redirect(new URL('/perfil', request.url));
        }
    } // Se acessar o camnho /admin sem Login redireicona para /login. Se acessar logado, mas não for admin, redireciona para /perfil
    
    return NextResponse.next();
}

// Configuração para interceptar as rotas
export const config = {
    matcher: ['/menu/:path*', '/login', '/register', '/perfil', '/admin/:path*'],
};