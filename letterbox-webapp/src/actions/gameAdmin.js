'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { DeletarJogo } from '@/services/api';

export async function deletarGameAction(gameId) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const isLoggedIn = cookieStore.has('session');

  if (!isLoggedIn) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  try {
    const response = await DeletarJogo(gameId, cookieHeader);

    if (response.ok) {
      revalidatePath('/admin/games');

      return { success: true, status: 200 };
    }

    return { success: false, status: response.status, error: 'Erro ao deletar jogo.' };
  } catch (error) {
    console.error('Falha na conexão:', error);
    return { success: false, error: 'Erro de conexão com o servidor.' };
  }
}
