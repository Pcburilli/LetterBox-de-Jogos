'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { AlterarStatusJogo, DeleteJogoCatalogo, adicionarAoCatalogo } from '@/services/api';

export async function alterarStatusGameAction(gameId, newStatus, slug) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const isLoggedIn = cookieStore.has('session');

  if (!isLoggedIn) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  try {
    const response = await AlterarStatusJogo(gameId, newStatus, cookieHeader);

    if (response.ok) {
      revalidatePath('/perfil');
      if (slug) revalidatePath(`/games/${slug}`);

      return { success: true, status: 200 };
    }

    if (response.status === 409) {
      return { success: false, status: 409, error: 'Status igual ao atual.' };
    }

    return { success: false, status: response.status, error: 'Erro ao alterar o status.' };
  } catch (error) {
    console.error('Falha na conexão:', error);
    return { success: false, error: 'Erro de conexão com o servidor.' };
  }
}

export async function deleteGameAction(gameId, slug) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const isLoggedIn = cookieStore.has('session');

  if (!isLoggedIn) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  try {
    const response = await DeleteJogoCatalogo(gameId, cookieHeader);

    if (response.ok) {
      revalidatePath('/perfil');
      if (slug) revalidatePath(`/games/${slug}`);

      return { success: true };
    }

    return { success: false, error: 'Erro ao deletar o jogo do catálogo.' };
  } catch (error) {
    console.error('Falha na conexão:', error);
    return { success: false, error: 'Erro de conexão com o servidor.' };
  }
}

export async function addGameAction(gameId, slug) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const isLoggedIn = cookieStore.has('session');

  if (!isLoggedIn) {
    return { success: false, error: 'Usuário não autenticado.' };
  }
  
  try {
    const response = await adicionarAoCatalogo(gameId, cookieHeader);

    if (response.ok) {
      revalidatePath('/perfil');
      if (slug) revalidatePath(`/games/${slug}`);

      return { success: true };
    }

    return { success: false, error: 'Erro ao adicionar o jogo do catálogo.' };
  } catch (error) {
    console.error('Falha na conexão:', error);
    return { success: false, error: 'Erro de conexão com o servidor.' };
  }
}