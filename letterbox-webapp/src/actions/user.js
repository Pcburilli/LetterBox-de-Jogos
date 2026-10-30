'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { AlterarUsernamePerfil, AlterarIconPerfil } from '@/services/api';

export async function alterarUsernameAction(username) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const isLoggedIn = cookieStore.has('session');

  if (!isLoggedIn) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  try {
    const response = await AlterarUsernamePerfil(username, cookieHeader);

    if (response.ok) {
      return { success: true, status: 200 };
    } else if(response.status === 400) {
      return { success: false, status: response.status, error: 'Erro ao atualizar username. Não deve conter caracteres especiais.' };
    }

    return { success: false, status: response.status, error: 'Erro ao atualizar username.' };
  } catch (error) {
    console.error('Falha na conexão:', error);
    return { success: false, error: 'Erro de conexão com o servidor.' };
  }
}

export async function alterarIconAction(icon) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const isLoggedIn = cookieStore.has('session');

  if (!isLoggedIn) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  try {
    const response = await AlterarIconPerfil(icon, cookieHeader);

    if (response.ok) {
      revalidatePath('/perfil');

      return { success: true, status: 200 };
    }
    console.log('teste')

    return { success: false, status: response.status, error: 'Erro ao atualizar username.' };
  } catch (error) {
    console.error('Falha na conexão:', error);
    return { success: false, error: 'Erro de conexão com o servidor.' };
  }
}