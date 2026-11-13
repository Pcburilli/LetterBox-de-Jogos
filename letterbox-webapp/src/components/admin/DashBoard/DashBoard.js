'use client'

import { useState } from "react"
import Link from "next/link"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts"

const CORES_STATUS = ['#38bdf8', '#fbbf24', '#34d399', '#f87171']
const CORES_REVIEWS = ['#a855f7', '#475569']

export default function DashBoard({ data }) {
    const [temaAtivo, setTemaAtivo] = useState('Jogos Cadastrados')

    const temas = [
        {
            tema: 'Jogos Cadastrados',
            qtd: data?.qtd_games ?? 0,
        },
        {
            tema: 'Reviews Cadastradas',
            qtd: data?.qtd_reviews ?? 0,
        },
        {
            tema: 'Jogos em Bibliotecas',
            qtd: data?.qtd_jogos_biblioteca ?? 0,
        },
    ]

    const trocarTema = (e, tema) => {
        e.preventDefault()
        if (temaAtivo === tema) return
        setTemaAtivo(tema)
    }

    // Formatação dos dados para o Recharts
    const generosData = Object.entries(data?.generos || {}).map(([name, qtd]) => ({
        name,
        qtd,
    }))

    const reviewsData = [
        { name: 'Com Texto', value: data?.detalhes_reviews?.com_texto || 0 },
        { name: 'Apenas Nota', value: data?.detalhes_reviews?.apenas_nota || 0 },
    ]

    const statusData = Object.entries(data?.status || {}).map(([name, value]) => ({
        name,
        value,
    }))

    return (
        <div className="flex flex-col w-full gap-6">
            {/* Cards de seleção de tema */}
            <div className="flex w-full gap-2">
                {temas.map((tema) => {
                    const isSelected = temaAtivo === tema.tema
                    return (
                        <div
                            key={tema.tema}
                            onClick={(e) => trocarTema(e, tema.tema)}
                            className={`flex flex-col h-30 w-full ${
                                isSelected ? 'bg-primary-700/70 ring-2 ring-primary-400' : 'bg-primary-600'
                            } hover:bg-primary-700/70 rounded-2xl p-2 justify-center items-center cursor-pointer transition-all`}
                        >
                            <p className="text-2xl font-bold">{tema.qtd}</p>
                            <h1 className="text-center">{tema.tema}</h1>
                        </div>
                    )
                })}
            </div>

            {/* Área dinâmica do tema selecionado */}
            <div className="w-full">
                <h1 className="text-xl font-semibold mb-4">{temaAtivo}</h1>

                {/* TEMA 1: JOGOS CADASTRADOS -> Gráfico de Gêneros */}
                {temaAtivo === 'Jogos Cadastrados' && (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                        <h2 className="text-sm text-slate-400 mb-4">Distribuição de Jogos por Gênero</h2>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={generosData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                                    <Tooltip
                                        cursor={{ fill: '#1e293b', opacity: 0.4 }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="qtd" name="Jogos" fill="#818cf8" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* TEMA 2: REVIEWS CADASTRADAS -> Média Geral + Pizza + Ranking */}
                {temaAtivo === 'Reviews Cadastradas' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                            <div>
                                <h2 className="text-sm text-slate-400">Nota Média Geral</h2>
                                <p className="text-4xl font-bold text-amber-400 mt-1">
                                    ★ {Number(data?.media_geral || 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="h-60 w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={reviewsData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={75}
                                        >
                                            {reviewsData.map((_, index) => (
                                                <Cell key={index} fill={CORES_REVIEWS[index % CORES_REVIEWS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                            <h2 className="text-sm text-slate-400 mb-4">Nota Média por Jogo</h2>
                            <div className="overflow-x-auto overflow-y-auto max-h-72 pr-4">
                                <table className="w-full text-left text-sm">
                                    <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400">
                                        <tr>
                                            <th className="pb-2 pl-2 pt-2">Jogo</th>
                                            <th className="pb-2 pt-2 text-center">Avaliações</th>
                                            <th className="pb-2 pt-2 text-right pr-2">Média</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {data?.medias_por_jogo?.map((jogo) => (
                                            <tr key={jogo.id} className="hover:bg-slate-800/40 transition-colors">
                                                <td className="py-2.5 pr-3 pl-2 font-medium">
                                                    <Link href={`/admin/games/${jogo.name_slug}`} className="hover:text-primary-300">
                                                        {jogo.name}
                                                    </Link>
                                                </td>
                                                <td className="py-2.5 text-center text-slate-400">{jogo.qtd_avaliacoes}</td>
                                                <td className="py-2.5 text-right text-amber-400 font-semibold whitespace-nowrap pr-2">
                                                    ★ {Number(jogo.media_nota).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TEMA 3: JOGOS EM BIBLIOTECAS -> Evolução Mensal + Rosca de Status */}
                {temaAtivo === 'Jogos em Bibliotecas' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                            <h2 className="text-sm text-slate-400 mb-4">Adicionados às Bibliotecas (Por Mês)</h2>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data?.evolucao_biblioteca_mensal || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
                                        <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="qtd"
                                            name="Jogos"
                                            stroke="#6366f1"
                                            fill="#6366f1"
                                            fillOpacity={0.2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                            <h2 className="text-sm text-slate-400 mb-4">Distribuição por Status</h2>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={4}
                                        >
                                            {statusData.map((_, index) => (
                                                <Cell key={index} fill={CORES_STATUS[index % CORES_STATUS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}