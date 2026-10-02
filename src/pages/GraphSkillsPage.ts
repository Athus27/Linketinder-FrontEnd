import { CompetenceGraph, destroyCompetenceGraphs } from '../components/CompetenceGraph';
import { app } from '../main';
import './GraphSkillsPage.css';

export function GraphSkillsPage(): HTMLElement {
    const main = document.createElement('main');
    main.classList.add('graph-skills');

    const title = document.createElement('h1');
    title.textContent = 'Contagem de competências por vaga';
    const description = document.createElement('p');
    description.textContent = 'Selecione uma vaga para ver quantos candidatos cadastrados possuem cada competência exigida.';
    main.append(title, description);

    const jobs = app.getJobs();
    const message = document.createElement('p');
    message.setAttribute('aria-live', 'polite');
    if (jobs.length === 0) {
        message.textContent = 'Cadastre uma vaga para gerar o gráfico.';
        main.appendChild(message);
        return main;
    }

    const label = document.createElement('label');
    label.htmlFor = 'job-select';
    label.textContent = 'Vaga';
    const jobSelect = document.createElement('select');
    jobSelect.id = 'job-select';
    jobSelect.name = 'job-select';
    jobSelect.appendChild(new Option('Selecione uma vaga', ''));
    jobs.forEach((job) => jobSelect.appendChild(new Option(job.title, job.id)));

    const generateButton = document.createElement('button');
    generateButton.type = 'button';
    generateButton.textContent = 'Gerar gráfico';
    generateButton.disabled = true;
    const graphContainer = document.createElement('div');

    function generateGraph(): void {
        destroyCompetenceGraphs(graphContainer);
        graphContainer.replaceChildren();
        const job = app.getJobs().find((currentJob) => currentJob.id === jobSelect.value);
        generateButton.disabled = !job;
        message.textContent = '';
        if (!job) return;

        const candidates = app.getCandidates();
        if (candidates.length === 0) {
            message.textContent = 'Não há candidatos cadastrados. As competências terão contagem zero.';
        }
        graphContainer.appendChild(CompetenceGraph(job, candidates));
    }

    jobSelect.addEventListener('change', generateGraph);
    generateButton.addEventListener('click', generateGraph);
    main.append(label, jobSelect, generateButton, message, graphContainer);
    return main;
}
