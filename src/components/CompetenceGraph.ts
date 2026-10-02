import type { Job } from '../models/Job';
import type { Candidate } from '../models/Candidate';
import Chart from 'chart.js/auto';
import { countCompetences } from './competenceCounts';

export function CompetenceGraph(job: Job, candidates: Candidate[]): HTMLElement {
    const article = document.createElement('article');
    article.classList.add('competence-graph');

    const title = document.createElement('h2');
    title.textContent = `Competências da vaga: ${job.title}`;
    article.appendChild(title);

    const { labels, data } = countCompetences(job, candidates);
    if (labels.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'Esta vaga não possui competências cadastradas.';
        article.appendChild(message);
        return article;
    }

    const container = document.createElement('div');
    container.classList.add('competence-graph-canvas');
    const canvas = document.createElement('canvas');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', labels.map((skill, index) => `${skill}: ${data[index]} candidatos`).join('; '));
    container.appendChild(canvas);
    article.appendChild(container);

    // A página é montada depois que o componente retorna; aguarda para medir o canvas.
    requestAnimationFrame(() => {
        if (!canvas.isConnected) return;
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Quantidade de candidatos',
                    data,
                    backgroundColor: '#176b5b',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { precision: 0 } }
                }
            }
        });
    });
    return article;
}

export function destroyCompetenceGraphs(container: HTMLElement): void {
    container.querySelectorAll('canvas').forEach((canvas) => Chart.getChart(canvas)?.destroy());
}
