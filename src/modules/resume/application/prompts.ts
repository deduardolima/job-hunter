export const extractionPrompt = (text: string, truth: string | null, exclusions: string[]) => `
Você extrai currículos para JSON. Regras:
- Use APENAS fatos presentes em <resume> e <truth>. <truth> tem prioridade em conflitos.
- Nunca invente empresas, datas, métricas ou tecnologias.
- Datas no formato YYYY-MM; cargo atual usa "end": null.
- Mantenha TODAS as posições, da mais recente para a mais antiga.
- Nunca inclua estes itens: ${JSON.stringify(exclusions)}
- Responda SOMENTE com JSON válido neste formato:
{"name","headline","contact":{email,phone,linkedin,github,location},"summary",
"experience":[{company,title,start,end,location,bullets[],technologies[]}],
"education":[{institution,degree,start,end}],"skills":[],"certifications":[],
"languages":[{name,level}]}

<truth>
${truth ?? '(vazio)'}
</truth>

<resume>
${text}
</resume>`;

export const repairPrompt = (raw: string, error: string) => `
O JSON abaixo é inválido: ${error}
Corrija e devolva SOMENTE o JSON válido, sem adicionar fatos novos.
${raw}`;
