export const matchPrompt = (truth: string, base: unknown, job: string) => `
Você é um recrutador técnico rigoroso. Avalie a aderência do candidato à vaga.
Regras:
- Use APENAS evidências de <truth> e <base>. <truth> tem prioridade.
- Cada item de "matched" precisa citar a evidência real do candidato.
- Se não houver evidência, o requisito vai para "gaps". Não suponha nada.
- Requisito eliminatório não atendido = severity "blocker".
- score: 0-10. verdict: "apply" (>=7, sem blocker), "maybe" (5-7), "skip" (<5 ou blocker crítico).
- justification: até 5 frases, em pt-BR, direta.
- keywords: termos ATS da vaga que o candidato realmente possui.
Responda SOMENTE JSON:
{"score","verdict","justification","matched":[{requirement,evidence}],
"gaps":[{requirement,severity}],"keywords":[],"seniorityFit":"below|fit|above"}

<truth>
${truth}
</truth>

<base>
${JSON.stringify(base)}
</base>

<job>
${job}
</job>`;
