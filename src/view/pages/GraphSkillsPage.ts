import { CompetenceGraph, destroyCompetenceGraphs } from '../components/charts/CompetenceGraph';
import type { Job } from '../../models/Job';
import type { Candidate } from '../../models/Candidate';
import './GraphSkillsPage.css';

export function GraphSkillsPage(
    buscarVagas: () => Promise<Job[]>,
    buscarCandidatos: () => Promise<Candidate[]>
): HTMLElement {
    const main = document.createElement('main');
    main.classList.add('graph-skills');

    const title = document.createElement('h1');
    title.textContent = 'Contagem de competências por vaga';
    const description = document.createElement('p');
    description.textContent = 'Selecione uma vaga para ver quantos candidatos cadastrados possuem cada competência exigida.';
    main.append(title, description);

    let jobs: Job[] = [];
    let candidates: Candidate[] = [];
    const message = document.createElement('p');
    message.setAttribute('aria-live', 'polite');
    message.textContent = 'Carregando vagas e competências dos candidatos...';

    const label = document.createElement('label');
    label.htmlFor = 'job-select';
    label.textContent = 'Vaga';
    const jobSelect = document.createElement('select');
    jobSelect.id = 'job-select';
    jobSelect.name = 'job-select';
    jobSelect.appendChild(new Option('Selecione uma vaga', ''));
    jobSelect.disabled = true;

    const generateButton = document.createElement('button');
    generateButton.type = 'button';
    generateButton.textContent = 'Gerar gráfico';
    generateButton.disabled = true;
    const graphContainer = document.createElement('div');

    function generateGraph(): void {
        destroyCompetenceGraphs(graphContainer);
        graphContainer.replaceChildren();
        const job = jobs.find((currentJob) => currentJob.id === jobSelect.value);
        generateButton.disabled = !job;
        message.textContent = '';
        if (!job) return;

        if (candidates.length === 0) {
            message.textContent = 'Não há candidatos cadastrados. As competências terão contagem zero.';
        }
        graphContainer.appendChild(CompetenceGraph(job, candidates));
    }

    jobSelect.addEventListener('change', generateGraph);
    generateButton.addEventListener('click', generateGraph);
    main.append(label, jobSelect, generateButton, message, graphContainer);
    async function loadData(): Promise<void> {
        try {
            [jobs, candidates] = await Promise.all([buscarVagas(), buscarCandidatos()]);
            jobs.forEach((job) => jobSelect.appendChild(new Option(job.title, job.id)));
            jobSelect.disabled = jobs.length === 0;
            message.textContent = jobs.length === 0 ? 'Cadastre uma vaga para gerar o gráfico.' : '';
        } catch {
            message.textContent = 'Não foi possível carregar os dados do gráfico. Tente novamente.';
        }
    }
    void loadData();
    return main;
}
