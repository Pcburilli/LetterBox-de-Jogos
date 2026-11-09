'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { AlterarUsernamePerfil, AlterarIconPerfil, DeleteUser, DeleteReview } from '@/services/api';

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

    return { success: false, status: response.status, error: 'Erro ao atualizar username.' };
  } catch (error) {
    console.error('Falha na conexão:', error);
    return { success: false, error: 'Erro de conexão com o servidor.' };
  }
}

/* users em admin */

export async function deleteUserAction(id) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const isLoggedIn = cookieStore.has('session');

  if (!isLoggedIn) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  try {
    const response = await DeleteUser(id, cookieHeader);

    if (response.ok) {
      revalidatePath('/admin/users');

      return { success: true, status: 200 };
    } else if (response.status === 403) {
      return { success: false, status: 403, error: 'Usuário é admin.'};
    }

    return { success: false, status: response.status, error: 'Erro ao excluir usuário.' };
  } catch (error) {
    console.error('Falha na conexão:', error);
    return { success: false, error: 'Erro de conexão com o servidor.' };
  }
}

export async function deleteReviewAction(id) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const isLoggedIn = cookieStore.has('session');

  if (!isLoggedIn) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  try {
    const response = await DeleteReview(id, cookieHeader);

    if (response.ok) {
      revalidatePath('/admin/users');

      return { success: true, status: 200 };
    }

    return { success: false, status: response.status, error: 'Erro ao excluir review.' };
  } catch (error) {
    console.error('Falha na conexão:', error);
    return { success: false, error: 'Erro de conexão com o servidor.' };
  }
}
