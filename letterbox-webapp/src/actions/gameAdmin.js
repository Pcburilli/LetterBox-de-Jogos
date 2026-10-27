'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { AddJogo ,DeletarJogo, AlterarDadosJogo } from '@/services/api';

export async function addGameAction(dataGame) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const isLoggedIn = cookieStore.has('session');

  if (!isLoggedIn) {
    return { success: false, error: 'Usuário não autenticado.' };
  }
  if (!dataGame.source || !['api', 'rawg'].includes(dataGame.source)) {
    return { success: false, error: 'Source inválido ou incorreto.' };
  }

  try {
    const response = await AddJogo(dataGame, cookieHeader);

    if (response.ok) {
      revalidatePath('/admin/games');

      return { success: true, status: 200 };
    }

    return { success: false, status: response.status, error: 'Jogo já cadastrado/Erro ao adicionar.' };
  } catch (error) {
    console.error('Falha na conexão:', error);
    return { success: false, error: 'Erro de conexão com o servidor.' };
  }
}

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

export async function alterarGameAction(gameId, data, slug) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const isLoggedIn = cookieStore.has('session');

  if (!isLoggedIn) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  try {
    const response = await AlterarDadosJogo(gameId, data, cookieHeader);

    if (response.ok) {
      const resData = await response.json();
      const name_slug = resData.game?.name_slug;

      revalidatePath(`/admin/games/${slug}`);
      return { success: true, status: 200, name_slug: name_slug };
    }

    return { success: false, status: response.status, error: 'Erro ao alterar dados do jogo.' };
  } catch (error) {
    console.error('Falha na conexão:', error);
    return { success: false, error: 'Erro de conexão com o servidor.' };
  }
}
