function getScoreColor(score) {
  if (score <= 25) return '#22c55e'; // green
  if (score <= 50) return '#eab308'; // yellow
  if (score <= 75) return '#f97316'; // orange
  return '#ef4444'; // red
}

export function renderOverlay(result) {
  const panel = document.createElement('div');

  panel.style.position = 'fixed';
  panel.style.top = '120px';
  panel.style.right = '20px';
  panel.style.width = '280px';
  panel.style.background = '#fff';
  panel.style.border = '1px solid #ddd';
  panel.style.padding = '12px';
  panel.style.zIndex = 9999;
  panel.style.fontFamily = 'Arial';
  panel.style.borderRadius = '8px';
  panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

  const heading = document.createElement('h3');
  heading.textContent = 'Candidate Authenticity';
  heading.style.margin = '0 0 8px 0';
  panel.appendChild(heading);

  const scoreLine = document.createElement('strong');
  scoreLine.textContent = `Risk Score: ${result.score}/100`;
  scoreLine.style.color = getScoreColor(result.score);
  panel.appendChild(scoreLine);

  const list = document.createElement('ul');
  list.style.paddingLeft = '18px';
  list.style.marginTop = '8px';
  for (const signal of result.signals) {
    const li = document.createElement('li');
    li.textContent = signal;
    list.appendChild(li);
  }
  panel.appendChild(list);

  document.body.appendChild(panel);
}
