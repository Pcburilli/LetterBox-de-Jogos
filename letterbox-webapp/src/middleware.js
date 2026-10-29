import { NextResponse } from 'next/server';

export async function middleware(request) {
    // Captura a string do token
    const token = request.cookies.get('session')?.value; // obter token
    const { pathname } = request.nextUrl; // rota do usuario

    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/users', request.url));
    } // Se acessar /login com token redireciona para /users

    if (pathname === '/register' && token) {
        return NextResponse.redirect(new URL('/users', request.url));
    } // Se acessar /register com token redireciona para /users

    if (pathname === '/users' && token === undefined) {
        return NextResponse.redirect(new URL('/login', request.url));
    } else if (pathname === '/users' && token) {
        try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie': `session=${token}`},
                cache: 'no-store' 
            });

            const dados = await response.json();
            return NextResponse.redirect(new URL(`/users/${dados.username}`, request.url));

        } catch (error) {
            console.error('Erro de autenticação no middleware:', error);
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/', request.url))
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
                return NextResponse.redirect(new URL('/', request.url));
            }

        } catch (error) {
            console.error('Erro:', error);
            return NextResponse.redirect(new URL('/', request.url));
        }
    } // Se acessar o camnho /admin sem Login redireicona para /. Se acessar logado, mas não for admin, redireciona para /
    
    return NextResponse.next();
}

// Configuração para interceptar as rotas
export const config = {
    matcher: ['/menu/:path*', '/login', '/register', '/users', '/search', '/admin/:path*'],
};